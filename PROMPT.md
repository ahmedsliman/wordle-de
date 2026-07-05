# Wörtle — Claude Code Build Prompt

Build a German Wordle game called **Wörtle** for a German language learner (Arabic native, English C1).

---

## Core requirements

- Pure HTML/CSS/JS — single `index.html` file, zero dependencies, no build step
- Hostable on GitHub Pages or any static host
- Word bank loaded from `words.json` via `fetch('./words.json')` on startup
- 3 difficulty levels: **A1 / A2 / B1** — selectable via tabs
- 3 word type filters: **All / Nouns / Verbs / Adjectives** — second tab row below levels
- 6 attempts per word, standard Wordle color logic (green / yellow / gray)
- Streak counter (current streak + best streak) persisted in `localStorage`

---

## File structure to generate

```
wortle/
├── index.html       # full game — UI + JS logic
├── words.json       # word bank (already provided, do not regenerate)
└── README.md        # setup + deployment instructions
```

---

## words.json format (file already exists — load it as-is)

```json
{
  "A1": [
    {
      "w": "HAUS",
      "en": "house (das)",
      "ar": "بيت",
      "hint": "Where you live",
      "type": "noun"
    }
  ],
  "A2": [...],
  "B1": [...]
}
```

Field rules:
- `w` — uppercase, no article, verbs as infinitive, adjectives in base form
- `en` — English meaning; nouns include article in parentheses e.g. `house (das)`
- `ar` — Arabic translation, will be rendered RTL
- `hint` — one short English sentence clue
- `type` — exactly one of: `"noun"` | `"verb"` | `"adjective"`

---

## UI requirements

### Layout
- Header: logo "Wörtle." on left, level tabs (A1 / A2 / B1) on right
- Below header: word-type filter tabs (All / Nouns / Verbs / Adjectives)
- Hint bar: shows EN meaning, AR translation (RTL), hint sentence, and a colored type badge
  - Noun → blue pill
  - Verb → green pill
  - Adjective → amber pill
- Word grid: centered, 6 rows × N columns where N = length of current word
- Message area: win/lose feedback, correct word revealed on loss
- On-screen German keyboard: includes Ä Ö Ü, ENTER and ⌫ keys
- Streak bar: current streak + best streak, bottom of screen

### Keyboard
- Rows: `Q W E R T Z U I O P Ü` / `A S D F G H J K L Ö Ä` / `ENTER Y X C V B N M ⌫`
- Physical keyboard input works including umlaut keys (ä ö ü → normalize to Ä Ö Ü)
- Key colors update after each guess: green > yellow > gray priority (never downgrade a key)

### Tile animation
- Active row tiles pulse on letter entry
- Tiles flip/color with a staggered 80ms delay per tile on submit
- Wrong-length submit: shake the row

### Game flow
1. On load: fetch `words.json`, pick random word matching current level + type filter
2. Player guesses; standard Wordle evaluation
3. Win: show "Sehr gut! 🎉" in green
4. Loss: show "The word was: XXXX" in red, reveal the word
5. "New Word ↺" button appears after game ends
6. Streak increments on win, resets to 0 on loss

### Responsive
- Works on mobile (min 320px width)
- On-screen keyboard scales to fit narrow screens

---

## Wordle evaluation logic

Standard algorithm:
1. First pass: mark exact matches as `correct` (green)
2. Second pass: mark letters present but wrong position as `present` (yellow), consuming unmatched letters only once
3. Remaining: `absent` (gray)

---

## On load: dedup check

```js
// After fetching words.json, run this check:
const allWords = [...data.A1, ...data.A2, ...data.B1].map(e => e.w);
const dupes = allWords.filter((w, i) => allWords.indexOf(w) !== i);
if (dupes.length) console.warn('Duplicate words found:', dupes);
```

---

## README.md content to generate

Include:
- Project description (1 paragraph)
- How to run locally: `npx serve .` then open `http://localhost:3000`
- How to deploy to GitHub Pages:
  - Option A: push to `main`, enable Pages from repo Settings → Pages → source: root
  - Option B: use GitHub Actions with `actions/upload-pages-artifact`
- How to add new words: edit `words.json`, follow the schema above
- Word count table: counts per level and type (calculate from the provided words.json)

---

## Design direction

- Font: monospace for tiles and keyboard (DM Mono or similar from Google Fonts)
- Serif accent font for the logo (Fraunces or similar)
- Color palette:
  - Correct: `#1D9E75` (teal green)
  - Present: `#EF9F27` (amber)
  - Absent: muted gray using CSS variables
  - Noun badge: blue
  - Verb badge: green
  - Adjective badge: amber
- Dark mode compatible — use CSS variables throughout, never hardcode colors
- No external CSS frameworks, no icon libraries

---

## After generating all files

- Confirm `fetch('./words.json')` is used (not inline hardcoded data)
- Confirm level + type filters correctly narrow the word pool before random pick
- Confirm keyboard umlaut normalization works
- Confirm streak persists across page refresh via localStorage
- Run the dedup check and report result in console on load
