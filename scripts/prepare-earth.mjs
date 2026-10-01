// Mechanical preparation of public-domain Natural Earth data, not authored geography.
// Run with: node scripts/prepare-earth.mjs
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const upstream = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/';
const sources = ['ne_50m_land', 'ne_50m_lakes', 'ne_50m_rivers_lake_centerlines'];
const inputs = await Promise.all(sources.map(async (name) => {
  const response = await fetch(`${upstream}${name}.geojson`);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const raw = await response.text();
  return { name, sha256: createHash('sha256').update(raw).digest('hex'), data: JSON.parse(raw) };
}));

function segmentDistance(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = dx || dy ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))) : 0;
  return (p[0] - a[0] - t * dx) ** 2 + (p[1] - a[1] - t * dy) ** 2;
}

function simplify(points, closed = true) {
  const keep = new Set([0, points.length - 1]);
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [start, end] = stack.pop();
    let distance = 0.035 ** 2, index = -1;
    for (let i = start + 1; i < end; i++) {
      const d = segmentDistance(points[i], points[start], points[end]);
      if (d > distance) { distance = d; index = i; }
    }
    if (index !== -1) { keep.add(index); stack.push([start, index], [index, end]); }
  }
  const selected = points.filter((_, i) => keep.has(i));
  const result = (closed && selected.length < 4 ? points : selected).map(([x, y]) => [Number(x.toFixed(3)), Number(y.toFixed(3))]);
  return result;
}

function polygons(input) {
  return input.features.flatMap(({ geometry }) => geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates]);
}
const landPolygons = polygons(inputs[0].data);
const lakes = polygons(inputs[1].data);
const rivers = inputs[2].data.features.flatMap(({ geometry }) => geometry.type === 'MultiLineString' ? geometry.coordinates : [geometry.coordinates]);
const output = {
  source: 'Natural Earth 1:50m physical vectors; public domain',
  toleranceDegrees: 0.035,
  inputs: inputs.map(({ name, sha256 }) => ({ name, url: `${upstream}${name}.geojson`, sha256 })),
  land: landPolygons.map((p) => simplify(p[0])),
  water: [...landPolygons.flatMap((p) => p.slice(1)), ...lakes.map((p) => p[0])].map((p) => simplify(p)),
  rivers: rivers.map((p) => simplify(p, false)),
};
await writeFile(new URL('../src/data/earth.json', import.meta.url), JSON.stringify(output) + '\n');
console.log(`Prepared ${output.land.length} land rings, ${output.water.length} water rings, ${output.rivers.length} rivers; ${JSON.stringify(output).length} bytes.`);
