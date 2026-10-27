# Network & Society Flashcards

Spaced-repetition flashcards for network science and sociology, typeset like a LaTeX document. Concept cards ask you to define a term; proposition cards ask you to reconstruct why a claim is true. Diagrams are drawn in TikZ.

## Getting started

Double-click `index.html` to open it in your browser. That's all: no installation, no internet connection needed.

If your browser blocks local files, serve the folder instead and open <http://localhost:8000>:

```bash
python -m http.server 8000
```

## Studying

The **Study** tab shows one card at a time: all cards that are due, then up to 10 new ones.

1. Read the front and answer in your head (or out loud).
2. Flip the card: click it, press **Space** or **Enter**, or use **Show answer**.
3. Rate how well you knew it. Each button shows when you will see the card again.

| Rating | Key | Use it when… | Effect |
|---|---|---|---|
| Again | 1 | you didn't know it | comes back after 3 more cards |
| Hard | 2 | you got it, with effort | short interval |
| Good | 3 | you got it | interval grows |
| Easy | 4 | it was trivial | interval grows faster |

When nothing is left, you'll see **All caught up** and when the next review is due. **Start new session** gives you the next batch of new cards; **Cram everything** runs through every card regardless of schedule (useful before an exam).

### Card types

- **Concept**: the front shows a name (and a diagram); define it in your own words. The back gives the *Definition*, the formula, a *Remark* to help it stick, and the diagram.
- **Proposition**: the front states a claim; work out the argument. The back gives a *Proof sketch* and the source.

## The controls

| Control | What it does |
|---|---|
| Topic | Limit cards to one topic, or All |
| Concepts + propositions | Study both kinds, or only one |
| Concept → definition | Flip concept cards: show the definition, recall the name |
| Diagrams | Show or hide diagrams on cards |
| ◐ | Switch between light and dark (follows your system by default) |

Your choices are remembered.

## Other tabs

- **Quiz**: you get a definition (and diagram) and pick the right name from four. Keys **1–4** pick, **Space** goes to the next question. A right answer counts as *Good*, a wrong one as *Again*.
- **Browse**: every card in the current topic. Search by name or definition; click a card to see its details.
- **Stats**: cards seen, mature cards (interval of 21 days or more), cards due, reviews today, your day streak, and progress per topic.

## Your progress

Progress is saved automatically in your browser. It belongs to that browser and to the way you opened the app, so opening `index.html` directly and opening it through `localhost` keep **separate** progress.

To back up progress or move it to another browser or computer, use **Stats → Export progress** (saves `flashcards-progress.json`) and **Import progress** on the other side. **Reset all** erases everything after asking for confirmation.

## Adding your own cards

Cards live in two plain JavaScript files:

- `deck.js`: concept cards (`id`, `topic`, `name`, `def`, optional `formula`, `tip`)
- `props.js`: propositions (`id`, `name` = the claim, `def` = the argument, `src`, `ref` = a concept whose diagram is shown)

Never change the `id` of an existing card: your progress is stored under it.

Card text can use LaTeX: `$…$` for inline math, `\[…\]` for display math, plus `\emph{}`, `\textbf{}`, `--` and `---`. Write any text containing backslashes with `String.raw`, so you don't have to double them:

```js
formula: String.raw`$C_i = \frac{2 e_i}{k_i (k_i - 1)}$`,
```

After editing, check for mistakes (needs [Node.js](https://nodejs.org) 18 or newer):

```bash
node check.js
```

It reports duplicate ids, broken references, LaTeX that won't render, and diagrams that need rebuilding.

## Adding or editing diagrams

Each concept can have a diagram in `diagrams/<card id>.tex`: a single `tikzpicture` using the shared styles in `diagrams/preamble.tex`. Look at an existing file such as `diagrams/degree.tex` to get started.

Diagrams must be compiled after you change them. This needs Node.js and a TeX distribution with `latex` and `dvisvgm` (MiKTeX or TeX Live):

```bash
node build-diagrams.js
```

Only changed diagrams are rebuilt (`--all` rebuilds everything). The result, `diagrams.js`, is what the app loads, so the app itself never needs TeX.

Diagrams are black and white. Grey is allowed only when it means something, such as an opinion value or a shaded interval; colours are rejected by the build.

## Files

| Path | What it is |
|---|---|
| `index.html` | The app: open this |
| `deck.js`, `props.js` | The cards |
| `diagrams/` | TikZ sources, one per diagram |
| `diagrams.js` | Compiled diagrams (generated, don't edit) |
| `build-diagrams.js` | Compiles the diagrams |
| `check.js` | Checks cards and diagrams |
| `app.js`, `tex.js`, `style.css` | App logic, LaTeX text rendering, design |
| `vendor/katex/` | KaTeX, for math and the Computer Modern fonts (MIT licence) |
| `SPEC.md` | Full functional specification |
