# Prompt for Claude Code — Enrich Wörtle vocab with Nicos Weg data

I have a new vocabulary source file: `nicos_weg_vocab.json` (179 words extracted
from the "Nicos Weg" A1/A2/B1 German course transcript). Each entry looks like:

```json
{
  "word": "Tasche",
  "type": "noun",
  "article": "die",
  "meaning_ar": "حقيبة",
  "sentence": "Die Tasche ist schön!",
  "level": "A1",
  "source": "Nicos Weg (transcript)"
}
```

Notes on the raw fields:
- `type` is one of: noun, verb, adjective, adverb, preposition, interjection.
- `article` is null for non-nouns and for plural-only nouns (those have
  `"die (Pl.)"` as the article string instead of a plain der/die/das — treat
  that as plural, no singular article).
- `sentence` is a real line pulled from the show's transcript, not invented.
- Some `word` entries are reflexive/compound forms like "sich kümmern",
  "sich bewerben", "sich vorbereiten" — keep the "sich" as part of the
  displayed infinitive, don't strip it.

## Task

1. Find where the app currently stores its word list (look for the existing
   data file/module that backs the A1/A2/A3/B1/B2 tabs — check `src/data`,
   `src/words`, or similar; grep for an existing word object to find the
   exact shape the app expects, e.g. whatever fields populate "Buchst.",
   "VERB" badge, the Arabic translation, and the example sentence with the
   blank).

2. Map each field in `nicos_weg_vocab.json` onto the app's existing word
   schema. In particular:
   - Confirm how the app derives letter count / blanks — it should already
     compute this from the word string itself; don't hardcode a length field
     unless the schema requires it.
   - Confirm how existing entries mark word type (e.g. is it an enum "VERB"/
     "NOUN"/"ADJ", and how is that value cased/abbreviated?) and normalize
     `type` to match.
   - Confirm how the article is stored (e.g. is it merged into the noun form
     as "die Tasche", or a separate `artikel` field?) and map accordingly.
   - Confirm the field name used for the example sentence with a blank (the
     screenshot shows sentences like "Kannst du Wasser ___?" — check whether
     existing entries store the blank placeholder inline, or whether the app
     auto-generates the blank by removing the target word from the sentence
     string). Since these transcript sentences don't already have a blank,
     you likely need to programmatically replace the target word/its
     inflected form inside `sentence` with the app's blank marker — check
     existing data for the exact marker syntax (e.g. `___`, `{blank}`, `_`).
   - Map `meaning_ar` directly to whatever field stores the Arabic
     translation.

3. Deduplicate against existing entries (case-insensitive on the base word)
   before inserting, so we don't create doubles if a word already exists in
   the current word bank.

4. Insert the new entries into the correct level bucket (A1 → A1, A2 → A2,
   B1 → B1), preserving the existing sort/order convention in the data file.

5. After merging, run whatever build/lint/typecheck step the project uses to
   confirm the new entries don't break schema validation (if there's a
   TypeScript type or JSON schema for word entries, validate against it).

6. Show me a diff/summary of how many words were added per level and flag
   any entries that failed to map cleanly (e.g. because the target word
   didn't literally appear in its own example sentence in an easily
   replaceable form — some like "sich kümmern" or "weggehen" appear in
   conjugated/separated forms in the sentence, e.g. "Du bist... weggegangen",
   so the blank-generation logic needs to handle that gracefully, or those
   should be flagged for manual review rather than silently skipped).

Don't touch unrelated app logic (keyboard, layout, etc.) — this is purely a
data-enrichment task.
