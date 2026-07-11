# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Commands

```bash
npm start          # python3 -m http.server 8080 → http://localhost:8080
npx serve .        # alternative → http://localhost:3000
```

No build step. Edit `index.html` or `words/*.json` and refresh the browser.

Kill a stuck server: `lsof -ti:8080 | xargs kill -9`

## Architecture

**Single-file app**: all HTML + CSS + JS lives in `index.html` (~3500 lines). Word data lives in `words/a1.json`, `words/a2.json`, `words/b1.json`, `words/b2.json` — one file per CEFR level. No framework, no bundler, no dependencies.

### Game Modes (`gameMode` global)

| Mode | Value | Description |
|------|-------|-------------|
| 1P Crossword | `'1P'` | Solo crossword puzzle, 11×11 grid, 6 words |
| Satz-Modus | `'SATZ'` | Sentence exercises: fill-in-blank + word-order chips, 10 rounds |
| Artikel-Sprint | `'ARTIKEL'` | der/die/das drill, 10 nouns, keyboard keys 1/2/3 |
| 2P Local | `'2P'` + `onlineMode=false` | Wordle-Tac-Toe on one device, first to 3 points |
| 2P Online | `'2P'` + `onlineMode=true` | Firebase Realtime DB multiplayer via 6-char room code |

`setMode(mode)` is the single entry point for 1P/2P switching — it shows/hides all panels and kicks off the appropriate game start. SATZ and ARTIKEL are entered via the mode-switcher tabs (`startSatzMode()` / `startArtikelMode()`), which hide the crossword UI themselves and return through `setMode('1P')`.

### Spaced Repetition (Leitner)

`wortle-review` in localStorage holds one card per word: `{box 0–4, due, seen, correct, level, type, lastSeen}`. Intervals `[0,1,2,4,7]` days by box. **Every mode grades into the deck** via `gradeReview(word, correct)`: crossword rounds auto-add all 6 words at end (`buildReviewPanel`), Satz-Modus grades its fill-in results at summary time, Artikel-Sprint grades each answer. Normal crossword generation weaves up to 3 due words into the pool (`generateCrossword(pool, prioritySet)`); the ★ tab builds puzzles from due words only (needs ≥5). The 📚 pill in the streak bar opens the Wortschatz dashboard (box counts + mastery bars).

### Crossword Generation

Constants at top of `<script>`: `CW_GRID=11`, `CW_MIN=3`, `CW_MAX=7`, `CW_COUNT=6`. `generateCrossword(pool)` tries 3 random shuffle attempts, places words perpendicular with exact letter intersections, requires ≥4 words placed or retries. Returns `null` on total failure.

### words.json Schema

```json
{
  "A1": [{ "w": "HAUS", "en": "house", "ar": "بيت", "hint": "Man wohnt darin.", "sentence": "Wir haben ein großes ___.", "type": "noun", "article": "das" }],
  "A2": [...],
  "B1": [...],
  "B2": [...]
}
```

- `w`: uppercase, no article; verbs in infinitive; adjectives in base form
- `type`: exactly `"noun"` | `"verb"` | `"adjective"`
- `article`: `"der"` | `"die"` | `"das"` | `"die/pl"` — present only on nouns
- `sentence`: optional — a short German example sentence with `___` replacing the word; shown in the clue bar and revealed (word highlighted) after solving
- `hint`: short German description or clue (shown if `sentence` is absent)
- `packs`: optional array of theme-pack tags (e.g. `["FAMILY"]`) — cuts across CEFR levels; see Themed Packs below
- A dedup check runs on every page load and logs to console

### Themed Packs

Curriculum packs (`FAMILY`, `RESTAURANT`, `TRAVEL`, `NUMBERS`, `FIRST100`) are **not** separate files — they're a `packs` tag on existing A1/A2/B1 word entries, synthesized client-side. `THEME_PACKS` (a `Set` of these tag names) is checked inside `loadLevel()`: instead of fetching a file, it ensures A1/A2/B1 are loaded, then builds `words[TAG] = [...A1,...A2,...B1].filter(e => e.packs?.includes(TAG))`. This deliberately skips updating `wordLevelIndex`/`wordEntryIndex` — those entries are the same object references as their CEFR-file counterparts, so mastery/review tracking (keyed by word string) isn't affected by which pack pulled a word in. Selectable from the home screen's Lernpfad row (`PATHS` array) exactly like a CEFR level or professional domain pack.

This is distinct from the 5 professional domain packs (Wirtschaft/Medizin/IT/Technik/Recht), which *are* separate files (`words/business.json` etc., see `PACK_LEVELS`) since that vocabulary doesn't overlap with the CEFR level content.

### localStorage Keys

| Key | Shape | Purpose |
|-----|-------|---------|
| `wortle-streak` | `{current, best}` | Daily streak counter |
| `wortle-diamonds` | `{total, log[], milestones[]}` | Diamond currency; log capped at 100 entries; milestones prevent double-awarding |
| `wortle-review` | `{version, cards{WORD: {box, due, ...}}}` | Leitner spaced-repetition deck (see above) |
| `wortle-onboarded` | `'1'` | First-run "how to play" overlay shown once |
| `wortle-packs-done` | `[packId, ...]` | Theme packs already celebrated (100% mastered), prevents re-firing the completion overlay |

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

Edit the appropriate `words/<level>.json` file (e.g. `words/a1.json`). Words must be uppercase, deduplicated across all levels, and include `en`, `ar`, `hint`, `sentence`, `type`. For nouns add `article`. Reload to see the dedup check in console.

### Word file loading

`init()` fetches `words/a1.json` eagerly (default level), then loads A2/B1/B2 in parallel in the background. Level files are cached in the `words` object; `loadedLevels` Set tracks what's ready. `ensureLevels(set)` awaits any missing levels before `startCrossword()` runs — safe to call multiple times.

## Deployment

Push to `main` → GitHub Pages auto-deploys to `https://ahmedsliman.github.io/wordle-de`.
