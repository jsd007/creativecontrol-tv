# Globe geography

The World lens uses Natural Earth's public-domain **1:50m physical vectors**, not approximate hand-drawn continents. Coastlines, inland lakes (including the Great Lakes), and river centerlines share the same coordinates in the globe and WebGL fallback.

- [Natural Earth physical vectors](https://www.naturalearthdata.com/downloads/50m-physical-vectors/)
- [Terms of use: public domain](https://www.naturalearthdata.com/about/terms-of-use/)
- [Upstream land](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_land.geojson)
- [Upstream lakes](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_lakes.geojson)
- [Upstream rivers](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_rivers_lake_centerlines.geojson)

`node scripts/prepare-earth.mjs` prepares `src/data/earth.json`. It simplifies segments to 0.035 degrees and rounds to three decimal places. Source SHA-256 digests are recorded in the generated file. No source footage or satellite imagery is downloaded.

Warm paper tones, illumination, star drift and pin pulses are presentation effects. Catalog lights identify records, not population density. Ambient animation can be paused and respects reduced-motion preferences.
