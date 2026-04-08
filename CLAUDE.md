# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Commands

```bash
npm start          # python3 -m http.server 8080 → http://localhost:8080
npx serve .        # alternative → http://localhost:3000
```

No build step. Edit `index.html` or `words.json` and refresh the browser.

Kill a stuck server: `lsof -ti:8080 | xargs kill -9`

## Architecture

**Single-file app**: all HTML + CSS + JS lives in `index.html` (~3300 lines). `words.json` is the only external data file. No framework, no bundler, no dependencies.

### Game Modes (`gameMode` global)

| Mode | Value | Description |
|------|-------|-------------|
| 1P Crossword | `'1P'` | Solo crossword puzzle, 11×11 grid, 6 words |
| 2P Local | `'2P'` + `onlineMode=false` | Wordle-Tac-Toe on one device, first to 3 points |
| 2P Online | `'2P'` + `onlineMode=true` | Firebase Realtime DB multiplayer via 6-char room code |

`setMode(mode)` is the single entry point for switching modes — it shows/hides all panels and kicks off the appropriate game start.

### Crossword Generation

Constants at top of `<script>`: `CW_GRID=11`, `CW_MIN=3`, `CW_MAX=7`, `CW_COUNT=6`. `generateCrossword(pool)` tries 3 random shuffle attempts, places words perpendicular with exact letter intersections, requires ≥4 words placed or retries. Returns `null` on total failure.

### words.json Schema

```json
{
  "A1": [{ "w": "HAUS", "en": "house", "ar": "بيت", "hint": "...", "type": "noun", "article": "das" }],
  "A2": [...],
  "B1": [...]
}
```

- `w`: uppercase, no article; verbs in infinitive; adjectives in base form
- `type`: exactly `"noun"` | `"verb"` | `"adjective"`
- `article`: `"der"` | `"die"` | `"das"` | `"die/pl"` — present only on nouns
- A dedup check runs on every page load and logs to console

### localStorage Keys

| Key | Shape | Purpose |
|-----|-------|---------|
| `wortle-streak` | `{current, best}` | Daily streak counter |
| `wortle-diamonds` | `{total, log[], milestones[]}` | Diamond currency; log capped at 100 entries; milestones prevent double-awarding |

### Firebase (Online Mode)

Loaded from CDN (`gstatic.com/firebasejs/12.11.0`) as an ES module. Exposed globally as `window._fb`. If init fails, the Online button is disabled — degradation is graceful. All listeners stored in `fbListeners[]` and unsubscribed via `cleanupOnline()` on game end.

Database path: `/rooms/{6-char-code}/` — holds `status`, `level`, `players/0`, `players/1`, `round`, `winner`.

### Tile & Cell Sizing

Tile size is computed dynamically in JS (`computeTileSize(wordLen)`) from viewport width — never hardcode `--tile-size` in CSS. Crossword cell size uses `computeCwCellSize(cols)` similarly.

### Key Functions to Know

- `startCrossword()` — generates and renders a new 1P puzzle
- `endCrossword(won)` — handles win/loss, streak, diamond bonuses
- `checkWordComplete()` — called after every letter fill; auto-solves correct words
- `setMode(mode)` — switches between 1P and 2P, shows/hides all relevant DOM
- `earnDiamonds(amount, reason, anchorEl)` — awards diamonds, updates display, shows float toast
- `speakWord(word)` — Web Speech API TTS in `de-DE` at 0.85× rate
- `norm(ch)` — maps lowercase umlauts to uppercase German equivalents

### CSS Design Tokens

Primary accent: `--color-correct: #1D9E75` (teal). Secondary: `--color-present: #EF9F27` (amber). Players: `--color-p1: #3b82f6` (blue), `--color-p2: #ef4444` (red). Fonts: `'Inter'` for UI, `'DM Mono'` for tiles/keys/codes, `'Fraunces'` for logo only.

Dark mode via `@media (prefers-color-scheme: dark)` — all colors go through CSS variables, so both modes are always supported.

## Adding Words

Edit `words.json`. Words must be uppercase, deduplicated across all levels, and include `en`, `ar`, `hint`, `type`. For nouns add `article`. Reload to see the dedup check in console.

## Deployment

Push to `main` → GitHub Pages auto-deploys to `https://ahmedsliman.github.io/wordle-de`.
