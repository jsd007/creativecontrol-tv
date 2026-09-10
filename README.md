# CreativeControl.tv

Proof-of-concept cultural archive and media platform. Not a portfolio.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To show Coodie the archive as if each lens were the product: [https://creativecontrol-tv.vercel.app/?present=1](https://creativecontrol-tv.vercel.app/?present=1) (or local [http://localhost:3000/?present=1](http://localhost:3000/?present=1)). Keys and what not to claim: [`docs/PRESENTATION.md`](docs/PRESENTATION.md).

## Lenses

| Route | Lens |
| --- | --- |
| `/` | Threshold |
| `/archive` | The Index |
| `/world` | The World |
| `/tv` | Creative Control Television |
| `/tapes` | The Tapes |
| `/timeline` | The Timeline |
| `/clip/[slug]` | Canonical clip |

Development openings on `/` can be switched with the discreet **OPENING** control, or `?opening=archive|history|document|span`.

## Docs

Persistent project memory lives in `/docs`. Read those before major decisions.

Prototype media is generated. Public CC Television uploads play as official YouTube embeds when a clip has a `youtubeId`. The local reel is research only and is not shipped.
