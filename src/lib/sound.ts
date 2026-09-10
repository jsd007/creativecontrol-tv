import { usePrefersReducedMotion } from "@/lib/motion";
import { useCallback, useSyncExternalStore } from "react";

export type HouseVoice = "threshold" | "acquire" | "cut" | "tape";

const HOUSE_SRC: Record<HouseVoice, string> = {
  threshold: "/sound/threshold.wav",
  acquire: "/sound/acquire.wav",
  cut: "/sound/cut.wav",
  tape: "/sound/tape.wav",
};

let ctx: AudioContext | null = null;
let enabled = false;
let room: { stop: () => void } | null = null;
let load: Promise<void> | null = null;
const buffers = new Map<HouseVoice, AudioBuffer>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function context() {
  if (typeof window === "undefined" || !enabled) return null;
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function isSoundEnabled() {
  return enabled;
}

export function subscribeSound(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function gate() {
  const ac = context();
  if (!enabled || !ac || ac.state === "suspended") return null;
  return ac;
}

function saturator() {
  const curve = new Float32Array(1024);
  for (let i = 0; i < curve.length; i += 1) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * 1.18);
  }
  return curve;
}

function houseBus(ac: AudioContext, gain: number) {
  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 68;
  hp.Q.value = 0.7;
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 6800;
  lp.Q.value = 0.65;
  const shaper = ac.createWaveShaper();
  shaper.curve = saturator();
  shaper.oversample = "2x";
  const g = ac.createGain();
  g.gain.value = gain;
  hp.connect(lp);
  lp.connect(shaper);
  shaper.connect(g);
  g.connect(ac.destination);
  return { input: hp, gain: g };
}

function attach(src: AudioNode, ac: AudioContext, gain: number) {
  const bus = houseBus(ac, gain);
  src.connect(bus.input);
  return bus;
}

function noiseBuffer(ac: AudioContext, seconds: number, color: "white" | "brown" | "pink") {
  const n = ac.createBuffer(1, Math.max(1, Math.floor(ac.sampleRate * seconds)), ac.sampleRate);
  const data = n.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i += 1) {
    const w = Math.random() * 2 - 1;
    if (color === "white") {
      data[i] = w;
    } else if (color === "brown") {
      last = last * 0.975 + w * 0.025;
      data[i] = last * 3.4;
    } else {
      last = last * 0.86 + w * 0.14;
      data[i] = last * 1.55;
    }
  }
  return n;
}

function playBuffer(ac: AudioContext, buffer: AudioBuffer, gain: number) {
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const bus = attach(src, ac, gain);
  src.onended = () => {
    try {
      bus.input.disconnect();
    } catch {
      /* already gone */
    }
  };
  src.start();
}

function playNoise(
  ac: AudioContext,
  color: "white" | "brown" | "pink",
  seconds: number,
  gain: number,
  filter?: { type: BiquadFilterType; start: number; end: number; time: number },
) {
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, seconds, color);
  const filt = ac.createBiquadFilter();
  filt.type = filter?.type ?? "lowpass";
  filt.frequency.value = filter?.start ?? 2400;
  const bus = attach(filt, ac, 1);
  const g = ac.createGain();
  g.gain.value = gain;
  src.connect(g);
  g.connect(filt);
  const t = ac.currentTime;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  if (filter) {
    filt.frequency.setValueAtTime(filter.start, t);
    filt.frequency.exponentialRampToValueAtTime(Math.max(80, filter.end), t + filter.time);
  }
  src.start();
  src.stop(t + seconds + 0.02);
  src.onended = () => {
    try {
      bus.input.disconnect();
    } catch {
      /* already gone */
    }
  };
}

function playProcedural(ac: AudioContext, voice: HouseVoice) {
  if (voice === "threshold") {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.value = 60;
    g.gain.value = 0.012;
    const bus = attach(g, ac, 0.7);
    o.connect(g);
    const t = ac.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.014, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);
    o.start(t);
    o.stop(t + 0.64);
    playNoise(ac, "brown", 0.62, 0.016, { type: "lowpass", start: 900, end: 700, time: 0.5 });
    o.onended = () => {
      try {
        bus.input.disconnect();
      } catch {
        /* already gone */
      }
    };
    return;
  }
  if (voice === "acquire") {
    playNoise(ac, "white", 0.14, 0.02, { type: "lowpass", start: 4200, end: 700, time: 0.09 });
    playNoise(ac, "white", 0.02, 0.03, { type: "lowpass", start: 1400, end: 400, time: 0.012 });
    return;
  }
  if (voice === "cut") {
    playNoise(ac, "white", 0.08, 0.018, { type: "lowpass", start: 900, end: 380, time: 0.05 });
    return;
  }
  playNoise(ac, "brown", 0.32, 0.02, { type: "lowpass", start: 380, end: 3200, time: 0.12 });
}

async function loadHouse(ac: AudioContext) {
  if (load) return load;
  load = Promise.all(
    (Object.keys(HOUSE_SRC) as HouseVoice[]).map(async (voice) => {
      const res = await fetch(HOUSE_SRC[voice]);
      if (!res.ok) return;
      const raw = await res.arrayBuffer();
      const buf = await ac.decodeAudioData(raw.slice(0));
      buffers.set(voice, buf);
    }),
  ).then(() => undefined);
  try {
    await load;
  } catch {
    load = null;
  }
}

const VOICE_GAIN: Record<HouseVoice, number> = {
  threshold: 0.48,
  acquire: 0.4,
  cut: 0.36,
  tape: 0.42,
};

function playVoice(voice: HouseVoice) {
  const ac = gate();
  if (!ac) return;
  const buf = buffers.get(voice);
  if (buf) {
    playBuffer(ac, buf, VOICE_GAIN[voice]);
    return;
  }
  playProcedural(ac, voice);
  void loadHouse(ac);
}

export function playThreshold() {
  playVoice("threshold");
}

export function playAcquire() {
  playVoice("acquire");
}

export function playCut() {
  playVoice("cut");
}

export function playTape() {
  playVoice("tape");
}

/** Channel acquire — existing `/tv` call site. */
export function playSwitch() {
  playAcquire();
}

/** Cassette open — existing `/tapes` call site. */
export function playEngage() {
  playTape();
}

/** Discover door — a cut, not static snow. */
export function playStatic() {
  playCut();
}

function startRoomTone() {
  const ac = gate();
  if (!ac || room) return;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, 2.4, "brown");
  src.loop = true;
  const hum = ac.createOscillator();
  hum.type = "sine";
  hum.frequency.value = 60;
  const humG = ac.createGain();
  humG.gain.value = 0.004;
  const g = ac.createGain();
  g.gain.value = 0;
  const bus = attach(g, ac, 1);
  src.connect(g);
  hum.connect(humG);
  humG.connect(g);
  const t = ac.currentTime;
  g.gain.linearRampToValueAtTime(0.008, t + 0.85);
  src.start();
  hum.start();
  room = {
    stop() {
      try {
        src.stop();
        hum.stop();
      } catch {
        /* already stopped */
      }
      try {
        bus.input.disconnect();
        g.disconnect();
      } catch {
        /* already gone */
      }
      room = null;
    },
  };
}

export function stopRoomTone() {
  room?.stop();
  room = null;
}

export async function unlockSound() {
  const ac = context();
  if (ac) await ac.resume();
}

export async function setSoundEnabled(on: boolean, opts?: { reduced?: boolean }) {
  enabled = on;
  if (on) {
    await unlockSound();
    const ac = context();
    if (ac) await loadHouse(ac);
    if (!opts?.reduced) startRoomTone();
  } else {
    stopRoomTone();
    if (ctx && ctx.state !== "closed") await ctx.suspend();
  }
  emit();
}

export function useSound() {
  const reduced = usePrefersReducedMotion();
  const on = useSyncExternalStore(subscribeSound, isSoundEnabled, () => false);

  const toggle = useCallback(async () => {
    await setSoundEnabled(!isSoundEnabled(), { reduced });
  }, [reduced]);

  return { on, toggle, reduced };
}
