# Spotify Premium Card

A premium Spotify-inspired media player card for Home Assistant with dynamic artwork, blur effects, smooth animations, adaptive themes and full HACS support.

Created and maintained by [Barny_II](https://github.com/barnynv).

## Status

Early development version. The first goal is to provide a solid HACS-compatible base with a polished media player layout.

## Features

- Spotify-inspired layout
- Artwork-first design
- Progress bar and media metadata
- Always-visible playback controls
- Central circular play/pause button
- HACS-compatible distribution
- TypeScript + Lit + Vite stack

## Installation

### HACS

1. Open HACS.
2. Go to the three-dot menu and choose **Custom repositories**.
3. Add `https://github.com/barnynv/spotify-premium-card` as type **Dashboard**.
4. Install the card.
5. Add the generated resource if Home Assistant does not do it automatically.

### Manual

1. Download `spotify-premium-card.js` from the latest release.
2. Copy it to your `www` folder.
3. Add this resource:

```yaml
url: /local/spotify-premium-card.js
type: module
```

## Basic usage

```yaml
type: custom:spotify-premium-card
entity: media_player.spotify
name: Spotify
```

## Development

```bash
npm install
npm run build
```

## Roadmap

- V0.1 Base card and HACS setup

## Support the project

If this card is useful to you and you would like to support its development:

[Support the project on Revolut](https://revolut.me/ricardspw1)

## License

MIT
Test workflow trigger
