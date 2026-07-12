# Nicos Weg grammar calibration audit (Task 1 only)

**Status: all fixes applied 2026-07-12.** The 4 hard misses (WOLLEN, KÜCHE, FABRIK,
MONATLICH) and all 37 B1 flat-sentence entries below were rewritten directly in
`words/*.json`. Note the applied B1 rewrites are original cloze sentences built
around the suggested constructs (Konjunktiv II via `würde`, relative clauses, etc.)
rather than the literal "suggested fix" text below, since those were free-form
examples without the required `___` blank — kept here for the grammatical reasoning,
not as exact final text.

Audit date: 2026-07-12
Scope: `words/a1.json` (287 entries), `words/a2.json` (285 entries), `words/b1.json` (275 entries) —
grammar calibration of the `sentence` field against each file's stated CEFR level, per
`nicos-weg-eval-prompt.md` Task 1. Task 2 (vocabulary coverage) was already run separately;
not repeated here.

Ground truth: `nicos-weg.md`, section boundaries confirmed via
`grep -n "^A1$\|^A2$\|^B1$"` → A1 = lines 1–3258, A2 = lines 3259–6693, B1 = lines 6694–end
(matches the prompt's stated ranges; no correction needed there).

Methodology: every entry in each file was read and classified for tense/case/clause
type/mood against the prompt's construct lists. Ambiguous calls were checked against
`nicos-weg.md` within the matching section range — if Nicos Weg itself uses a construct
at that level, it was not flagged (or flagged only as borderline). Only high-confidence
miscalibrations are in the main tables; everything else is in the borderline lists.

---

## words/a1.json — 1 flagged / 287

| word (w) | sentence | issue | suggested fix |
|---|---|---|---|
| WOLLEN | Ich weiß nicht, was er wirklich ___ soll. | Embedded indirect question with verb-final subordinate clause ("was er wirklich wollen soll") plus stacked modal (wollen + soll) — above A1 syntax, unlike the simple dass-clauses that do appear in the A1 transcript | Simplify to a direct main-clause present-tense sentence, e.g. "Was ___ du heute Nachmittag?" or "Ich ___ ein neues Fahrrad." |

### Borderline calls (a1.json)

- **FROH** — "Ich bin sehr ___, dass du heute hier bist." — dass-clause with verb-final order. A structurally identical pattern ("Schön, dass ihr da seid!") appears in the A1 transcript section, so likely fine — flagged only because dass-clauses are formally introduced slightly later in most A1 curricula.
- **BRUDER** — "Mein ___ ist zwei Jahre jünger als ich." — comparative with "als". Comparatives ("mehr als", "schöner als") are attested in the A1 transcript section, so likely fine, not a confident issue.
- **ELTERN** — "Meine ___ sagen, Ingenieur ist gut." — juxtaposed clause without a subordinating conjunction. This is a verbatim match to a line in the A1 transcript section, so confirmed authentic A1-level content — not flagged.
- **Dative prepositional phrases** (23 entries: BLUME, BANK, GELD, AUGE, FUSS, BEIN, MOND, NACHT, MAUS, APOTHEKE, FAHRRAD, ARBEITEN, HELFEN, WARM, HUNGRIG, LAUT, SAUBER, SCHMUTZIG, DUNKEL, FERTIG, RÜCKEN, LÖWE, RUFEN, ZWANZIG — phrases like "in der Vase", "nach dem Sturz", "mit dem ___", "bei der Hausaufgabe") — dative case is formally taught at A2 per Nicos Weg, but fixed dative chunks ("in der Tasche", "nach dem Mittagessen", "von der Party") recur repeatedly within the A1 transcript section itself, so these are treated as acceptable A1 fixed-phrase chunks per rule 4, not flagged.

**Assessment**: a1.json is well-calibrated. Only one entry (WOLLEN) has a genuinely above-level construct; the file's frequent dative phrases are directly supported by transcript usage at A1.

---

## words/a2.json — 3 flagged / 285

| word (w) | sentence | issue | suggested fix |
|---|---|---|---|
| KÜCHE | Das Essen wird in der ___ zubereitet. | Passiv (werden + Partizip II: "wird ... zubereitet") — above A2 | Rephrase active: "Ich bereite das Essen in der ___ zu." or "Wir kochen in der ___." |
| FABRIK | In der ___ werden Autos hergestellt. | Passiv (werden + Partizip II: "werden ... hergestellt") — above A2 | Rephrase active: "In der ___ stellt man Autos her." or "Die ___ produziert Autos." |
| MONATLICH | Die Miete wird ___ bezahlt. | Passiv (werden + Partizip II: "wird ... bezahlt") — above A2 | Rephrase active: "Ich bezahle die Miete ___." or "Wir zahlen die Miete jeden Monat." |

### Borderline calls (a2.json)

- **FAMILIE / VERLASSEN** — "Ich würde meine Familie nie verlassen." — würde + Infinitiv (Konjunktiv II) nominally above A2, but this is a verbatim quote from the A2 section of the Nicos Weg transcript, so directly attested as A2-appropriate. Not flagged.
- **ABFAHREN** — "Der Zug wird um neun Uhr ___." — werden + infinitive is Futur I, not Passiv; superficially resembles the Passiv pattern but is fine at A2.
- **ABHOLEN** — "Er wird mich am Bahnhof ___." — same as above, Futur I, fine.
- **BESSER** — "Es wird nicht ___, wenn du länger wartest." — werden used as a copula ("to become") + comparative adjective, not Passiv (no past participle). Also verbatim-attested in the A2 transcript section. Fine.

**Assessment**: a2.json has exactly 3 genuine Passiv leaks, all following the same `wird/werden ... [ge-participle]` pattern and all easily fixed by rephrasing active. No genitive or relative-clause constructs were found anywhere in the file. Several sentences that superficially look like Passiv (Futur I, copula-werden) were correctly ruled out on close reading.

---

## words/b1.json — 42 flagged / 275 (missed-opportunity notes only, not hard errors)

B1 has no upper grammar bound in scope. These are lower-priority notes: sentences that are
grammatically flat (simple present, no subordination, no Konjunktiv II/Passiv/relative clause)
for words that would pedagogically benefit from showcasing a richer B1-level construction.

| word (w) | sentence | issue | suggested fix |
|---|---|---|---|
| GESELLSCHAFT | In einer freien ___ gelten bestimmte Regeln. | flat present; pairs naturally with a relative clause | "Eine Gesellschaft, die tolerant ist, respektiert Minderheiten." |
| DEMOKRATIE | In einer ___ haben alle Bürger das Recht zu wählen. | flat present; abstract concept ripe for Konjunktiv II | "Ohne Demokratie wären freie Wahlen nicht möglich." |
| FREIHEIT | Die ___ der Meinungsäußerung ist ein Grundrecht. | flat present, could showcase Konjunktiv II | "Ohne Freiheit könnte niemand seine Meinung offen äußern." |
| LÖSUNG | Wir suchen gemeinsam nach einer guten ___. | flat present | "Wenn wir zusammenarbeiten würden, fänden wir schneller eine Lösung." |
| ENTWICKELN | Das Unternehmen will neue Produkte ___. | flat modal+infinitive; verb well-suited to Passiv | "Neue Produkte werden von dem Unternehmen entwickelt." |
| VERBESSERN | Wir müssen die Situation für alle ___. | flat modal+infinitive | "Die Situation wurde durch neue Maßnahmen verbessert." |
| VERÄNDERN | Technologie kann die Gesellschaft grundlegend ___. | flat modal+infinitive | "Die Gesellschaft wird durch neue Technologien verändert." |
| ERREICHEN | Mit harter Arbeit kann man seine Ziele ___. | flat modal+infinitive | "Ohne harte Arbeit hätte er sein Ziel nie erreicht." |
| VERHINDERN | Wie können wir den Klimawandel noch ___? | flat modal question; good Konjunktiv II candidate | "Wenn wir früher gehandelt hätten, hätten wir den Klimawandel verhindern können." |
| BEWEISEN | Er muss seine Theorie noch wissenschaftlich ___. | flat modal+infinitive, natural Passiv verb | "Die Theorie wurde wissenschaftlich bewiesen." |
| GARANTIEREN | Niemand kann den Erfolg ___. | flat, but transcript uses this verb in a dass-clause | "Niemand kann garantieren, dass das Projekt gelingt." |
| GELINGEN | Das Projekt muss auf jeden Fall ___. | flat modal+infinitive; strong Konjunktiv II candidate | "Wenn alle mitarbeiten würden, würde das Projekt sicher gelingen." |
| SCHEITERN | Ohne Teamarbeit wird das Projekt ___. | flat future/present; already implies a hypothetical but lacks Konjunktiv II | "Ohne Teamarbeit wäre das Projekt gescheitert." |
| FINANZIEREN | Wer soll das neue Projekt ___? | flat modal question, natural Passiv candidate | "Das Projekt wird von der Stadt finanziert." |
| ÜBERZEUGEN | Er möchte alle von seiner Idee ___. | flat modal+infinitive | "Er hätte alle überzeugen können, wenn er besser vorbereitet gewesen wäre." |
| ERMÖGLICHEN | Technologie kann viele neue Dinge ___. | flat modal+infinitive, vague object | "Technologie ermöglicht Dinge, die früher unmöglich waren." |
| KOMPLEX | Das Problem ist sehr ___ und hat viele Ursachen. | flat present, adjective suited to comparative | "Dieses Problem ist komplexer, als es zunächst schien." |
| STAATLICH | Die Schule ist ___. | extremely minimal (3-word predicate), no context for the word | "Die Schule ist staatlich, weil sie vom Staat finanziert wird." |
| WAHRHEIT | Du wirst die ___ sagen. | flat future tense, stiff for a value-laden noun | "Du solltest die Wahrheit sagen, auch wenn es schwerfällt." |
| ENTSCHEIDUNG | Es war ganz sicher die richtige ___. | flat Präteritum statement, no elaboration | "Es war eine Entscheidung, die ich nie bereut habe." |
| SYSTEM | Ich kann das ___ nun mal nicht ändern. | flat present, modal but no subordination | "Wenn ich könnte, würde ich das System ändern." |
| GERECHTIGKEIT | Die ___ im Rechtssystem ist sehr wichtig. | flat present, suited to Konjunktiv II | "Ohne Gerechtigkeit hätte das Rechtssystem keine Legitimität." |
| VERTRAUEN | Ohne ___ kann keine Beziehung funktionieren. | flat modal present (already has an "ohne" construction — light note) | "Ohne Vertrauen wäre die Beziehung längst gescheitert." |
| KLIMAWANDEL | Der ___ bedroht die Lebensräume vieler Tierarten. | flat present, high-frequency B1 topic Nicos Weg treats with Konjunktiv II | "Wenn wir nichts täten, würde der Klimawandel noch mehr Schaden anrichten." |
| ARMUT | ___ ist eines der größten sozialen Probleme weltweit. | flat present, generic definitional sentence | "Armut ist ein Problem, das viele Länder betrifft." |
| ANALYSIEREN | Wir müssen die Situation genau ___. | flat modal+infinitive; first of a long run of near-identical "Wir müssen/wollen X ___" verb sentences | "Wir haben die Situation genau analysiert und neue Muster entdeckt." |
| VERGLEICHEN | Wir sollen die beiden Texte miteinander ___. | flat modal+infinitive | "Die Texte, die wir vergleichen sollen, stammen aus unterschiedlichen Epochen." |
| BEURTEILEN | Der Lehrer muss die Leistungen der Schüler ___. | flat modal+infinitive | "Die Leistungen werden vom Lehrer beurteilt." |
| ENTSCHEIDEN | Die Gruppe muss sich bald für eine Lösung ___. | flat modal+infinitive | "Wenn die Gruppe schneller entschieden hätte, wäre das Problem gelöst." |
| PLANEN | Wir müssen die nächsten Schritte sorgfältig ___. | flat modal+infinitive | "Die nächsten Schritte werden sorgfältig geplant." |
| UNTERSTÜTZEN | Wir wollen die Benachteiligten finanziell ___. | flat modal+infinitive | "Wir haben die Benachteiligten finanziell unterstützt." |
| FÖRDERN | Die Regierung will die Forschung stärker ___. | flat modal+infinitive | "Die Forschung wird von der Regierung stärker gefördert." |
| LÖSEN | Wir müssen dieses Problem gemeinsam ___. | flat modal+infinitive; near-duplicate pattern to LÖSUNG entry | "Wenn wir zusammenarbeiten würden, könnten wir dieses Problem lösen." |
| AKZEPTIEREN | Wir müssen die Entscheidung ___. | flat modal+infinitive, terse | "Auch wenn es schwerfällt, müssten wir die Entscheidung akzeptieren." |
| BEEINFLUSSEN | Medien können die öffentliche Meinung stark ___. | flat modal+infinitive | "Die öffentliche Meinung wird stark von den Medien beeinflusst." |
| ANPASSEN | Man muss sich an die neue Situation ___. | flat modal+reflexive | "Wenn sich niemand anpassen würde, gäbe es Chaos." |
| ÜBERNEHMEN | Sie möchte die Leitung der Abteilung ___. | flat modal+infinitive | "Sie hat die Leitung der Abteilung übernommen." |

Note: roughly 20 further entries in the same "Wir müssen/wollen/soll X ___" verb-cloze block
(e.g. BESCHREIBEN, KRITISIEREN, DISKUTIEREN, ARGUMENTIEREN, ORGANISIEREN, VORBEREITEN,
TEILNEHMEN, BEITRAGEN, RISKIEREN, SCHÜTZEN, AUSDRÜCKEN, VERBINDEN, EINREICHEN, BEACHTEN,
BEWÄLTIGEN, NACHWEISEN, ABSTIMMEN, AUFFORDERN, BERICHTEN, NACHFRAGEN, VORWERFEN) share the
identical flat pattern but were deliberately **not** listed individually — flagging all of
them would just be restating the same one-line critique ~20 more times without adding new
signal. The pattern itself (see summary below) is the finding.

### Borderline calls (b1.json)

- **VERTRAUEN** — "Ohne ___ kann keine Beziehung funktionieren." — already a negated-preposition construction, arguably richer than plain simple-present; kept in the main table only as a light note.
- **GERING** — "Das Risiko ist sehr ___, wenn man vorsichtig ist." — has a genuine subordinate clause (wenn); not flat, excluded.
- **IDEE** — "Ich weiß auch nicht, ob das 'ne gute ___ ist." — has an ob-clause; excluded.
- **ARBEITSLOSIGKEIT** — "Die ___ stieg während der Wirtschaftskrise stark an." — Präteritum shows tense variety even without subordination; excluded.
- **SCHEITERN** — "Ohne Teamarbeit wird das Projekt ___." — already has a conditional-ish "ohne" phrase, so genuinely borderline even though it's included above.
- The ~60 predicate-adjective entries (POLITISCH...UNTERSCHIEDLICH block) are almost uniformly flat "X ist ___" sentences. Only KOMPLEX and STAATLICH were flagged as the clearest cases; the rest were judged "flat but adequately illustrative" — isolated adjective + copula is a legitimate way to teach predicate adjectives, not a genuine miss.

**Assessment**: b1.json's core structural issue is a repetitive `Wir müssen/wollen/soll X ___`
modal-cloze pattern used across dozens of B1 verb entries. Individually each is fine (modals are
correct at every level), but collectively the file underuses B1's signature constructs —
Konjunktiv II, Passiv, and relative clauses appear only sporadically (e.g. VORSCHLAGEN's
"Was würdest du als nächsten Schritt ___?" is a good model to replicate more widely). This is a
missed-opportunity pattern, not a set of errors — no fixes are required, but reworking a subset
of the modal-cloze verbs into Passiv/Konjunktiv II sentences (as suggested above) would better
exercise the level.

---

## Overall summary

| File | Entries | Flagged | Notes |
|---|---|---|---|
| words/a1.json | 287 | 1 | Well-calibrated; 1 genuine above-level construct (embedded question + stacked modal) |
| words/a2.json | 285 | 3 | 3 genuine Passiv leaks, same pattern (`wird/werden ... [ge-participle]`), easy fixes |
| words/b1.json | 275 | 42 (soft) | Missed-opportunity notes only; core issue is a repetitive flat modal-cloze pattern across ~60 verb entries, of which 42 were judged the clearest candidates for a richer B1 rewrite |

Total hard misses (would actually mislead a learner about their level): **4** (1 in a1.json, 3
in a2.json) — both files are otherwise well-calibrated, and Nicos Weg transcript cross-checks
ruled out several plausible-looking false positives (dative phrases in A1, Futur I/copula-werden
in A2, transcript-attested dass-clauses and comparatives in A1).
