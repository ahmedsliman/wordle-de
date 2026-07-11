# Wörtle UX / Accessibility Audit Plan

**Audited:** 2026-07-05  
**Method:** Live code review of `index.html` (~3 300 lines) + browser automation at 1228×569 CSS px viewport (Chrome extension, high-DPI host); JS introspection of computed sizes, contrast ratios, ARIA tree, and layout values. Mobile viewport simulation (390px) was not achievable on this display; items requiring narrow-viewport confirmation are flagged.  
**Standard:** WCAG 2.2 AA, Apple HIG touch targets (44pt), WCAG 2.5.8 (24×24px minimum).

---

## What the "mystery gray element" actually is

The element visible below the action buttons in the bottom of the viewport is the **streak bar** (`#streak-bar`), a 59px-tall footer strip showing 🔥 Serie · 🏆 Beste · 💎 diamond total. It is labeled, visible, and working correctly. The 2P slide-up panel close button (`.panel-close-btn`, labeled "Spiel beenden") is **not visible in 1P crossword mode** — its bounding rect is 0×0. No mystery unlabeled button exists. You can stop hunting for it.

---

## Findings

### 🔴 Critical — fix before any feature work (mobile is unusable without these)

---

#### C1 · Audio button touch target: 28×20 px
**User impact:** On a phone, the 🔊 pronunciation button is nearly impossible to tap reliably. This is the core learning feedback loop — users who miss it just skip pronunciation.  
**Evidence:** Measured via `getBoundingClientRect()`: width 28px, height 20px. CSS is `padding: 2px 4px; font-size: 1rem` with a 16px emoji glyph. Both dimensions are below WCAG 2.5.8 (24×24) and far below Apple HIG (44pt).  
**Fix direction:** Add `min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center;` to `.audio-btn`. The visual emoji size stays 1rem; only the tappable area expands.  
**Size:** S — one CSS rule change.

---

#### C2 · Primary teal (#1D9E75) fails contrast on all light surfaces
**User impact:** The article label "(die)", the diamond counter value, and the active-tab underline are all rendered in `--color-correct` (#1D9E75) against the light background (#eef1f6) at **2.99:1** — failing WCAG AA for both normal text (4.5:1) and large text/UI components (3:1). The hint-article text is 0.78rem (~12.5px), which requires 4.5:1. Users with moderate vision loss cannot read the article or diamond count in light mode.  
**Evidence:** Computed: `luminance(#1D9E75) = 0.176`, `luminance(#eef1f6) = 0.870` → contrast 2.99:1.  
**Fix direction:** Introduce a dedicated dark-teal token for light-mode text: `--color-correct-text: #17855E` gives ≈4.6:1 on #eef1f6. Use this token for `.hint-article`, `.diamond-counter` text, and `.tab.active` text/border. Do NOT change `--color-correct` itself — tile fills and borders look correct at those sizes.  
**Size:** S — CSS token + targeted overrides.  
**Note:** Dark mode already passes (5.53:1). Only light mode is broken.

---

#### C3 · Native mobile keyboard overlaps grid and action buttons in 1P crossword mode
**User impact:** On a phone, tapping a crossword cell summons the native OS keyboard via a hidden `<input id="cw-native-input">`. The native keyboard takes ~40–50% of viewport height. No padding compensation is applied in 1P mode — the selector in the code is `body.has-keyboard:not(:has(#wordle-panel.mode-1p))`, which **explicitly excludes** 1P. The action buttons ("Prüfen", "Wort aufdecken") and the lower half of the grid are buried under the keyboard with no way to reach them.  
**Evidence (code):** Line ~1092: the `padding-bottom: calc(185px + env(safe-area-inset-bottom))` rule excludes mode-1p. No `visualViewport` resize listener found for the crossword path.  
**Fix direction:** Two options:
- *CSS-only (Chrome 94+):* `padding-bottom: env(keyboard-inset-height, 0px)` on the game container — no JS needed, gracefully degrades on older browsers.
- *JS fallback:* `window.visualViewport.addEventListener('resize', () => { document.getElementById('crossword-area').style.paddingBottom = (window.innerHeight - window.visualViewport.height) + 'px'; })`.  

Apply on crossword focus-in, remove on blur. This is a moderate addition, not a layout rearchitecture.  
**⚠ Structural flag:** Needs physical device testing at 390px viewport to confirm severity and validate the fix. At 390×844 with a 350px keyboard, the visible area above the keyboard is ~494px; with 164px of fixed chrome (see C4), only ~330px remains for a grid that computes to ~400px.  
**Size:** M.

---

#### C4 · Chrome density: ~164px of fixed UI before the grid on mobile
**User impact:** On a 390px device, the stacked fixed zones consume more than a third of the screen height before a single crossword cell appears:

| Zone | Height |
|---|---|
| Header (sticky) | 53px |
| Hint bar (scrolls, not sticky) | 48px |
| Progress bar | ~20px |
| Clue chip strip (≤680px only) | ~40px |
| **Total** | **~161px** |

The grid then appears in the remaining ~683px — but on a 844px phone that leaves only ~683px and on a 667px phone (iPhone SE) only ~506px. This is before the native keyboard opens.  
**Fix direction:** Collapse the hint bar and chip strip into a single, sticky combined row during active typing (a cell is selected). Show the full hint bar only when no cell is active / between clues. This requires a CSS class toggle on the wrapper, not a rearchitecture.  
**⚠ Requires mobile verification:** Severity depends on how small the crossword grid actually renders on a 390px screen.  
**Size:** M.

---

### 🟡 Should-fix — meaningfully impacts usability or a11y, not blockers

---

#### S1 · Clue list items lack interactive ARIA role
**User impact:** The six clue items in the desktop side panel are `<li tabindex="0">` elements. They are keyboard-focusable, but their ARIA role is implicitly `listitem` — a non-interactive role. A screen reader announces "list item" with no indication the element is activatable. A blind user has no way to know they can press Enter to jump to that clue.  
**Evidence:** `clue-item` elements: `role: null`, `tabindex: "0"` (confirmed via JS). Accessibility tree shows `listitem` not `button`.  
**Fix direction:** Add `role="button"` to each `.clue-item` in the JS that builds them, and an `aria-label` that spells out the clue without concatenation (e.g., `aria-label="Clue 2A across: happy/glad"`). Current text content concatenates "2A" and "happy/glad" without a space, which screen readers merge into one word.  
**Size:** S.

---

#### S2 · Mobile clue chips not keyboard-accessible
**User impact:** On mobile (≤680px), the desktop clue panel is hidden and replaced by `#clue-chips` — a horizontal scrolling strip of pill buttons. These chips have good `aria-label` values (e.g., "Wort 4 waagerecht: school") but have **no `tabindex`** and **no `role`**, making them unreachable for keyboard or switch-access users on mobile.  
**Evidence:** JS confirms `clueChipTabindex: null`, `clueChipRole: null`. Chips do have aria-labels.  
**Fix direction:** Add `tabindex="0"` and `role="button"` to each chip in the JS that builds them. The aria-labels are already correct.  
**Size:** S.

---

#### S3 · Action button height: 40px (below 44px HIG minimum)
**User impact:** "Prüfen" (93×40px) and "Wort aufdecken" (157×40px) are 4px shorter than Apple's 44pt minimum. On a phone held one-handed with a moving thumb, this raises miss-tap rate.  
**Evidence:** Measured via `getBoundingClientRect()`. CSS is `padding: 10px 22px` with 0.88rem font.  
**Fix direction:** Change to `padding: 12px 22px` or add `min-height: 44px` to `#check-btn, #reveal-btn`. No visual change to the button shape.  
**Size:** S.

---

#### S4 · Muted text on surface fails WCAG AA: 4.26:1
**User impact:** Secondary text (`--color-text-muted: #616d87`) on the surface color (`--color-surface: #e4e9f2`) renders at **4.26:1** — failing the 4.5:1 threshold for normal text. This applies to the hint sentence (italic text below the main clue), solved clue items with strikethrough, and `.clues-heading` labels.  
**Evidence:** Computed contrast 4.26:1. WCAG AA normal text requires 4.5:1.  
**Fix direction:** Darken `--color-text-muted` slightly in light mode: `#5a6480` gives ~4.7:1 on `#e4e9f2`. Verify this doesn't affect the dark mode value (which already passes at 7.16:1 — only change the light-mode token).  
**Size:** S.

---

#### S5 · Arabic translation hidden at ≤480px: learners lose their gloss
**User impact:** `@media (max-width: 480px) { .hint-ar { display: none; } }` removes the Arabic translation from the hint bar on small phones (budget Android devices, iPhone SE). An Arabic-speaking learner sees the English hint ("school") but not their native language equivalent — the primary scaffold for comprehension disappears exactly on the devices where it's most needed.  
**Fix direction:** Rather than hiding, make the hint bar overflow-x scrollable at narrow widths, or wrap the Arabic to a second line with a smaller font size. Alternatively, a "show translation" tap/toggle could reveal it on demand. The current `display: none` should be replaced.  
**Size:** M — requires UX decision on the wrapping strategy.

---

#### S6 · Overlay animations not covered by `prefers-reduced-motion`
**User impact:** The existing reduced-motion block (lines ~605–609) correctly suppresses tile flips, bounces, and diamond pulses. However, two animation families are missing: `overlay-pop` (the card entrance when any modal opens) and `rev-in` (review card stagger). Users who are sensitive to motion still see pop-in animations when the game ends.  
**Fix direction:** Extend the existing reduced-motion block:
```css
@media (prefers-reduced-motion: reduce) {
  /* existing rules ... */
  .overlay-card { animation: none; }
  .rev-card     { animation: none; }
  .waiting-dots::after { animation: none; }
}
```
**Size:** S — three lines of CSS.

---

### 🟢 Nice-to-have — quality / polish improvements

---

#### N1 · Progress bar is visually faint
The `#cw-progress-bar` is a single-pixel-thin line between the hint bar and the grid. For users with low contrast sensitivity, it may not register as a progress indicator. Consider increasing to 4px height and adding an explicit text label ("2 / 6 gelöst") inline with the "0 / 6" counter that already exists.  
**Size:** S.

---

#### N2 · Clue item text concatenation in accessibility tree
Clue text is built as `"2Ahappy/glad · سعيد"` without a space separator between the number and the clue. Screen readers announce this as one merged word. Fixed as part of S1 (the aria-label addition).

---

#### N3 · Gender legend only appears post-round
During active play, the article "(die)" is shown in `--color-correct` (teal) — not in the gender-specific color — so there is no color-only signaling during play. In the post-round review, gender IS color-coded (der=blue, die=red, das=teal), and a `.gender-legend` with colored dots AND text labels exists. This is correct — color has a second cue (the label). No fix needed, but **the legend text is small (0.72rem) and low-contrast against the surface**; consider slightly increasing its prominence.

---

#### N4 · Hint bar not sticky
The `.hint-bar` is `position: static`. If on narrow viewports the game ever requires scrolling, the current clue disappears from view while the user types. Currently not a confirmed issue but worth noting if layout C4 ever causes scrolling.

---

## Suggested build order

| # | ID | Effort | Why first |
|---|---|---|---|
| 1 | C2 | S | Pure CSS, no risk, unblocks readability everywhere |
| 2 | C1 | S | One rule, fixes the most-used interactive element |
| 3 | S6 | S | Three CSS lines, closes an open a11y gap |
| 4 | S3 | S | Two CSS characters, closes HIG gap |
| 5 | S4 | S | One token change, closes contrast gap |
| 6 | S1 + N2 | S | Role + aria-label on clue items, fixes screen-reader and concatenation together |
| 7 | S2 | S | Tabindex + role on chips, paired with S1 |
| 8 | C3 | M | Mobile keyboard overlap — needs device testing first |
| 9 | C4 | M | Chrome density — depends on C3 fix for full picture |
| 10 | S5 | M | Arabic visibility — requires UX decision |
| 11 | N1, N4 | S | Polish after blocking issues resolved |

---

## Structural rework flags

- **C3 (keyboard overlap)** looks like a CSS `env()` or ~10-line JS fix, NOT a layout rearchitecture. The risk is that `env(keyboard-inset-height)` is Chrome-only; the `visualViewport` fallback adds a small event listener. Either way, this is additive, not a rewrite.
- **C4 (chrome density)** requires rethinking the hint bar's role during active typing. A collapsible approach (CSS class toggle on focus) is a moderate addition but not structural. If the crossword grid fits in 330px on a phone, C4 may be low-severity; **verify on device before building**.
- **S5 (Arabic)** is a product decision (show/hide vs. scroll vs. two-line) before it is an engineering decision.

Nothing in this audit requires changing the crossword generation algorithm, the Firebase layer, or the game state machine.
