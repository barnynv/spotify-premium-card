Spotify Premium Card
A premium Spotify-inspired media player card for Home Assistant with dynamic artwork, blur effects, smooth animations, adaptive themes and full HACS support.

Status
Early development version. The first goal is to provide a solid HACS-compatible base with a polished media player layout.

Features
Spotify-inspired layout

Artwork-first design

Progress bar and media metadata

Always-visible playback controls

Central circular play/pause button

HACS-compatible distribution

TypeScript + Lit + Vite stack

Installation
HACS
Open HACS.

Go to the three-dot menu and choose Custom repositories.

Add https://github.com/barnynv/spotify-premium-card as type Dashboard.

Install the card.

Add the generated resource if Home Assistant does not do it automatically.

Manual
Download spotify-premium-card.js from the latest release.

Copy it to your www folder.

Add this resource:

text
url: /local/spotify-premium-card.js
type: module
Basic usage
text
type: custom:spotify-premium-card
entity: media_player.spotify
name: Spotify
Development
bash
npm install
npm run build
Roadmap
V0.1 Base card and HACS setup

V0.2 Improved controls layout

V0.3 Dynamic artwork colors

V0.4 Popup and extra actions

V0.5 Adaptive themes by player type

License
MIT
