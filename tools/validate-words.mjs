#!/usr/bin/env node
// Validate words.json: dedupe + schema sanity for existing and new (Phase-1) fields.
// Usage: node tools/validate-words.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'words.json'), 'utf8'));

const LEVELS   = ['A1', 'A2', 'B1'];
const TYPES    = ['noun', 'verb', 'adjective'];
const ARTICLES = ['der', 'die', 'das', 'die/pl', 'die/der'];

const errors = [];
const warnings = [];
const seen = new Map(); // word -> level

for (const level of Object.keys(data)) {
  if (!LEVELS.includes(level)) warnings.push(`Unknown level key: ${level}`);
  for (const e of data[level]) {
    const at = `${level}/${e.w}`;
    if (!e.w || e.w !== e.w.toUpperCase()) errors.push(`${at}: 'w' missing or not uppercase`);
    if (seen.has(e.w)) errors.push(`Duplicate word ${e.w} in ${seen.get(e.w)} and ${level}`);
    else seen.set(e.w, level);
    for (const f of ['en', 'ar', 'hint']) if (!e[f]) errors.push(`${at}: missing '${f}'`);
    if (!TYPES.includes(e.type)) errors.push(`${at}: bad type '${e.type}'`);
    if (e.type === 'noun'  && !ARTICLES.includes(e.article)) errors.push(`${at}: bad/absent article '${e.article}'`);
    if (e.type !== 'noun'  && e.article) warnings.push(`${at}: non-noun has an article`);

    // ── Phase-1 optional fields (only validated when present) ──
    if ('plural' in e) {
      if (e.type !== 'noun') errors.push(`${at}: 'plural' only valid on nouns`);
      if (typeof e.plural !== 'string' || !e.plural) errors.push(`${at}: 'plural' must be a non-empty string`);
    }
    if ('principal_parts' in e) {
      if (e.type !== 'verb') errors.push(`${at}: 'principal_parts' only valid on verbs`);
      if (typeof e.principal_parts !== 'string' || e.principal_parts.split(',').length < 2)
        errors.push(`${at}: 'principal_parts' should be a comma-separated string (e.g. "reisen, reiste, ist gereist")`);
    }
    if ('example' in e) {
      const ex = e.example;
      if (typeof ex !== 'object' || !ex || !ex.de) errors.push(`${at}: 'example' must be an object with at least 'de'`);
    }
  }
}

const counts = Object.fromEntries(LEVELS.map(l => [l, (data[l] || []).length]));
let seededPlural = 0, seededParts = 0, seededExample = 0;
for (const level of LEVELS) for (const e of (data[level] || [])) {
  if (e.plural) seededPlural++;
  if (e.principal_parts) seededParts++;
  if (e.example) seededExample++;
}

console.log('words.json validation');
console.log('  counts:', counts, 'total', seen.size);
console.log(`  seeded: plural=${seededPlural} principal_parts=${seededParts} example=${seededExample}`);
if (warnings.length) { console.log('\nWarnings:'); warnings.forEach(w => console.log('  ⚠ ' + w)); }
if (errors.length)   { console.log('\nErrors:');   errors.forEach(e => console.log('  ✗ ' + e)); process.exit(1); }
console.log('\n✓ valid — no duplicates, schema OK');
