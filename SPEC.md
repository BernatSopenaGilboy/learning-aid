# Network & Society Flashcards: functional specification

Version 2.0 (2026-10-27). Covers the whole app as it works today, plus the redesign: every card typeset in LaTeX, diagrams drawn in TikZ, and a minimal black-and-white interface with a LaTeX feel.

Status tags: **[existing]** already works this way and must keep working, **[new]** to be built, **[changed]** works today but will change.

---

## 1. Purpose and scope

A personal spaced-repetition flashcard app for network science and sociology. It holds two card types (concepts and propositions), schedules reviews with an SM-2-style algorithm, and adds a quiz, a browsable card list and progress statistics.

Out of scope: user accounts, syncing between devices, a card editor in the UI, audio, images other than the TikZ diagrams.

## 2. Platform and constraints

| ID | Requirement | Status |
|---|---|---|
| NF-1 | Static web app: `index.html` + plain JS + CSS. The app itself has no build step and no package manager. | existing |
| NF-2 | Works opened directly from disk (`file://`) and from any static server. | existing |
| NF-3 | Works offline. Third-party code (KaTeX) is stored in the repo under `vendor/`, never loaded from a CDN. | new |
| NF-4 | Diagrams are the only built asset: TikZ sources in `diagrams/` compile to one generated file, `diagrams.js`, which is committed. Running the app never needs TeX; only editing a diagram does. | new |
| NF-5 | Script load order: `vendor/katex/katex.min.js`, `tex.js`, `diagrams.js`, `deck.js`, `props.js`, `app.js`. | changed |
| NF-6 | Usable at phone width (≥ 360 px) with no horizontal scrolling. | existing |
| NF-7 | Respects `prefers-reduced-motion` (no flip animation). | existing |

## 3. Card content model

### 3.1 Concept cards (`deck.js`, array `DECK`)

| Field | Meaning | Required |
|---|---|---|
| `id` | kebab-case, unique across all cards. Never renamed or reused: progress is keyed by it. | yes |
| `topic` | one of `Structure`, `Centrality`, `Ties & communities`, `Sociology`, `Dynamics` (via `T.*`). | yes |
| `name` | the concept to recall. | yes |
| `def` | 1–3 sentence definition. | yes |
| `formula` | key formula, pure LaTeX math. | no |
| `tip` | memory hook. | yes |

A concept has a diagram if and only if `diagrams/<id>.tex` exists. **[changed]** (The old `vis` field and the SVG toolkit `D` are removed.)

### 3.2 Proposition cards (`props.js`, array `PROPS`, appended to `DECK`)

| Field | Meaning | Required |
|---|---|---|
| `id` | `p-` prefix, unique. | yes |
| `name` | the claim, as a full sentence. | yes |
| `def` | the argument: proof sketch, mechanism or evidence. | yes |
| `src` | source citation. | yes |
| `ref` | id of an existing concept whose diagram decorates the back. | yes |

`type: 'prop'` and `topic: 'Propositions'` are added automatically. **[existing]**

### 3.3 LaTeX card text **[new]**

Every text field of every card (`name`, `def`, `formula`, `tip`, `src`) is rendered by `tex.js`, which typesets it the way LaTeX would and renders math with KaTeX. The existing card content is not rewritten: this version only guarantees the format and that content renders correctly.

| ID | Requirement |
|---|---|
| C-1 | Inline math between `$…$` and display math between `\[…\]`, in any field (including `formula`). |
| C-2 | Fields containing backslashes are written with ``String.raw`…` `` so authors type `\sum`, not `\\sum`. Inside `String.raw` use straight quotes `"…"` (backticks would end the string). |
| C-3 | Text-mode markup: `\emph{}`, `\textbf{}`, `\textsc{}`, `--` (en dash), `---` (em dash), `a~b` (non-breaking space; a spaced ` ~ ` stays literal), ` ``…'' ` and `"…"` (curly quotes), `'` (apostrophe), `\$` (literal dollar). |
| C-4 | Existing content keeps rendering as before: plain text, Unicode math (`Σ_j A_ij`, `⟨k⟩`) and the HTML already in proposition arguments (`<code>`, `&lt;`). |
| C-5 | No card text refers to diagram colours. (Done: the tips that did were rewritten with the TikZ diagrams.) |
| C-6 | If KaTeX cannot parse an expression, that expression is shown as raw source in typewriter type, the rest of the card renders, and a warning naming the card id is logged. |
| C-7 | Converting existing Unicode pseudo-math to `$…$` is optional content work, outside this version. |

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

### 4.2 Card faces **[existing content, changed typesetting]**

| Card | Front | Back |
|---|---|---|
| Concept, *Concept → definition* | topic, name, diagram (if diagrams on), prompt "Define it in your own words.", hint "Space = flip" | topic, name, definition, formula, tip, diagram |
| Concept, *Definition → concept* | topic, definition, formula, prompt "Which concept is this?", hint | topic, name, tip, diagram |
| Proposition | topic, claim, prompt "Why is this true? Reconstruct the argument.", hint | topic, claim, argument, source, diagram of the `ref` concept |

Back diagrams appear only when diagrams are on. The front must never leak the answer: no definition in a forward front's diagram caption, no conclusion in a proposition prompt.

Both faces are typeset like a LaTeX page (§6): topic as a small-caps label top left, name or claim centred as a title, definition and argument as justified body text, formula as centred display math, tip set off as an italic remark, source in small type, prompt in italics.

### 4.3 Quiz

| ID | Requirement | Status |
|---|---|---|
| Q-1 | Uses concept cards from the current topic only (propositions excluded), ignoring the kind filter. Needs at least 4; otherwise shows a message. | changed (bug fix: today the hidden kind filter still applies, so with "Propositions only" chosen in Study the quiz says it has no cards) |
| Q-2 | Picks the target from due cards 60 % of the time when any are due, otherwise from all concept cards. | existing |
| Q-3 | Shows the target's definition and (if diagrams are on) its diagram, plus four name options: the answer and three distractors, same-topic distractors first. | existing |
| Q-4 | Pick by click or keys 1–4. After picking, the correct option is marked ✓ and set in bold; a wrong pick is marked ✗ and struck through. | changed |
| Q-5 | A correct pick counts as **Good**, a wrong one as **Again**, in the scheduler and the daily log. | existing |
| Q-6 | After picking: name, topic, formula, tip, and **Next →** (or Space / Enter). | existing |

### 4.4 Browse **[existing]**

| ID | Requirement |
|---|---|
| B-1 | Grid of all cards in the current topic and kind filter. |
| B-2 | Search box filters by name and definition (case-insensitive, matched against the LaTeX source). |
| B-3 | Each tile shows topic, diagram (concepts only, regardless of the diagrams toggle) and name. Clicking a tile toggles its details: definition, formula, and tip (concept) or source (proposition). |

### 4.5 Stats **[existing]**

| ID | Requirement |
|---|---|
| T-1 | Figures: cards seen / total, mature cards (interval ≥ 21 days), due now, reviews today, day streak. Computed over the whole deck, ignoring filters. |
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

## 6. Visual design **[new]**

The whole interface, not only the cards, should feel like a well-typeset LaTeX document: minimal, polished, math-oriented.

| ID | Requirement |
|---|---|
| V-1 | **Type.** Computer Modern throughout: KaTeX's fonts (KaTeX_Main for text, KaTeX_Math for math, KaTeX_Typewriter for keys and code). No sans-serif anywhere. |
| V-2 | **No colour.** Ink (black) on paper (white). No hue in any element: header, tabs, buttons, cards, quiz feedback, stats, diagrams. |
| V-3 | **Grey only with meaning.** A grey tone is allowed only when it carries information, e.g. a quantity such as tie strength or an opinion value, or a region such as a confidence interval. Never for decoration, borders, secondary text or hover states. |
| V-4 | Hierarchy comes from size, weight, italics and small caps, as in LaTeX, not from colour or shadows. Secondary text (hints, counters) is black, smaller and/or italic. |
| V-5 | Rules, not boxes: thin black lines (≈ 0.4–0.8 px) for card borders, header rule and dividers. No shadows, no rounded pills, corner radius 0. |
| V-6 | Controls look like typeset text: tabs and buttons in small caps with a thin rule; the active tab is shown by inverting (white on black) or underlining. Rating buttons carry no colour, only their label, key and interval. |
| V-7 | Generous margins and a narrow measure (≈ 40 em for body text), centred like a page. Body text justified with hyphenation on the card back. |
| V-8 | Dark theme inverts ink and paper (near-white on near-black). It follows the system setting by default; the toggle overrides it. Every distinction in the light theme must survive the inversion, including diagram greys. |
| V-9 | Keyboard focus stays visible (a thin dotted black outline). |

## 7. Controls, settings and persistence **[existing]**

| ID | Requirement |
|---|---|
| P-1 | Header controls: topic (All + each topic + Propositions), kind (concepts + propositions / concepts only / propositions only), direction (forward / reverse), diagrams checkbox, theme toggle. |
| P-2 | Visibility: direction only in Study; kind hidden in Quiz and Stats; diagrams checkbox only in Study and Quiz; topic hidden in Stats. |
| P-3 | Changing topic or kind rebuilds the study queue and resets the quiz. Changing direction re-renders the current card. |
| P-4 | Theme: follows the system by default; the toggle switches to the opposite of what is shown and remembers it. |
| P-5 | State is saved to `localStorage` key `netsoc-flashcards-v1` as `{cards, log, settings}` after every change. If storage is unavailable the app runs in memory without errors. |
| P-6 | Settings defaults: view Study, direction forward, kind All, diagrams on, topic All, `newLimit` 10, theme system. |
| P-7 | The storage format does not change in this version, so existing progress survives the redesign. |

Keyboard: in Study, Space / Enter flips and 1–4 rate (after flipping); in Quiz, 1–4 pick and Space / Enter goes to the next question after answering. Shortcuts are ignored while typing in an input, select or textarea, and when Ctrl / Cmd is held.

## 8. Diagrams (TikZ) **[new]**

### 8.1 Sources and build

| ID | Requirement |
|---|---|
| D-1 | One file per diagram, `diagrams/<card id>.tex`, holding only a `tikzpicture` environment. |
| D-2 | A shared preamble, `diagrams/preamble.tex`, defines the libraries and every named style (§8.3). Diagram files use those styles rather than raw line widths or fills, so the look can be changed in one place. |
| D-3 | Every picture uses the `card` style: a fixed 200 × 140 canvas (5 cm × 3.5 cm), origin top left, y pointing down, so all diagrams share one scale and text size. |
| D-4 | `node build-diagrams.js` compiles each changed `.tex` with `latex` and converts it with `dvisvgm --no-fonts` (glyphs become paths, so no font files are needed). It then writes `diagrams.js`: `const DIAGRAMS = { id: '<svg…>' }`. Unchanged files are skipped (content hash); `--all` forces a full rebuild. |
| D-5 | The build post-processes each SVG: removes the XML header and fixed width/height (keeps the viewBox), prefixes every internal id with the card id so many diagrams can sit on one page, and maps black to the ink colour, white to the paper colour and greys to an ink/paper mix (V-8). |
| D-6 | A LaTeX error stops the build for that file and prints the file name and the relevant log lines. Other files still build. The previous `diagrams.js` entry is kept. |
| D-7 | Intermediate files go to `diagrams/build/`, which git ignores. |

### 8.2 Display

| ID | Requirement |
|---|---|
| D-8 | The app shows `DIAGRAMS[id]` for a concept, and `DIAGRAMS[ref]` for a proposition. A card without a diagram shows none. |
| D-9 | Diagrams scale to the width available (front: up to ≈ 300 px wide; back, quiz and browse: up to ≈ 520 px) and keep their aspect ratio. |

### 8.3 Visual vocabulary

| Element | Style |
|---|---|
| Node, default | small open circle (white fill, thin black outline) |
| Node, emphasised (the node the card is about, an active / infected / adopting node, or group 1 when two groups are compared) | filled black, labels in white |
| Second group | open circle; a third category uses a different shape (square), not a grey |
| Removed node | dashed outline |
| Size | node size encodes degree or importance where the concept is about that |
| Tie | thin solid line |
| Emphasised tie (the tie the card is about) | thicker solid line |
| Strong vs weak tie | thick solid vs thin dashed |
| Absent or potential tie | dotted |
| Signed tie | positive solid, negative dashed, signs written as $+$ / $-$ |
| Directed tie | arrow with a LaTeX-style tip |
| Labels and captions | Computer Modern, math in math mode ($k_i$, $\sigma_{st}$, $\varepsilon$), captions in `\footnotesize` |
| Grey | only per V-3: opinion values (white → black ramp), tie weights, a shaded interval |

## 9. Validation

| ID | Requirement | Status |
|---|---|---|
| X-1 | A node check script, `node check.js`, verifies: ids are unique, every `ref` resolves, every concept diagram file has a matching card and vice versa (reported, not an error, for concepts without a diagram). | changed |
| X-2 | It runs KaTeX over every `formula` and every `$…$` / `\[…\]` span and reports parse errors by card id. | new |
| X-3 | It flags colour words in card text. | new |
| X-4 | It checks `diagrams.js`: one entry per diagram file, and no colour other than ink, paper and greys in any SVG. | new |
| X-5 | The `add-flashcards` skill documents the LaTeX text conventions (§3.3), the TikZ workflow and styles (§8), and `check.js`. | new |
