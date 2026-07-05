#!/usr/bin/env node
// One-off Phase-1 seed: add plural / principal_parts / example to a representative
// subset of common A1 words so the review UI is visibly working. Idempotent, and only
// touches words that already exist. The full dataset is generated later (Phase 3 tooling).
// Usage: node tools/seed-words.mjs   (rewrites words.json in place, preserving order)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'words.json');
const data = JSON.parse(readFileSync(path, 'utf8'));

// word -> patch. Applied only when the word exists.
const PLURALS = {
  HAUS: 'die Häuser', HUND: 'die Hunde', KATZE: 'die Katzen', BUCH: 'die Bücher',
  AUTO: 'die Autos', KIND: 'die Kinder', MANN: 'die Männer', FRAU: 'die Frauen',
  TISCH: 'die Tische', STUHL: 'die Stühle', BETT: 'die Betten', BROT: 'die Brote',
  APFEL: 'die Äpfel', HAND: 'die Hände', KOPF: 'die Köpfe', AUGE: 'die Augen',
  TAG: 'die Tage', JAHR: 'die Jahre', STADT: 'die Städte', BAUM: 'die Bäume',
  BLUME: 'die Blumen', STRASSE: 'die Straßen', SCHULE: 'die Schulen', TÜR: 'die Türen',
  FENSTER: 'die Fenster', LAMPE: 'die Lampen', UHR: 'die Uhren', WORT: 'die Wörter',
};
const PARTS = {
  SEIN: 'sein, war, ist gewesen', HABEN: 'haben, hatte, hat gehabt',
  GEHEN: 'gehen, ging, ist gegangen', KOMMEN: 'kommen, kam, ist gekommen',
  MACHEN: 'machen, machte, hat gemacht', ESSEN: 'essen, aß, hat gegessen',
  TRINKEN: 'trinken, trank, hat getrunken', LESEN: 'lesen, las, hat gelesen',
  FAHREN: 'fahren, fuhr, ist gefahren', SEHEN: 'sehen, sah, hat gesehen',
  SPRECHEN: 'sprechen, sprach, hat gesprochen', SCHLAFEN: 'schlafen, schlief, hat geschlafen',
  SCHREIBEN: 'schreiben, schrieb, hat geschrieben', LAUFEN: 'laufen, lief, ist gelaufen',
  NEHMEN: 'nehmen, nahm, hat genommen', GEBEN: 'geben, gab, hat gegeben',
  FINDEN: 'finden, fand, hat gefunden', BLEIBEN: 'bleiben, blieb, ist geblieben',
};
const EXAMPLES = {
  HAUS:   { de: 'Das Haus ist sehr alt.',        en: 'The house is very old.',   ar: 'المنزل قديم جدًا.' },
  HUND:   { de: 'Der Hund schläft im Garten.',   en: 'The dog sleeps in the garden.', ar: 'الكلب ينام في الحديقة.' },
  KATZE:  { de: 'Die Katze trinkt Milch.',       en: 'The cat drinks milk.',     ar: 'القطة تشرب الحليب.' },
  ESSEN:  { de: 'Ich esse einen Apfel.',         en: 'I am eating an apple.',    ar: 'أنا آكل تفاحة.' },
  GEHEN:  { de: 'Wir gehen nach Hause.',         en: 'We are going home.',       ar: 'نحن ذاهبون إلى المنزل.' },
  BUCH:   { de: 'Das Buch ist interessant.',     en: 'The book is interesting.', ar: 'الكتاب مثير للاهتمام.' },
  KIND:   { de: 'Das Kind spielt draußen.',      en: 'The child plays outside.', ar: 'الطفل يلعب في الخارج.' },
  TRINKEN:{ de: 'Sie trinkt gern Kaffee.',       en: 'She likes to drink coffee.', ar: 'هي تحب شرب القهوة.' },
};

let n = 0;
for (const level of Object.keys(data)) {
  for (const e of data[level]) {
    if (e.type === 'noun' && PLURALS[e.w] && e.plural !== PLURALS[e.w]) { e.plural = PLURALS[e.w]; n++; }
    if (e.type === 'verb' && PARTS[e.w]   && e.principal_parts !== PARTS[e.w]) { e.principal_parts = PARTS[e.w]; n++; }
    if (EXAMPLES[e.w] && !e.example) { e.example = EXAMPLES[e.w]; n++; }
  }
}

writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log(`seeded ${n} field(s); wrote ${path}`);
