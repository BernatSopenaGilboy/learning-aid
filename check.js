#!/usr/bin/env node
/* Checks the card data and diagrams. Run after adding or editing cards:  node check.js
   Errors (exit code 1): duplicate ids, unresolved refs, LaTeX that KaTeX cannot parse,
   a diagram file without a card, colour (non-grey) in a compiled diagram.
   Warnings: concepts without a diagram, diagrams.js not rebuilt after a .tex change, colour words in card text. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const dir = __dirname, read = f => fs.readFileSync(path.join(dir, f), 'utf8');

global.katex = require(path.join(dir, 'vendor/katex/katex.min.js'));
const { TeX, DIAGRAMS, DIAGRAM_SOURCES, DECK } = new Function(
  [read('tex.js'), read('diagrams.js'), read('deck.js'), read('props.js'),
   'return { TeX, DIAGRAMS, DIAGRAM_SOURCES: typeof DIAGRAM_SOURCES === "undefined" ? {} : DIAGRAM_SOURCES, DECK };'].join('\n;\n'))();
// same hash as build-diagrams.js
const sourceHash = (pre, body) => crypto.createHash('sha1').update((pre + body).replace(/\r\n/g, '\n')).digest('hex').slice(0, 12);

const errors = [], warnings = [];
const ids = DECK.map(c => c.id);

// ids and refs
ids.filter((id, i) => ids.indexOf(id) !== i).forEach(id => errors.push(`duplicate id: ${id}`));
DECK.filter(c => c.type === 'prop' && !ids.includes(c.ref)).forEach(c => errors.push(`${c.id}: ref '${c.ref}' does not exist`));

// diagrams: source files, cards and the compiled bundle
const texFiles = fs.readdirSync(path.join(dir, 'diagrams')).filter(f => f.endsWith('.tex') && f !== 'preamble.tex');
const texIds = texFiles.map(f => f.slice(0, -4));
texIds.filter(id => !ids.includes(id)).forEach(id => errors.push(`diagrams/${id}.tex has no card with that id`));
DECK.filter(c => c.type !== 'prop' && !texIds.includes(c.id)).forEach(c => warnings.push(`${c.id}: no diagram (diagrams/${c.id}.tex)`));
const preamble = read('diagrams/preamble.tex');
const stale = texIds.filter(id => !DIAGRAMS[id] || DIAGRAM_SOURCES[id] !== sourceHash(preamble, read(`diagrams/${id}.tex`)));
if (stale.length) warnings.push(`diagrams.js is out of date for: ${stale.join(', ')}  →  run: node build-diagrams.js`);
for (const [id, svg] of Object.entries(DIAGRAMS)) {
  if (/(fill|stroke)\s*[:=]\s*['"]?(#|rgb)/i.test(svg)) errors.push(`${id}: compiled diagram contains a raw colour`);
}

// card text: LaTeX parses, no colour words
const warn = console.warn;
for (const c of DECK) {
  for (const k of ['name', 'def', 'formula', 'tip', 'src']) {
    if (!c[k]) continue;
    console.warn = msg => errors.push(String(msg));
    TeX.text(c[k], `${c.id}.${k}`);
    console.warn = warn;
    const m = c[k].match(/\b(colou?r(s|ed)?|red|blue|green|amber|orange|yellow|purple|pink)\b/i);
    if (m) warnings.push(`${c.id}.${k}: mentions "${m[0]}" (diagrams are black and white)`);
  }
}

warnings.forEach(w => console.log('  warning  ' + w));
errors.forEach(e => console.log('  ERROR    ' + e));
console.log(`${DECK.length} cards, ${Object.keys(DIAGRAMS).length} diagrams: ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
