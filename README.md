# Wörtle

A German Wordle game for language learners — guess German vocabulary words at A1, A2, or B1 (CEFR) difficulty. Hints are shown in English and Arabic. Includes a 2-player competitive mode.

**Live demo:** [ahmedsliman.github.io/wordle-de](https://ahmedsliman.github.io/wordle-de)

---

## Features

### 1-Player
- 6 attempts to guess the hidden German word
- Three difficulty levels: A1 / A2 / B1 (CEFR)
- Filter by word type: All / Noun / Verb / Adjective
- Hints: English meaning · Arabic translation · part of speech · example sentence
- Streak tracking (saved in browser)
- German QWERTZ keyboard with Umlauts (Ä Ö Ü)
- Dark mode

### 2-Player (Wordle-Tac-Toe)
- Both players share **one Wordle board** — rows alternate between players
- First to score **3 points** wins
- **Skip Turn** button to pass your row
- Row ownership shown with a coloured border (blue / red)
- Each round a new word is picked; the loser starts the next round

---

## Word bank

| Level | Nouns | Verbs | Adjectives | Total |
|-------|------:|------:|-----------:|------:|
| A1    |   108 |    43 |         40 |   191 |
| A2    |   106 |    45 |         50 |   201 |
| B1    |    93 |    48 |         56 |   197 |
| **Total** | **307** | **136** | **146** | **589** |

---

## Run locally

```bash
npx serve .
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to GitHub Pages

### Option A — Branch deploy (simplest)

1. Push this repo to GitHub as **`wordle-de`**.
2. Go to **Settings → Pages**.
3. Set **Source** → `Deploy from a branch`, branch `main`, folder `/` (root).
4. Save. Your site will be live at `https://<your-username>.github.io/wordle-de/`.

### Option B — GitHub Actions (auto-deploy on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## Add words

Edit `words.json`. Each entry:

```json
{
  "w":    "REISEN",
  "en":   "to travel",
  "ar":   "يسافر",
  "hint": "What you do when you go abroad",
  "type": "verb"
}
```

| Field  | Rules |
|--------|-------|
| `w`    | Uppercase, no article. Nouns → base form. Verbs → infinitive. Adjectives → base form. |
| `en`   | English meaning. Nouns include article: e.g. `house (das)`. |
| `ar`   | Arabic translation (rendered RTL automatically). |
| `hint` | One short English clue sentence. |
| `type` | Exactly one of: `noun`, `verb`, `adjective`. |

Add the entry to the correct level array (`A1`, `A2`, or `B1`) in `words.json`.
