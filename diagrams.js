/* Tiny SVG toolkit for drawing networks. Everything lives in a 200x140 viewBox.
   Node spec:  [x, y, opts]   opts = 'a' (colour class) or {c, r, l(label), f(fill), s(stroke), sw, o(opacity), d(dashed)}
   Edge spec:  [i, j, 'class class …']  classes: hl dash ghost pos neg amb thick thin arrow both
   Colour classes: n(grey) a(blue) b(red) c(green) d(amber) e(purple) */
const D = {};
D._n = 0;

D.ring = (n, cx = 100, cy = 70, r = 48, off = -90) =>
  Array.from({ length: n }, (_, i) => {
    const a = (off + (360 * i) / n) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

// opinion value in [0,1] -> colour (blue -> orange)
D.op = v => `color-mix(in oklab, #3b82f6 ${Math.round((1 - v) * 100)}%, #f5a524)`;

D.t = (x, y, txt, cls = 'cap', anchor) =>
  `<text class="${cls}" x="${x}" y="${y}"${anchor ? ` style="text-anchor:${anchor}"` : ''}>${txt}</text>`;

D.frame = (inner, alt = 'diagram', w = 200, h = 140) =>
  `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${alt}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

D.svg = (nodes, edges = [], o = {}) => {
  const N = nodes.map(([x, y, op]) => {
    op = typeof op === 'string' ? { c: op } : op || {};
    return { x, y, c: op.c || 'n', r: op.r || 6, l: op.l, f: op.f, s: op.s, sw: op.sw, o: op.o, d: op.d };
  });
  const id = 'mk' + ++D._n;
  let s = `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="arrowhead"/></marker></defs>`;
  s += o.under || '';
  for (const [a, b, op] of edges) {
    const k = (op || '').split(' ').filter(Boolean);
    const A = N[a], B = N[b];
    let x1 = A.x, y1 = A.y, x2 = B.x, y2 = B.y;
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const arrow = k.includes('arrow') || k.includes('both');
    const both = k.includes('both');
    if (arrow) {
      x2 -= (dx / L) * (B.r + 2.5); y2 -= (dy / L) * (B.r + 2.5);
      if (both) { x1 += (dx / L) * (A.r + 2.5); y1 += (dy / L) * (A.r + 2.5); }
    }
    s += `<line class="edge ${k.join(' ')}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"${arrow ? ` marker-end="url(#${id})"` : ''}${both ? ` marker-start="url(#${id})"` : ''}/>`;
  }
  for (const n of N) {
    const st = [];
    if (n.f) st.push(`fill:${n.f}`);
    if (n.s) st.push(`stroke:${n.s};stroke-width:${n.sw || 3}`);
    if (n.o != null) st.push(`opacity:${n.o}`);
    if (n.d) st.push('fill:none;stroke-dasharray:3 3;stroke:var(--muted);stroke-width:1.5');
    s += `<circle class="node c-${n.c}" cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r}"${st.length ? ` style="${st.join(';')}"` : ''}/>`;
    if (n.l != null) s += `<text class="lbl" x="${n.x.toFixed(1)}" y="${n.y.toFixed(1)}" style="font-size:${n.r > 9 ? 9 : 7}px">${n.l}</text>`;
  }
  s += o.over || '';
  return D.frame(s, o.alt || 'network diagram', o.w, o.h);
};

// compose several sub-graphs (each {nodes, edges, dx, dy, s}) into one [nodes, edges] pair
D.union = parts => {
  const nodes = [], edges = [];
  for (const p of parts) {
    const off = nodes.length, s = p.s || 1;
    p.nodes.forEach(([x, y, op]) => {
      op = typeof op === 'string' ? { c: op } : { ...op };
      op.r = (op.r || 6) * s;
      nodes.push([x * s + (p.dx || 0), y * s + (p.dy || 0), op]);
    });
    p.edges.forEach(([a, b, k]) => edges.push([a + off, b + off, k]));
  }
  return [nodes, edges];
};

// histogram; col(i) -> colour class letter
D.bars = (vals, o = {}) => {
  const x0 = o.x0 ?? 28, y0 = o.y0 ?? 112, h = o.h ?? 80, gap = o.gap ?? 3;
  const bw = o.bw ?? Math.floor((165 - gap * vals.length) / vals.length);
  const m = Math.max(...vals);
  let s = `<line class="axis" x1="${x0 - 4}" y1="${y0}" x2="${x0 + vals.length * (bw + gap)}" y2="${y0}"/><line class="axis" x1="${x0 - 4}" y1="${y0}" x2="${x0 - 4}" y2="${y0 - h - 6}"/>`;
  vals.forEach((v, i) => {
    const bh = (v / m) * h;
    s += `<rect class="bar b-${o.col ? o.col(i) : 'a'}" x="${x0 + i * (bw + gap)}" y="${y0 - bh}" width="${bw}" height="${bh}" rx="2"/>`;
  });
  s += D.t(100, 129, o.xl || '', 'cap') + D.t(10, 60, o.yl || '', 'cap', 'middle').replace('<text', '<text transform="rotate(-90 10 60)"');
  return s;
};
