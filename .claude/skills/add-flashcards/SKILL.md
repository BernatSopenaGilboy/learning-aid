---
name: add-flashcards
description: Add new concept or proposition cards to the network-science / sociology flashcard app in this project (deck.js, props.js), optionally with a TikZ diagram. Use when the user asks to create, add, extend or fix flashcards.
---

# Adding flashcards to the Network & Society app

## How the app works (read first)

A static web app with a LaTeX look: open `index.html` directly, or serve the folder (`python -m http.server`). The app has no build step. Only diagrams are built: TikZ sources compile to `diagrams.js` (committed). `SPEC.md` is the full functional spec.

| File | Role |
|---|---|
| `index.html` | Shell. Loads `vendor/katex/katex.min.js`, `tex.js`, `diagrams.js`, `deck.js`, `props.js`, `app.js` in that order. |
| `deck.js` | `const DECK = [...]`: **concept cards**. |
| `props.js` | `const PROPS = [...]`: **proposition cards**, pushed onto `DECK`. |
| `diagrams/<id>.tex` | One TikZ picture per concept card. `diagrams/preamble.tex` holds the shared styles. |
| `build-diagrams.js` | Compiles changed diagrams (latex + dvisvgm, from MiKTeX) into `diagrams.js`. |
| `tex.js` | Typesets card text: `$…$` / `\[…\]` math via KaTeX, `\emph{}` etc. |
| `app.js` | Views (Study, Quiz, Browse, Stats), SM-2-lite scheduler, persistence. |
| `check.js` | Validates cards, LaTeX and diagrams. |
| `style.css` | Black-and-white, Computer Modern design (light/dark). |

**Card types**
- **Concept** (no `type` field): front = name (+ diagram), back = *Definition.* + formula + *Remark.* (the tip) + diagram. A direction dropdown can flip it to Definition → concept.
- **Proposition** (`type: 'prop'`, set automatically by `props.js`): front = **Proposition.** *claim*, back = *Proof sketch.* (the argument) + source + the diagram of the concept named in `ref`.

**Persistence:** `localStorage` key `netsoc-flashcards-v1`, keyed by card `id`, so **never rename or reuse an existing id**.

## Card schemas

Concept (append to `DECK` in `deck.js`, inside the right topic section):
```js
{
  id: 'kebab-case-unique',          // unique across DECK and PROPS; also the diagram file name
  topic: T.S,                       // T.S Structure | T.C Centrality | T.T Ties & communities | T.O Sociology | T.Y Dynamics
  name: 'Concept name',
  def: 'One to three sentences. What it is, and what it is for.',
  formula: String.raw`$k_i = \sum_j A_{ij}$`,   // optional
  tip: 'Short mnemonic or intuition.'
}
```

Proposition (append to `PROPS` in `props.js`):
```js
{
  id: 'p-short-slug',               // prefix p-
  name: 'The claim, as a full sentence.',
  def: String.raw`The argument: premises, derivation or mechanism, evidence. Math as $\langle k\rangle$.`,
  src: 'Author (year)',
  ref: 'existing-concept-id'        // whose diagram decorates the back (must exist in DECK)
}
```
The `.map(...)` at the end of `props.js` adds `type: 'prop'` and `topic: 'Propositions'`.

## Writing card text (LaTeX conventions)

Every field goes through `tex.js`:
- Inline math `$…$`, display math `\[…\]`, in any field including `formula`.
- Any field with a backslash: write it as ``String.raw`…` `` so `\sum` needs no doubling. Inside `String.raw`, use straight quotes `"…"` (a backtick would end the string) and never write `${`.
- Text markup: `\emph{}`, `\textbf{}`, `\textsc{}`, `--` en dash, `---` em dash, `a~b` non-breaking space, `"…"` or ` ``…'' ` curly quotes, `\$` literal dollar.
- Plain text, Unicode symbols and the old HTML (`<code>`, `&lt;`) still render, but prefer `$…$` for math in new cards.
- Never mention colours: diagrams are black and white (say "filled", "dashed", "dotted" instead).

## Diagrams (TikZ)

Create `diagrams/<card id>.tex` containing only a `tikzpicture` with the `card` style:
```latex
\begin{tikzpicture}[card]
  \node[f, r=11] (c) at (100,66) {$k{=}5$};
  \foreach \i in {0,...,4} {
    \node[v] (n\i) at ([shift={(100,66)}] {-90+72*\i}:46) {};
    \draw[hl] (c) -- (n\i);
  }
  \node[note] at (100,130) {how many ties does this node have?};
\end{tikzpicture}
```
- **Canvas:** 200 × 140 units, origin top left, **y points down**. Polar coordinates around a centre: `([shift={(cx,cy)}] angle:radius)`; angle −90 is straight up.
- **Nodes:** `v` open (default), `f` filled (the node the card is about, active/infected/adopting, or group 1), `sq` square (a third category), `gone` dashed (removed), `op=NN` grey fill for an opinion value 0–100. Size with `r=<radius>` (default 6). Labels inside nodes are `\tiny`; use `font=\scriptsize` for letters like `$A$`.
- **Ties:** plain `\draw`, `hl` (the tie the card is about), `strong`, `weak` (dashed), `absent` (dotted: missing or potential), `neg` (negative sign), arrows with `->`.
- **Text:** `note` for captions (`\scriptsize`), `sign` for $+$/$-$ labels, `axis`, `bar` for histograms.
- **Grey only when it carries meaning** (an opinion value, a tie weight, a shaded interval such as `\fill[black!12]`). Never for decoration. No colours at all: the build rejects them.
- Keep it simple: a handful of nodes, one idea, a short caption. The caption on a concept's front must not give away the definition.
- TikZ gotchas: no commas inside a coordinate expression (precompute with `\pgfmathsetmacro`); brace the body of a `\foreach` that calls a macro; `cap` is a TikZ key (use `note`).

Build and preview:
```bash
node build-diagrams.js          # only changed diagrams; --all to rebuild everything; or list ids
```
Every build also writes `diagrams/build/preview.html`: all diagrams side by side in light and dark (add `#id1,id2` to the URL to show only some). Look at a new diagram there, or in the app's Browse tab with both themes (◐).

## Validate

```bash
node check.js
```
Expected: 0 errors. It reports duplicate ids, unresolved `ref`s, LaTeX that KaTeX cannot parse, diagram files without a card, colours in compiled diagrams, a stale `diagrams.js` (run the build), and warns about concepts without a diagram or colour words in card text.

## Procedure

1. Grep ids to avoid duplicates (`Grep "id: 'candidate'"`).
2. Concept = a *named thing* with a definition; proposition = a *claim* with an argument. The front must make the learner **produce** the answer, so it must not leak it.
3. Write correct, concise text; for propositions give the actual reasoning and cite the source. Flag anything uncertain instead of inventing a citation or number.
4. Add the entry with the Edit tool (not shell heredocs).
5. Optional diagram: write `diagrams/<id>.tex`, run `node build-diagrams.js`.
6. Run `node check.js`, then look at the card in the browser (light and dark).

## After adding

Tell the user how many cards were added, to which topic, and which facts or citations deserve a double-check. Existing progress is unaffected. New cards appear as new cards in the next study session (default limit 10 new per session).
