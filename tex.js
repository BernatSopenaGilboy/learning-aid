/* Card text renderer. Typesets card text the way LaTeX would:
     $…$ inline math and \[…\] display math (KaTeX), \emph{} \textbf{} \textsc{},
     -- (en dash), --- (em dash), a~b (non-breaking space), ``…'' and "…" (curly quotes), ' (apostrophe), \$ (dollar).
   Plain text and the HTML already in card data (<code>, &lt;) pass through unchanged.
   A formula KaTeX cannot parse is shown as raw source and logged with the card id. */
const TeX = (() => {
  const cache = new Map();
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function math(src, displayMode, id) {
    try {
      return katex.renderToString(src, { displayMode, throwOnError: true, strict: 'ignore' });
    } catch (e) {
      console.warn(`[${id || 'card'}] LaTeX error in "${src}": ${e.message}`);
      return `<code class="tex-err" title="${esc(e.message)}">${esc(src)}</code>`;
    }
  }

  // typographic rules for prose, applied outside HTML tags only
  const prose = t => t
    .replace(/---/g, '—').replace(/--/g, '–').replace(/(\S)~(?=\S)/g, '$1 ') // "a ~ b" stays literal
    .replace(/``/g, '“').replace(/''/g, '”')
    .replace(/"([^"]*)"/g, '“$1”')
    .replace(/'/g, '’').replace(/`/g, '‘')
    .replace(/\\emph\{([^{}]*)\}/g, '<em>$1</em>')
    .replace(/\\textbf\{([^{}]*)\}/g, '<strong>$1</strong>')
    .replace(/\\textsc\{([^{}]*)\}/g, '<span class="sc">$1</span>');

  function text(src, id) {
    if (!src) return '';
    if (cache.has(src)) return cache.get(src);
    const spans = [];
    const keep = html => `\u0000${spans.push(html) - 1}\u0000`;
    let s = src.replace(/\\\$/g, '\u0001')
      .replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => keep(math(m.replace(/\u0001/g, '\\$'), true, id)))
      .replace(/\$([^$]+)\$/g, (_, m) => keep(math(m.replace(/\u0001/g, '\\$'), false, id)));
    s = s.split(/(<[^>]*>)/).map((part, i) => (i % 2 ? part : prose(part))).join('');
    s = s.replace(/\u0001/g, '$').replace(/\u0000(\d+)\u0000/g, (_, i) => spans[+i]);
    cache.set(src, s);
    return s;
  }

  return { text, math };
})();
