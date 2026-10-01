import earth from "@/data/earth.json";

/** Public-domain Natural Earth 1:50m physical vectors. Styling is ours; geography is not invented. */
export type LonLat = [lon: number, lat: number];
export const CONTINENTS = earth.land as LonLat[][];
export const CUTS = earth.water as LonLat[][];
export const RIVERS = earth.rivers as LonLat[][];

export function lonLatToXY(lon: number, lat: number, w: number, h: number): LonLat {
  return [((lon + 180) / 360) * w, ((90 - lat) / 180) * h];
}

/** Preserve source lake edges and coastlines rather than rounding them off. */
export function pathD(ring: LonLat[], w: number, h: number) {
  return ring.map(([lon, lat], i) => {
    const [x, y] = lonLatToXY(lon, lat, w, h);
    return `${i ? "L" : "M"}${x.toFixed(3)} ${y.toFixed(3)}`;
  }).join(" ") + " Z";
}

function trace(g: CanvasRenderingContext2D, ring: LonLat[], w: number, h: number, close = true) {
  ring.forEach(([lon, lat], i) => {
    const [x, y] = lonLatToXY(lon, lat, w, h);
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  });
  if (close) g.closePath();
}

function clipLand(g: CanvasRenderingContext2D, w: number, h: number) {
  g.beginPath();
  for (const ring of CONTINENTS) trace(g, ring, w, h);
  for (const ring of CUTS) trace(g, ring, w, h);
  g.clip("evenodd");
}

export function paintLand(g: CanvasRenderingContext2D, w: number, h: number) {
  const ocean = g.createLinearGradient(0, 0, 0, h);
  ocean.addColorStop(0, "#101519");
  ocean.addColorStop(0.5, "#0b1013");
  ocean.addColorStop(1, "#080d10");
  g.fillStyle = ocean;
  g.fillRect(0, 0, w, h);
  g.save();
  clipLand(g, w, h);
  const land = g.createLinearGradient(0, 0, 0, h);
  land.addColorStop(0, "#938572");
  land.addColorStop(0.25, "#796750");
  land.addColorStop(0.55, "#5e5342");
  land.addColorStop(1, "#8c8070");
  g.fillStyle = land;
  g.fillRect(0, 0, w, h);
  g.strokeStyle = "rgba(20,29,31,0.42)";
  g.lineWidth = 0.8;
  g.beginPath();
  for (const river of RIVERS) trace(g, river, w, h, false);
  g.stroke();
  g.restore();
  g.strokeStyle = "rgba(206,190,148,0.38)";
  g.lineWidth = 0.8;
  g.beginPath();
  for (const ring of CONTINENTS) trace(g, ring, w, h);
  for (const ring of CUTS) trace(g, ring, w, h);
  g.stroke();
  // A quiet geographic grid makes rotation legible without more controls.
  g.strokeStyle = "rgba(204,185,146,0.075)";
  g.lineWidth = 0.65;
  g.beginPath();
  for (let lat = -75; lat <= 75; lat += 15) {
    const [, y] = lonLatToXY(0, lat, w, h);
    g.moveTo(0, y); g.lineTo(w, y);
  }
  for (let lon = -180; lon <= 180; lon += 15) {
    const [x] = lonLatToXY(lon, 0, w, h);
    g.moveTo(x, 0); g.lineTo(x, h);
  }
  g.stroke();
}

export type NightMark = { lon: number; lat: number; glow: number; chicago?: boolean };

/** Catalog location lights, not a population or satellite night-light layer. */
export function paintNight(g: CanvasRenderingContext2D, w: number, h: number, marks: NightMark[]) {
  g.fillStyle = "#000000";
  g.fillRect(0, 0, w, h);
  g.save();
  clipLand(g, w, h);
  for (const mark of marks) {
    const [x, y] = lonLatToXY(mark.lon, mark.lat, w, h);
    const radius = w * (mark.chicago ? 0.016 : 0.007 + mark.glow * 0.006);
    const light = g.createRadialGradient(x, y, 0, x, y, radius);
    light.addColorStop(0, "rgba(235,210,150,0.66)");
    light.addColorStop(0.15, "rgba(201,156,80,0.24)");
    light.addColorStop(1, "rgba(201,156,80,0)");
    g.fillStyle = light;
    g.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  g.restore();
}
