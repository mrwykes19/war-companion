# Warhammer Companion v1.1

A mobile-first, offline-capable Warhammer 40,000 gameplay companion. It tracks your battle rounds, turns, phases, Victory Points, Command Points, objective control, custom reminders, scoring history and concise Core Rules references.

## v1.1 changes

- Converted the battle tracker to a single-player companion: only your VP and CP are tracked.
- The turn tracker still switches between Your Turn and Opponent Turn for phase progression and reminders.
- Added dismissible reminder pop-ups at the start of each battle round.
- Added a persistent current-round reminder checklist on the Battle tab.
- Moved the wound-roll calculator and dice roller to the Battle tab.
- Kept the Rules tab limited to searchable rules and reference content.
- Removed the +5 quick-scoring button.
- Changed the installed app name and iPhone Home Screen title to **Warhammer Companion**.
- Added migration for locally saved v1.0 games and backups.

## Scope

Warhammer Companion intentionally does **not** include army building, datasheets, unit cards or weapon profiles. Use the official Warhammer app or printed materials for army-specific data.

The built-in reference library is a concise play aid based on the user-provided **Warhammer 40,000 Core Rules 24.09**. Later official commentary, mission packs, codex rules and balance updates may supersede these summaries.

## Cloudflare Workers Git deployment

Upload the contents of this folder to the GitHub repository root so `index.html` and `wrangler.jsonc` are visible on the repository's main page.

Use:

- Build command: `echo "Static site ready"`
- Deploy command: `npx wrangler deploy`
- Non-production branch deploy command: `npx wrangler versions upload`
- Path: leave blank when the files are at the repository root

The `name` in `wrangler.jsonc` must exactly match the Worker project name in Cloudflare. It is currently `war-companion`.

The package intentionally does not contain an `_redirects` file because the app uses a single root page and the earlier catch-all redirect caused a Cloudflare static-assets deployment loop.

## iPhone installation

After deploying v1.1, remove the old Home Screen bookmark and add the site again through Safari's **Share → Add to Home Screen** flow so iOS refreshes the title to **Warhammer Companion**.

## Disclaimer

Warhammer Companion is an unofficial fan-made gameplay aid. It is not affiliated with or endorsed by Games Workshop.
