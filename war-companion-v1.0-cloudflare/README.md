# WAR Companion v1.0

A mobile-first, offline-capable tabletop gameplay companion. It tracks battle rounds, turns, phases, Victory Points, Command Points, objective control, custom reminders, scoring history and concise Core Rules references.

## Scope

WAR Companion intentionally does **not** include army building, datasheets, unit cards or weapon profiles. Use the official Warhammer app or printed materials for army-specific data.

The built-in reference library is a concise play aid based on the user-provided **Warhammer 40,000 Core Rules 24.09**. Later official commentary, mission packs, codex rules and balance updates may supersede these summaries.

## Features

- Two-player VP and CP tracking
- Automatic +1 CP to both players at each Command phase, with an optional setting to disable it
- Five-phase turn progression and automatic round/player transitions
- Phase-specific checklists
- Objective-control tracker
- Round-by-round scoring entries and history
- Searchable rules summaries, weapon abilities, Core Stratagems, terrain, reserves, transports, aircraft and missions
- Wound-roll calculator and quick dice roller
- Reusable phase/round reminders
- Game timer, undo, JSON backup/import and completed-game summaries
- Local autosave and offline Progressive Web App support


## Cloudflare Workers Git deployment

This package includes `wrangler.jsonc` for an assets-only Worker. In Cloudflare Builds use:

- Build command: leave blank
- Deploy command: `npx wrangler deploy`
- Non-production branch deploy command: `npx wrangler versions upload`
- Path: leave blank

The `name` in `wrangler.jsonc` must exactly match the Worker project name in the Cloudflare dashboard. It is currently set to `war-companion`.

## Deploy to Cloudflare Pages

### GitHub-connected deployment

1. Upload this entire folder to the root of a GitHub repository.
2. Create a Cloudflare Pages project connected to that repository.
3. Use no framework and no build command.
4. Set the build output directory to the repository root (`.`).
5. Deploy.

### Direct upload

Upload the contents of this folder so that `index.html` is at the deployment root.

## Local testing

Run a local static server from this directory, for example:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## iPhone installation

Open the deployed site in Safari, use **Share**, select **Add to Home Screen**, and launch it from the new icon. Open the app online once so its assets can be cached for offline use.

## File structure

- `index.html` — app entry point
- `css/styles.css` — responsive interface styles
- `js/app.js` — game state and interface logic
- `js/rules.js` — concise rules-reference data
- `manifest.webmanifest` and `sw.js` — PWA/offline support
- `assets/` — supplied artwork optimized for the app

## Disclaimer

WAR Companion is an unofficial fan-made gameplay aid. It is not affiliated with or endorsed by Games Workshop.
