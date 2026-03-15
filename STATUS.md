# Wörtle — Project Status

**Date:** 2026-03-15

---

## What It Is

A German vocabulary Wordle game called **Wörtle**, built as a single HTML file with no build step. Players guess a hidden German word; tiles flip green/yellow/grey as in standard Wordle. Words are sourced from a CEFR-levelled word bank (`words.json`).

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Complete game — HTML + CSS + JS (~1650 lines, no dependencies) |
| `words.json` | Word bank — 589 words across A1/A2/B1 levels |
| `README.md` | Setup and deployment notes |

---

## Word Bank (`words.json`)

| Level | Total | Noun | Verb | Adjective |
|-------|-------|------|------|-----------|
| A1 | 191 | 108 | 43 | 40 |
| A2 | 201 | 106 | 45 | 50 |
| B1 | 197 | 93 | 48 | 56 |
| **Total** | **589** | **307** | **136** | **146** |

- Word lengths: 2–16 characters
- No duplicates (verified on load, logged to console)
- Each entry has: German word, English translation, Arabic translation, part of speech, example sentence

---

## Features

### 1-Player Mode
- Standard Wordle gameplay: 6 attempts to guess the hidden word
- Level selector: A1 / A2 / B1 tabs
- Type filter: All / Noun / Verb / Adjective
- Hint bar: English meaning · Arabic meaning · POS badge · example sentence
- Tile size computed dynamically based on word length (max 62px)
- Streak tracking persisted in `localStorage` (`wortle-streak`)
- Dark mode via `prefers-color-scheme`
- German QWERTZ keyboard layout with Umlauts (Ü, Ö, Ä)
- "New Word" button after game ends

### 2-Player Mode (Wordle-Tac-Toe)
- **Tic-Tac-Toe mechanic on a 3×3 grid** — 9 word cells, players alternate turns
- Each turn: active player picks any unclaimed cell, a Wordle panel slides in, they attempt to solve it
- Claiming a cell = solving its Wordle; failure marks the cell as failed (greyed out)
- **Win condition:** first player to claim 3 cells in a row (row / column / diagonal) wins
- Winning 3-in-a-row cells glow with the winner's colour
- Draw if all 9 cells resolve with no 3-in-a-row
- **Close-button behaviour:**
  - 0 guesses submitted → abandon (cell stays playable, turn switches)
  - 1+ guesses submitted → forfeit (cell marked failed, turn switches)
  - After game over → just closes panel
- Setup overlay: customisable player names
- Results overlay: winner announcement + per-player cells claimed + avg attempts

---

## Design Decisions

| Concern | Choice |
|---------|--------|
| Fonts | DM Mono (tiles/keyboard), Fraunces (logo) via Google Fonts |
| Colours | Correct `#1D9E75`, Present `#EF9F27`, Absent muted gray |
| P1 colour | `#3b82f6` (blue) |
| P2 colour | `#ef4444` (red) |
| Tile sizing | Dynamic JS — scales to viewport width and word length |
| Dark mode | CSS `prefers-color-scheme` + CSS variables throughout |
| Persistence | `localStorage` for streak only; no backend |

---

## Known Limitations / Potential Next Steps

- No mobile soft-keyboard suppression (physical + on-screen keyboard can conflict)
- Word bank stops at B1; no B2/C1 content yet
- No animation on the 2P board cell claiming (just colour change)
- 2P is pass-and-play only (same device); no network multiplayer
- No share/clipboard result export (1P mode)
- Words with length > 8 excluded from 2P board cells (filter `3–8 letters`)
