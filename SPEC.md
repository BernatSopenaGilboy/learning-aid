# Network & Society Flashcards: functional specification

Version 2.0 (draft, 2026-10-27). Covers the whole app as it works today, plus the planned redesign: LaTeX-typeset card fronts and black-and-white diagrams.

Status tags: **[existing]** already works this way and must keep working, **[new]** to be built, **[changed]** works today but will change.
Priority: **Must** / **Should** / **Could**.

---

## 1. Purpose and scope

A personal spaced-repetition flashcard app for network science and sociology. It holds two card types (concepts and propositions), schedules reviews with an SM-2-style algorithm, and adds a quiz, a browsable card list and progress statistics.

Out of scope: user accounts, syncing between devices, a card editor in the UI, audio, images other than generated SVG diagrams.

## 2. Platform and constraints

| ID | Requirement | Status | Priority |
|---|---|---|---|
| NF-1 | Static web app: `index.html` + plain JS + CSS. No build step, no package manager. | existing | Must |
| NF-2 | Works opened directly from disk (`file://`) and from any static server. | existing | Must |
| NF-3 | Works offline. Any third-party library (KaTeX) is stored in the repo under `vendor/`, not loaded from a CDN. | new | Must |
| NF-4 | Script load order: `vendor/katex/*`, `diagrams.js`, `deck.js`, `props.js`, `app.js`. | changed | Must |
| NF-5 | Usable at phone width (≥ 360 px) with no horizontal scrolling. | existing | Must |
| NF-6 | Respects `prefers-reduced-motion` (no flip animation). | existing | Should |

## 3. Card content model

### 3.1 Concept cards (`deck.js`, array `DECK`)

| Field | Meaning | Required |
|---|---|---|
| `id` | kebab-case, unique across all cards. Never renamed or reused (progress is keyed by it). | yes |
| `topic` | one of `Structure`, `Centrality`, `Ties & communities`, `Sociology`, `Dynamics` (via `T.*`). | yes |
| `name` | the concept to recall. | yes |
| `def` | 1–3 sentence definition. | yes |
| `formula` | key formula. | no |
| `tip` | memory hook. | yes |
| `vis` | function returning an SVG string. | no |

### 3.2 Proposition cards (`props.js`, array `PROPS`, appended to `DECK`)

| Field | Meaning | Required |
|---|---|---|
| `id` | `p-` prefix, unique. | yes |
| `name` | the claim, as a full sentence. | yes |
| `def` | the argument: proof sketch, mechanism or evidence. HTML allowed. | yes |
| `src` | source citation. | yes |
| `ref` | id of an existing concept whose diagram decorates the back. | yes |

`type: 'prop'` and `topic: 'Propositions'` are added automatically. **[existing]**

### 3.3 LaTeX in card text **[new]**

| ID | Requirement | Priority |
|---|---|---|
| C-1 | `formula` holds pure LaTeX math with no delimiters, e.g. ``String.raw`k_i = \sum_j A_{ij}` ``. It is rendered as display math. | Must |
| C-2 | `name`, `def` and prop `name` may contain inline math between `$…$`, e.g. ``String.raw`Giant component appears when $\langle k\rangle > 1$` ``. | Must |
| C-3 | Fields containing backslashes are written with ``String.raw`…` `` so authors type `\sum`, not `\\sum`. | Must |
| C-4 | A literal dollar sign is written `\$`. | Must |
| C-5 | Text-mode commands `\emph{}`, `\textbf{}`, `--` (en dash) and `---` (em dash) are supported in front text. Other text-mode LaTeX is not. | Should |
| C-6 | All 27 existing formulas are converted from Unicode pseudo-math (`Σ_j A_ij`) to LaTeX. Math inside prop claims and inside concept definitions (shown on reverse-mode fronts) is converted to `$…$`. | Must |
| C-7 | The back's HTML (`<code>`, `&lt;`) keeps working. Converting `<code>` math on the back to `$…$` is optional. | Could |

## 4. Views

The header has four tabs: **Study**, **Quiz**, **Browse**, **Stats**. The active tab is persisted. **[existing]**

### 4.1 Study **[existing]**

| ID | Requirement |
|---|---|
| S-1 | A session queue = all **due** cards in the current filter (shuffled), followed by up to `newLimit` (default 10) **new** cards (shuffled). |
| S-2 | A card is *due* if it has been reviewed at least once and its due time has passed. A card is *new* if it has never been reviewed. |
| S-3 | One card is shown at a time. Above it: "N left in session" and either "new card" or "reviewed n×". |
| S-4 | The card flips (3D, 0.5 s) on click, on the **Show answer** button, or on Space / Enter. Flipping again turns it back. |
| S-5 | After flipping, four rating buttons appear: Again / Hard / Good / Easy, each showing its key (1–4) and the interval it would produce (minutes if under 90 min, else days). |
| S-6 | Rating removes the card from the queue. **Again** re-inserts it after the next 3 cards. |
| S-7 | When the queue is empty: "All caught up", the time of the next scheduled review (if any), and two buttons: **Start new session** (S-1 again) and **Cram everything** (all cards in the filter, shuffled, ignoring due dates). |

### 4.2 Card faces

#### Front **[changed]**

| Card | Front shows |
|---|---|
| Concept, direction *Concept → definition* | topic, name, diagram (if diagrams are on), prompt "Define it in your own words.", hint "Space = flip" |
| Concept, direction *Definition → concept* | topic, definition, formula (if any), prompt "Which concept is this?", hint |
| Proposition | topic, claim, prompt "Why is this true? Reconstruct the argument.", hint |

The front must never leak the answer (no definition in a forward front's diagram caption, no conclusion in a proposition prompt). **[existing]**

#### Front typesetting **[new]**

| ID | Requirement | Priority |
|---|---|---|
| F-1 | All front text is set in Computer Modern (the KaTeX_Main font shipped with KaTeX). | Must |
| F-2 | Inline and display math (C-1, C-2) is rendered with KaTeX. | Must |
| F-3 | Black text on a white page. No colour on the front anywhere. | Must |
| F-4 | Layout reads like a typeset LaTeX page: topic as a small-caps label top left (like `\textsc`), concept name or claim centred as a title, prompt in italics (like `\emph`), hint in black at a smaller size. | Must |
| F-5 | No drop shadow, no rounded pill for the topic. The card is a plain rectangle with a thin black border (radius ≤ 2 px). | Must |
| F-6 | If KaTeX cannot parse an expression, the raw source is shown in monospace, the rest of the card still renders, and a warning is logged to the console. | Must |
| F-7 | In dark theme the front inverts: near-white ink on near-black paper. | Should |
| F-8 | Long claims and definitions stay readable: the front scrolls inside the card rather than overflowing. | Must |

#### Back **[existing]**

| Card | Back shows |
|---|---|
| Concept, forward | topic, name, definition, formula, tip, diagram |
| Concept, reverse | topic, name, tip, diagram |
| Proposition | topic, claim (small), argument, source, diagram of the `ref` concept |

Diagrams appear on the back only when diagrams are on. Back formulas should render with KaTeX too, so a formula looks the same on both sides. **[changed, Should]** Restyling the rest of the back is out of scope for this version (see §9).

### 4.3 Quiz **[existing]**

| ID | Requirement |
|---|---|
| Q-1 | Uses concept cards from the current topic only (propositions excluded), ignoring the kind filter. Needs at least 4; otherwise shows a message. **[changed]** Known bug today: the quiz still applies the hidden kind filter, so with "Propositions only" selected in Study the quiz says it has no cards. |
| Q-2 | Picks the target from due cards 60 % of the time when any are due, otherwise from all concept cards. |
| Q-3 | Shows the target's definition and (if diagrams are on) its diagram, plus four name options: the answer and three distractors, same-topic distractors first. |
| Q-4 | Pick by click or keys 1–4. The right option is marked correct and a wrong pick marked wrong (B&W: see D-9). |
| Q-5 | A correct pick counts as **Good**, a wrong one as **Again**, in the scheduler and the daily log. |
| Q-6 | After picking: name, topic, formula, tip, and **Next →** (or Space / Enter). |

### 4.4 Browse **[existing]**

| ID | Requirement |
|---|---|
| B-1 | Grid of all cards in the current topic and kind filter. |
| B-2 | Search box filters by name and definition (case-insensitive). |
| B-3 | Each tile shows topic, diagram (concepts only, always shown regardless of the diagrams toggle) and name. Clicking a tile toggles its details: definition, formula, and tip (concept) or source (proposition). |

### 4.5 Stats **[existing]**

| ID | Requirement |
|---|---|
| T-1 | Tiles: cards seen / total, mature cards (interval ≥ 21 days), due now, reviews today, day streak. Computed over the whole deck, ignoring filters. |
| T-2 | Streak = consecutive days with at least one review, counting back from today (or from yesterday if nothing has been reviewed yet today). |
| T-3 | One progress bar per topic: cards seen / cards in topic. |
| T-4 | **Export progress** downloads `flashcards-progress.json` with cards, log and settings. |
| T-5 | **Import progress** reads a JSON file, keeps only entries whose id exists and whose `ease, interval, due, reps, lapses` are finite numbers, replaces cards and log, leaves settings alone. Unreadable file → alert. |
| T-6 | **Reset all** asks for confirmation, then erases cards and log. |

## 5. Scheduler (SM-2 lite) **[existing]**

New card state: `ease 2.5, interval 0, due 0, reps 0, lapses 0`. On rating:

| Rating | Effect |
|---|---|
| Again (0) | `lapses + 1`, `interval = 0`, `ease − 0.2` (min 1.3), due in 1 minute |
| Hard (1) | `interval = max(1, interval × 1.2)`, `ease − 0.15` (min 1.3) |
| Good (2) | `interval = 1` if it was below 1, else `interval × ease` |
| Easy (3) | `interval = 3` if it was below 1, else `interval × ease × 1.3`; `ease + 0.1` |

For Hard / Good / Easy the interval is rounded, at least 1 day, and due = now + interval days. Every rating increments `reps` and adds 1 to today's count in the log.

## 6. Controls, settings and persistence **[existing]**

| ID | Requirement |
|---|---|
| P-1 | Header controls: topic (All + each topic + Propositions), kind (concepts + propositions / concepts only / propositions only), direction (forward / reverse), diagrams checkbox, theme toggle. |
| P-2 | Visibility: direction only in Study; kind hidden in Quiz and Stats; diagrams checkbox only in Study and Quiz; topic hidden in Stats. |
| P-3 | Changing topic or kind rebuilds the study queue and resets the quiz. Changing direction re-renders the current card. |
| P-4 | Theme: follows the system by default; the toggle switches to the opposite of what is shown and remembers it. |
| P-5 | State is saved to `localStorage` key `netsoc-flashcards-v1` as `{cards, log, settings}` after every change. If storage is unavailable the app runs in memory without errors. |
| P-6 | Settings defaults: view Study, direction forward, kind All, diagrams on, topic All, `newLimit` 10, theme system. |
| P-7 | The storage format does not change in this version, so existing progress survives the redesign. |

### Keyboard **[existing]**

| Key | Study | Quiz |
|---|---|---|
| Space / Enter | flip | next question (after answering) |
| 1–4 | rate (after flip) | pick option |

Shortcuts are ignored while typing in an input, select or textarea, and when Ctrl / Cmd is held.

## 7. Diagrams

### 7.1 Toolkit **[existing]**

`diagrams.js` exposes `D`: `D.svg(nodes, edges, opts)`, `D.ring`, `D.union`, `D.bars`, `D.t`, `D.op`, `D.frame`. All diagrams use a 200 × 140 viewBox. Node and edge specs keep their current shape, so `deck.js` diagram code keeps working.

### 7.2 Black-and-white style **[new]**

| ID | Requirement | Priority |
|---|---|---|
| D-1 | Diagrams use only ink (black) and paper (white), plus one light grey tone. No hue anywhere, on front, back, quiz or browse. | Must |
| D-2 | The existing colour classes keep their names but map to B&W styles, so most card code needs no edits (table below). | Must |
| D-3 | Node labels contrast with their node: white on black or grey nodes, black on white nodes. | Must |
| D-4 | Labels and captions use the same Computer Modern font as the front. Captions in italics. | Must |
| D-5 | `D.op(v)` (opinion in [0,1]) maps to a white → black grey ramp instead of blue → orange. | Must |
| D-6 | Every diagram whose meaning depends on telling groups apart (about 28 of 46, e.g. homophily, Schelling, balance, SIR, communities, echo chambers) stays readable in B&W. Where the class mapping is not enough, that diagram is adjusted by hand. | Must |
| D-7 | Dark theme inverts ink and paper; distinctions between classes survive the inversion. | Should |
| D-8 | Strokes are thin and uniform, TikZ-like: default edge ≈ 1 px, highlighted edge ≈ 2.5 px. | Should |
| D-9 | Quiz correct / wrong marking uses B&W: correct = black fill with white text plus ✓, wrong = struck through plus ✗. | Should |

Class mapping:

| Class | Was | Becomes |
|---|---|---|
| `n` neutral node | grey | white fill, black outline |
| `a` primary node | blue | solid black |
| `b` second group | red | light grey fill, black outline |
| `c` third group | green | white fill, black outline, black centre dot |
| `d` focal / emphasis | amber | solid black with white inner ring |
| `e` fifth group | purple | white fill, dotted black outline |
| edge default | grey | thin black |
| `hl` | orange, thick | black, thick |
| `ghost` | faint dotted | light grey dotted |
| `pos` / `neg` (signed ties) | green solid / red dashed | black solid / black dashed |
| `amb` | amber | black dash-dot |
| bars `a` / `b` / `n` | blue / red / grey | black / light grey / white outlined |
| Venn sets 1 / 2 / 3 | coloured fills | outlines only: solid / dashed / dotted |
| Schelling cells | blue / red | black / light grey; unhappy = thick outline |
| band, rings, axis, ✗ marks | coloured | light grey / black |

Card text never refers to diagram colours (checked: no colour words in `deck.js` or `props.js`). New cards must keep it that way.

## 8. Validation

| ID | Requirement | Status | Priority |
|---|---|---|---|
| V-1 | A node one-liner checks: every card renders, ids are unique, every `ref` resolves, no SVG contains `NaN` or `undefined`. | existing | Must |
| V-2 | The validator also runs KaTeX over every `formula` and every `$…$` span and reports parse errors by card id. | new | Must |
| V-3 | The validator flags any hex colour, `rgb(`, or `color-mix(` left in generated SVG. | new | Should |
| V-4 | The `add-flashcards` skill documents the LaTeX conventions (C-1 to C-5), the B&W class meanings (§7.2) and the new validator. | new | Must |

## 9. Open questions

1. **Back of the card.** This spec only retypesets the front (plus back formulas and diagrams). Should the back get the same LaTeX look, so the flip does not jump from serif to sans?
2. **Pure black and white, or one grey?** §7.2 allows one light grey to separate a second group. Strictly two tones would mean hatching patterns instead, which are hard to read on 6 px nodes.
3. **App chrome.** Header, tabs and rating buttons still use the blue accent and coloured borders. Make them monochrome too?
