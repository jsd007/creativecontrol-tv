/**
 * Original house textures for Creative Control.
 * Analog / precise. No library SFX. No music. No voice.
 * Run: node scripts/synthesize-house-sound.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 48000;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sound");

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lowpass(cutoff, sr) {
  let y = 0;
  return (x) => {
    const a = Math.exp((-2 * Math.PI * cutoff) / sr);
    y = x * (1 - a) + y * a;
    return y;
  };
}

function highpass(cutoff, sr) {
  let x1 = 0;
  let y = 0;
  return (x) => {
    const a = Math.exp((-2 * Math.PI * cutoff) / sr);
    y = a * (y + x - x1);
    x1 = x;
    return y;
  };
}

function envelope(t, attack, hold, release, total) {
  if (t < 0) return 0;
  if (t < attack) {
    const x = t / Math.max(attack, 1e-6);
    return x * x * (3 - 2 * x);
  }
  if (t < attack + hold) return 1;
  const r = (t - attack - hold) / Math.max(release, 1e-6);
  if (r >= 1 || t >= total) return 0;
  const x = 1 - r;
  return x * x;
}

function chain(samples, peak) {
  const hp = highpass(68, SR);
  const lp = lowpass(7200, SR);
  const out = new Float64Array(samples.length);
  for (let i = 0; i < samples.length; i += 1) {
    out[i] = lp(Math.tanh(hp(samples[i]) * 1.12));
  }
  let max = 0;
  for (const v of out) max = Math.max(max, Math.abs(v));
  const g = max > 0 ? peak / max : 1;
  for (let i = 0; i < out.length; i += 1) out[i] *= g;
  return out;
}

function writeWav(samples, file) {
  const dataSize = samples.length * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i += 1) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff), 44 + i * 2);
  }
  writeFileSync(file, buf);
}

/** Room appearing — 60 Hz hum + brown air + a gate register. Not a chime. */
function threshold() {
  const dur = 0.68;
  const n = Math.floor(SR * dur);
  const rand = mulberry32(0xcc2017);
  const raw = new Float64Array(n);
  const air = lowpass(880, SR);
  let brown = 0;
  for (let i = 0; i < n; i += 1) {
    const t = i / SR;
    brown = brown * 0.985 + (rand() * 2 - 1) * 0.015;
    const hum =
      Math.sin(2 * Math.PI * 60 * t) * 0.055 * (1 + 0.06 * Math.sin(2 * Math.PI * 0.28 * t)) +
      Math.sin(2 * Math.PI * 120 * t) * 0.014;
    const room = air(brown * 3.4) * 0.2;
    let click = 0;
    if (t >= 0.086 && t < 0.14) {
      const ct = t - 0.086;
      click = (rand() * 2 - 1) * Math.exp(-ct / 0.009) * 0.22;
    }
    const env = envelope(t, 0.11, 0.26, 0.3, dur);
    raw[i] = (hum + room + click) * env;
  }
  return chain(raw, 0.36);
}

/** Tuner lock — snow collapses, a contact click. No pitched beep. */
function acquire() {
  const dur = 0.155;
  const n = Math.floor(SR * dur);
  const rand = mulberry32(0x7e07);
  const raw = new Float64Array(n);
  const snowHp = highpass(900, SR);
  let snowLp = lowpass(4200, SR);
  let lastCutoff = 4200;
  for (let i = 0; i < n; i += 1) {
    const t = i / SR;
    const cutoff = 4200 - 3400 * Math.min(1, t / 0.09);
    if (Math.abs(cutoff - lastCutoff) > 80) {
      snowLp = lowpass(cutoff, SR);
      lastCutoff = cutoff;
    }
    const snow = snowLp(snowHp(rand() * 2 - 1)) * Math.exp(-t / 0.038) * (1 - t / dur);
    const click = t < 0.012 ? (rand() * 2 - 1) * Math.exp(-t / 0.0028) * 0.55 : 0;
    raw[i] = snow * 0.55 + click;
  }
  return chain(raw, 0.3);
}

/** Film splice — muted pop + a breath of leader hiss. */
function cut() {
  const dur = 0.092;
  const n = Math.floor(SR * dur);
  const rand = mulberry32(0x51ce);
  const raw = new Float64Array(n);
  const popLp = lowpass(480, SR);
  const hissLp = lowpass(5200, SR);
  for (let i = 0; i < n; i += 1) {
    const t = i / SR;
    const pop = popLp(t < 0.004 ? (rand() * 2 - 1) * (1 - t / 0.004) : 0);
    const hiss = hissLp(rand() * 2 - 1) * Math.exp(-t / 0.028) * 0.22;
    raw[i] = pop * 0.7 + hiss;
  }
  return chain(raw, 0.28);
}

/** MiniDV engage — motor, head kiss, dying hiss. One texture, not a bed. */
function tape() {
  const dur = 0.36;
  const n = Math.floor(SR * dur);
  const rand = mulberry32(0x0217);
  const raw = new Float64Array(n);
  const motorHp = highpass(180, SR);
  let motorLp = lowpass(380, SR);
  let lastCut = 380;
  const hissLp = lowpass(3600, SR);
  let brown = 0;
  for (let i = 0; i < n; i += 1) {
    const t = i / SR;
    const open = 380 + 3100 * Math.min(1, t / 0.12);
    if (Math.abs(open - lastCut) > 70) {
      motorLp = lowpass(open, SR);
      lastCut = open;
    }
    brown = brown * 0.96 + (rand() * 2 - 1) * 0.04;
    const motorEnv = envelope(t, 0.04, 0.07, 0.2, 0.32);
    const motor = motorLp(motorHp(brown * 2.6)) * motorEnv * 0.55;
    const head = t >= 0.082 && t < 0.12 ? (rand() * 2 - 1) * Math.exp(-(t - 0.082) / 0.007) * 0.28 : 0;
    const wow = 1 + 0.035 * Math.sin(2 * Math.PI * 1.65 * t);
    const hiss = hissLp(rand() * 2 - 1) * Math.exp(-Math.max(0, t - 0.08) / 0.11) * 0.16;
    raw[i] = (motor + head + hiss) * wow;
  }
  return chain(raw, 0.32);
}

mkdirSync(ROOT, { recursive: true });
const voices = [
  ["threshold", threshold()],
  ["acquire", acquire()],
  ["cut", cut()],
  ["tape", tape()],
];
for (const [name, samples] of voices) {
  const file = join(ROOT, `${name}.wav`);
  writeWav(samples, file);
  console.log(`wrote ${file} (${samples.length} samples)`);
}
