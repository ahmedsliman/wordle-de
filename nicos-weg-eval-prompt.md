# Prompt: Evaluate Wörtle against Nicos Weg (A1/A2/B1) — grammar calibration + vocab coverage

Paste this whole file as instructions to an agent (Claude Code session, or any LLM
with file access — no web access needed) to audit `words/a1.json`, `words/a2.json`,
`words/b1.json` against the actual Nicos Weg source material.

---

## Context

Wörtle assigns every word a level (`A1`/`A2`/`B1`) and each entry carries a cloze
`sentence` field (e.g. `"Wir wohnen in einem kleinen ___."`), shown to learners as
the primary context clue. Two separate questions matter here:

1. **Grammar calibration** — does a `sentence`'s grammar match its stated level,
   or does it leak in constructs (Perfekt, Konjunktiv II, Passiv, genitive,
   subordinate clauses) from a level above?
2. **Vocabulary coverage** — of the words that actually appear in Nicos Weg's
   A1/A2/B1 episodes, how many did we incorporate into the app at all?

**Ground truth**: `nicos-weg.txt` in this repo — a full dialogue transcript of the
Nicos Weg course, section-delimited by bare `A1` / `A2` / `B1` lines (find them
with `grep -n "^A1$\|^A2$\|^B1$"`). This is the actual course content, not a
paraphrase — prefer it over general knowledge or web search about what Nicos Weg
"typically" covers.

## Task 1 — grammar calibration

1. Read `words/a1.json`, `words/a2.json`, `words/b1.json` in full (256 / 279 / 275
   entries). For each entry, look at the `sentence` field (and `example.de` where
   present, A1 only).
2. Classify the grammar structures each sentence actually uses (tense, case,
   clause type, mood). Flag it if those structures belong to a *later* CEFR level
   than the file it's in:
   - **A1 file** should not contain: Perfekt (haben/sein + ge-participle), Passiv
     (werden + ge-participle), Konjunktiv II (würde/wäre/hätte/könnte...), genitive
     (des/wegen/trotz), subordinate clauses (weil/dass/obwohl...), comparative/
     superlative. Dative prepositional phrases (mit dem/nach dem/bei der) are
     borderline — Nicos Weg formalizes dative case at A2, but some fixed phrases
     appear as A1 chunks; call it case by case.
   - **A2 file** should not contain: Konjunktiv II, Passiv, genitive, relative
     clauses. Perfekt, weil/dass, comparative, and dative are fine at A2.
   - **B1 file**: no upper bound in scope, but flag sentences that are
     grammatically flat (simple present, no clause complexity at all) as
     lower-priority "missed opportunity" notes — B1 is where Nicos Weg
     concentrates Konjunktiv II, Passiv, and relative clauses, so a B1 word bank
     that's 100% simple-present sentences isn't using its own level.
3. For every flag, name the specific construct and quote the sentence. Don't
   hand-wave.
4. When a construct's level is genuinely ambiguous, grep `nicos-weg.txt` for a
   natural-usage example (e.g. `grep -n "wäre\|hätte" nicos-weg.txt` within the
   A1 line range) — if Nicos Weg itself uses it at that level, that overrides the
   general rule of thumb above.

### Output format (Task 1)

```
## words/a1.json — N flagged / 256
| word (w) | sentence | issue | suggested fix |
|---|---|---|---|

## words/a2.json — N flagged / 279
...
## words/b1.json — N flagged / 275 (missed-opportunity notes only)
...
```

Only include entries you're confident are miscalibrated — false positives cost
real editing time. Borderline calls go in a separate short list, not the main
table.

## Task 2 — vocabulary coverage

1. For each level section of `nicos-weg.txt` (A1: lines 1–3258, A2: 3259–6693,
   B1: 6694–end — re-verify line numbers with grep since the file may have
   changed), extract the dialogue text only. Skip:
   - Section headers (`===...===`, `A1-NN-Title` lines)
   - Speaker-label lines (short all-caps lines like `NICO:`, `KURSTEILNEHMERIN:`)
   - Character/place proper nouns (Nico, Lisa, Emma, Yara, Max, Tarek, Nawin,
     Selma, Inge, Jürgen, Sebastian, Nina, Marvin, Wolfgang, Ulla, Yanis, and any
     other recurring character or city name you notice)
2. Lemmatize/normalize loosely (conjugated verbs → infinitive stem, inflected
   nouns/adjectives → base form) and count unique content words per level.
3. For each unique content word, check whether it (or a clearly related inflected
   form) appears anywhere in the app's combined word bank (`words/a1.json` +
   `words/a2.json` + `words/b1.json` — Nicos Weg dialogue naturally reuses earlier
   vocabulary, so check the combined pool, not just the matching level file).
4. Report:
   - `% of A1/A2/B1 transcript vocabulary present in the app` (three numbers)
   - The ~20 highest-frequency transcript words per level that are **not** in the
     app at all — these are the best candidates to add, since high-frequency
     usage in real course dialogue is a stronger signal than an arbitrary word
     list.
   - Explicitly separate true content-word gaps (nouns/verbs/adjectives worth
     adding as flashcards) from discourse markers/adverbs (okay, vielleicht,
     wirklich, natürlich, immer) that show up frequently but aren't the kind of
     word this app drills — don't recommend adding those.

### Output format (Task 2)

```
## Vocabulary coverage
- A1: X% of transcript vocabulary present in the app
- A2: X%
- B1: X%

## Top missed words (candidates to add)
### A1
| word | frequency in transcript | suggested type/level |
...
### A2
...
### B1
...
```

Note the methodology is a heuristic (stem/prefix matching, not a real German
lemmatizer) — state the coverage numbers as approximate, and don't over-claim
precision past the nearest 5%.
