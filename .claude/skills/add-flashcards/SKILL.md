---
name: add-flashcards
description: Add new concept or proposition cards to the network-science / sociology flashcard app in this project (deck.js, props.js), optionally with an SVG diagram. Use when the user asks to create, add, extend or fix flashcards.
---

# Adding flashcards to the Network & Society app

## How the app works (read first)

A zero-dependency static web app. Open `index.html` directly, or serve the folder (`python -m http.server`). No build step.

| File | Role |
|---|---|
| `index.html` | Shell: header (tabs, topic / kind / direction selects, diagrams checkbox). Loads scripts in order: `diagrams.js`, `deck.js`, `props.js`, `app.js`. |
| `diagrams.js` | SVG toolkit `D` (see below). Pure functions that return SVG strings. |
| `deck.js` | `const DECK = [...]`: **concept cards**. |
| `props.js` | `const PROPS = [...]`: **proposition cards**, pushed onto `DECK`. |
| `app.js` | Views (Study, Quiz, Browse, Stats), SM-2-lite scheduler, persistence. |
| `style.css` | Themes (auto light/dark + toggle) and SVG classes. |

**Card types**
- **Concept** (no `type` field): front = concept name (small diagram as a visual accent, optional), back = definition + formula + memory tip. A direction dropdown can flip it to Definition → concept.
- **Proposition** (`type: 'prop'`, set automatically by `props.js`): front = a claim, back = the argument / theory / proof sketch + source. Diagram on the back comes from the concept named in `ref`.

**Study flow:** Space flips, keys 1–4 rate (Again / Hard / Good / Easy). Again re-queues within the session; others set `due` days ahead (SM-2-lite: ease starts 2.5, Good = ×ease, Easy = ×ease×1.3). The Quiz tab only uses concept cards (shows a definition, pick the name).

**Persistence:** `localStorage` key `netsoc-flashcards-v1` stores `{cards: {id: {ease, interval, due, reps, lapses}}, log, settings}`. Progress is keyed by card `id`, so **never rename or reuse an existing id** (it would reset or mix up progress). Export/import JSON lives in the Stats tab.

## Card schemas

Concept (append to `DECK` in `deck.js`, inside the right topic section):
```js
{
  id: 'kebab-case-unique',          // unique across DECK and PROPS
  topic: T.S,                       // T.S Structure | T.C Centrality | T.T Ties & communities | T.O Sociology | T.Y Dynamics
  name: 'Concept name',             // what the learner must define
  def: 'One to three sentences. What it is, and what it is for.',
  formula: 'k_i = Σ_j A_ij',        // optional
  tip: 'Short mnemonic or intuition.',
  vis: () => D.svg(nodes, edges, { over: cap('short caption') })   // optional but nice
}
```

Proposition (append to `PROPS` in `props.js`):
```js
{
  id: 'p-short-slug',               // prefix p-
  name: 'The claim, as a full sentence.',
  def: 'The argument: premises, derivation or mechanism, evidence. HTML allowed (<code>…</code>, &lt; &gt;).',
  src: 'Author (year)',
  ref: 'existing-concept-id'        // whose diagram decorates the back (must exist in DECK)
}
```
The `.map(...)` at the end of `props.js` adds `type: 'prop'` and `topic: 'Propositions'`, so don't set them.

## Procedure

1. Read the tail of the relevant section of `deck.js` / `props.js` and grep ids to avoid duplicates (`Grep "id: 'candidate'"`).
2. Ask yourself which type fits. Concepts: a *named thing* with a definition. Propositions: a *claim* that has an argument or proof. The front must make the learner **produce** the explanation, so the front must not leak the answer (no definition in a concept's diagram caption, no conclusion in a proposition's prompt).
3. Write definitions that are correct and concise. For propositions, state the actual reasoning (a proof sketch, mechanism, or key evidence) and cite the source. Flag anything you are unsure of to the user rather than inventing a citation or number.
4. Add the entry with the Edit tool (not shell heredocs: apostrophes and `$` break them). Escape apostrophes in single-quoted JS strings (`\'`) and use `&lt;` / `&gt;` inside HTML strings.
5. Validate (see below), then preview in the browser (Browse tab shows every diagram; check light and dark).

## Diagram toolkit (`diagrams.js`)

All drawing happens in a 200×140 viewBox.
- `D.svg(nodes, edges, opts)`: nodes are `[x, y, opts]` where `opts` is a colour class string (`n` grey, `a` blue, `b` red, `c` green, `d` amber, `e` purple) or `{c, r, l(label), f(fill css), s(stroke), sw, o(opacity), d(dashed outline)}`. Edges are `[i, j, 'classes']` with classes `hl dash ghost pos neg amb thick thin arrow both`. `opts.under` / `opts.over` inject raw SVG behind / in front.
- `D.ring(n, cx, cy, r, offDeg)` → points on a circle (use `pts(arr, o)` in `deck.js` to turn them into nodes).
- `D.union([{nodes, edges, dx, dy, s}, …])` → `[nodes, edges]` for side-by-side panels (spread into `D.svg(...)`).
- `D.bars(values, {col, xl, yl})` → histogram SVG string (pass as `over` with empty nodes).
- `D.t(x, y, text, cls)` captions; in `deck.js` the helper `cap(text, y)` centres a caption at x=100.
- `D.op(v)` maps an opinion in [0,1] to a blue→orange colour; `D.frame(inner, alt)` wraps raw SVG.

Keep diagrams simple: a handful of nodes, one highlighted idea, a short caption. They are decoration, not the question. A card without `vis` is fine.

## Validate

Run from the project folder (checks every card renders, ids are unique, `ref`s resolve):
```bash
node -e "global.window={};const fs=require('fs');eval(fs.readFileSync('diagrams.js','utf8')+';global.D=D');eval(fs.readFileSync('deck.js','utf8')+';global.DECK=DECK');eval(fs.readFileSync('props.js','utf8'));const ids=DECK.map(c=>c.id);console.log(DECK.length,'cards');console.log('dupes',ids.filter((x,i)=>ids.indexOf(x)!==i));console.log('bad ref',DECK.filter(c=>c.type==='prop'&&!DECK.some(d=>d.id===c.ref)).map(c=>c.id));DECK.forEach(c=>{if(c.vis){const s=c.vis();if(/NaN|undefined/.test(s))console.log('BAD svg',c.id)}})"
```
Expected: no dupes, no bad refs, no BAD svg. (`props.js` uses `const PROPS` and `DECK.push`; if eval complains about redeclaration, it ran twice.)

## After adding

Tell the user how many cards were added, to which topic, and which facts or citations deserve a double-check. Existing progress is unaffected because it is keyed by id. New cards appear as new cards in the next study session (default limit 10 new per session).
