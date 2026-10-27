/* Card data. Add your own by appending to DECK.
   { id, topic, name, def, formula (optional), tip (memory hook), vis: () => svgString } */
const R = D.ring;
const T = { S: 'Structure', C: 'Centrality', T: 'Ties & communities', O: 'Sociology', Y: 'Dynamics' };
const pts = (arr, o) => arr.map(([x, y]) => [x, y, o]);
const cap = (txt, y = 134) => D.t(100, y, txt);

const DECK = [
  /* ───────────── STRUCTURE ───────────── */
  {
    id: 'degree', topic: T.S, name: 'Degree',
    def: 'The number of edges attached to a node. In directed networks, split into in-degree (edges received) and out-degree (edges sent).',
    formula: 'k_i = Σ_j A_ij',
    tip: 'Count the lines touching the dot.',
    vis: () => D.svg([[100, 66, { c: 'a', r: 11, l: 'k=5' }], ...pts(R(5, 100, 66, 46), 'n')], [1, 2, 3, 4, 5].map(i => [0, i, 'hl']), { over: cap('how many ties does this node have?') })
  },
  {
    id: 'degdist', topic: T.S, name: 'Degree distribution',
    def: 'P(k): the fraction of nodes with degree k. Real networks are usually heavy-tailed: most nodes have few ties, a few have a huge number.',
    formula: 'P(k) = N_k / N',
    tip: 'A skyline with a long right tail = hubs exist.',
    vis: () => D.svg([], [], { over: D.bars([62, 30, 16, 9, 5, 3, 2, 1, 1, 1], { xl: 'degree k', yl: 'P(k)' }) })
  },
  {
    id: 'clustering', topic: T.S, name: 'Clustering coefficient',
    def: 'The fraction of a node\'s neighbour pairs that are themselves connected: how often "friends of my friends are also my friends". Triangles ÷ possible triangles.',
    formula: 'C_i = 2 e_i / (k_i (k_i − 1))',
    tip: 'Here 2 of the 6 neighbour pairs are linked → C = 1/3.',
    vis: () => {
      const nb = R(4, 100, 66, 44, -45);
      return D.svg([[100, 66, { c: 'a', r: 9 }], ...pts(nb, 'n')],
        [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2, 'hl'], [3, 4, 'hl']], { over: cap('C = 2 / 6 = 1/3') });
    }
  },
  {
    id: 'density', topic: T.S, name: 'Density',
    def: 'The share of all possible edges that actually exist. Sparse networks (density ≪ 1) are the norm for large real-world systems.',
    formula: 'ρ = 2m / (n(n−1))',
    tip: 'Solid lines = present, faint dotted = missing. 8 of 15 → ρ ≈ 0.53.',
    vis: () => {
      const have = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 4]];
      const ghost = [[0, 2], [0, 4], [1, 3], [1, 5], [2, 4], [2, 5], [3, 5]];
      return D.svg(pts(R(6, 100, 64, 48), 'a'), [...ghost.map(e => [...e, 'ghost']), ...have], { over: cap('8 of 15 possible ties') });
    }
  },
  {
    id: 'path', topic: T.S, name: 'Shortest path (geodesic)',
    def: 'The fewest edges needed to get from one node to another. Average shortest path length and the diameter (the longest one) summarise how "far apart" a network is.',
    formula: 'ℓ = ⟨d(i,j)⟩',
    tip: 'Many routes, but only the shortest one counts.',
    vis: () => D.svg(
      [[20, 62, { c: 'a', l: 's' }], [70, 36], [125, 36], [180, 62, { c: 'a', l: 't' }], [45, 100], [100, 112], [155, 100]],
      [[0, 1, 'hl'], [1, 2, 'hl'], [2, 3, 'hl'], [0, 4], [4, 5], [5, 6], [6, 3]], { over: cap('d(s,t) = 3') })
  },
  {
    id: 'smallworld', topic: T.S, name: 'Small-world network',
    def: 'High clustering AND short average paths. A mostly local lattice with a handful of random long-range shortcuts (Watts–Strogatz) is enough to shrink the world.',
    formula: 'ℓ ~ ln N, C stays high',
    tip: 'Six degrees of separation: a few shortcuts do all the work.',
    vis: () => {
      const e = [];
      for (let i = 0; i < 12; i++) { e.push([i, (i + 1) % 12]); e.push([i, (i + 2) % 12]); }
      e.push([0, 6, 'hl dash'], [3, 9, 'hl dash']);
      return D.svg(pts(R(12, 100, 64, 48), 'a'), e, { over: cap('local ties + few shortcuts') });
    }
  },
  {
    id: 'scalefree', topic: T.S, name: 'Scale-free network',
    def: 'A network whose degree distribution follows a power law: no typical degree, a few huge hubs, many tiny nodes. Often explained by preferential attachment.',
    formula: 'P(k) ∝ k^(−γ), usually 2 < γ < 3',
    tip: 'Hubs and spokes. Remove a hub and things break.',
    vis: () => {
      const l1 = R(8, 58, 66, 40, 200), l2 = R(5, 152, 66, 30, -90);
      const nodes = [[58, 66, { c: 'a', r: 12 }], [150, 66, { c: 'a', r: 9 }], ...pts(l1, { r: 4.5 }), ...pts(l2, { r: 4.5 })];
      const e = [[0, 1, 'hl']];
      for (let i = 0; i < 8; i++) e.push([0, 2 + i]);
      for (let i = 0; i < 5; i++) e.push([1, 10 + i]);
      return D.svg(nodes, e, { over: cap('few hubs, many small nodes') });
    }
  },
  {
    id: 'er', topic: T.S, name: 'Random graph (Erdős–Rényi)',
    def: 'The null model: every pair of nodes is linked independently with probability p. Degrees are Poisson-distributed, so there are no hubs and clustering is low.',
    formula: '⟨k⟩ = p (n−1)',
    tip: 'Roll a die for every pair. Compare real networks against this.',
    vis: () => D.svg(pts(R(10, 100, 64, 48), 'n'),
      [[0, 3], [0, 7], [1, 4], [1, 8], [2, 5], [2, 9], [3, 6], [4, 9], [5, 8], [6, 0], [7, 2], [1, 6], [3, 8]], { over: cap('every pair linked with probability p') })
  },
  {
    id: 'assort', topic: T.S, name: 'Assortativity',
    def: 'The tendency of nodes to connect to similar nodes, often measured by degree. Assortative: hubs link to hubs (typical of social networks). Disassortative: hubs link to small nodes (typical of technological networks).',
    formula: 'r = Pearson corr. of degrees at the two ends of an edge',
    tip: 'Big with big, small with small → r > 0.',
    vis: () => D.svg(
      [[40, 38, { c: 'a', r: 10 }], [88, 28, { c: 'a', r: 10 }], [66, 78, { c: 'a', r: 10 }], [125, 105, { r: 5 }], [152, 82, { r: 5 }], [178, 112, { r: 5 }], [168, 46, { r: 5 }], [128, 52, { r: 5 }]],
      [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [4, 6], [6, 7], [3, 5]], { over: cap('like links to like (r > 0)') })
  },
  {
    id: 'bipartite', topic: T.S, name: 'Bipartite network',
    def: 'Nodes come in two types and edges only join different types. Examples: people–organisations, authors–papers. Project it to get one-mode networks (co-membership).',
    tip: 'Two columns; no edges inside a column.',
    vis: () => D.svg(
      [[55, 22, 'a'], [55, 55, 'a'], [55, 88, 'a'], [55, 121, 'a'], [145, 38, 'b'], [145, 71, 'b'], [145, 104, 'b']],
      [[0, 4], [0, 5], [1, 4], [2, 5], [2, 6], [3, 6], [1, 6]], { over: D.t(55, 12, 'type A') + D.t(145, 12, 'type B') })
  },
  {
    id: 'components', topic: T.S, name: 'Connected components & giant component',
    def: 'A component is a set of nodes all reachable from each other. Many real networks have one giant component containing most nodes, plus small islands and isolates.',
    tip: 'If you can walk between two nodes, they share a component.',
    vis: () => D.svg(
      [[30, 40, 'c'], [66, 26, 'c'], [60, 72, 'c'], [102, 52, 'c'], [96, 98, 'c'], [135, 74, 'c'], [165, 28, 'd'], [184, 58, 'd'], [160, 112, 'b']],
      [[0, 1, 'hl'], [1, 2, 'hl'], [0, 2, 'hl'], [1, 3, 'hl'], [3, 4, 'hl'], [3, 5, 'hl'], [2, 4, 'hl'], [6, 7]], { over: cap('giant component (green) + islands') })
  },
  {
    id: 'reciprocity', topic: T.S, name: 'Directed ties & reciprocity',
    def: 'In a directed network edges have a direction (follows, cites, trusts). Reciprocity is the fraction of edges that are returned: A→B and B→A.',
    formula: 'r = (# mutual edges) / (# edges)',
    tip: 'Double-headed arrow = mutual tie.',
    vis: () => D.svg([[45, 42, { c: 'a', l: 'A' , r: 10 }], [155, 42, { c: 'a', l: 'B', r: 10 }], [100, 108, { c: 'a', l: 'C', r: 10 }]],
      [[0, 1, 'both hl'], [1, 2, 'arrow'], [2, 0, 'arrow']], { over: D.t(100, 30, 'mutual') })
  },
  {
    id: 'clique', topic: T.S, name: 'Clique',
    def: 'A set of nodes in which every pair is connected: a maximally cohesive group. Cliques are the strictest definition of a tight subgroup.',
    tip: 'K5: five people who all know each other.',
    vis: () => {
      const e = [];
      for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) e.push([i, j, 'pos']);
      e.push([2, 5], [3, 6], [5, 7]);
      return D.svg([...pts(R(5, 65, 68, 38), 'c'), [140, 36, 'n'], [165, 100, 'n'], [180, 56, 'n']], e, { over: cap('every pair connected') });
    }
  },
  {
    id: 'bridge', topic: T.S, name: 'Bridge',
    def: 'An edge whose removal disconnects the network (or increases the number of components). It carries all traffic between the two sides.',
    tip: 'The single road between two towns.',
    vis: () => D.svg([[30, 45, 'a'], [30, 95, 'a'], [72, 70, 'a'], [128, 70, 'b'], [170, 45, 'b'], [170, 95, 'b']],
      [[0, 1], [0, 2], [1, 2], [3, 4], [3, 5], [4, 5], [2, 3, 'hl']], { over: cap('cut this edge → two components') })
  },
  {
    id: 'coreperiph', topic: T.S, name: 'Core–periphery structure',
    def: 'A dense, well-connected core surrounded by a sparsely connected periphery whose members mostly link to the core, not to each other.',
    tip: 'Capital city and its suburbs.',
    vis: () => {
      const core = R(5, 100, 66, 20), per = R(8, 100, 66, 56);
      const e = [];
      for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) e.push([i, j]);
      for (let i = 0; i < 8; i++) e.push([5 + i, Math.round(i * 5 / 8) % 5, 'thin']);
      return D.svg([...pts(core, 'a'), ...pts(per, { r: 4.5 })], e);
    }
  },
  {
    id: 'prefattach', topic: T.S, name: 'Preferential attachment',
    def: 'Growth rule (Barabási–Albert): new nodes link to existing nodes with probability proportional to their degree. "The rich get richer" produces hubs and power laws.',
    formula: 'Π(k_i) = k_i / Σ_j k_j',
    tip: 'Thick dashed arrow = most likely landing spot.',
    vis: () => {
      const lv = R(6, 125, 66, 40, -90);
      return D.svg([[24, 66, { c: 'd', l: 'new' }], [125, 66, { c: 'a', r: 12 }], ...pts(lv, { r: 4.5 })],
        [[0, 1, 'hl dash thick'], [0, 4, 'dash thin'], [0, 7, 'dash thin'], ...lv.map((_, i) => [1, 2 + i])], { over: cap('new node picks popular nodes') });
    }
  },

  /* ───────────── CENTRALITY ───────────── */
  {
    id: 'degcent', topic: T.C, name: 'Degree centrality',
    def: 'The simplest importance score: how many direct ties a node has (optionally divided by n−1). It measures local popularity or exposure.',
    formula: 'C_D(i) = k_i / (n−1)',
    tip: 'Bigger node = more ties.',
    vis: () => {
      const ring = R(5, 100, 66, 46);
      return D.svg([[100, 66, { c: 'a', r: 12 }], [ring[0][0], ring[0][1], { r: 5 }], [ring[1][0], ring[1][1], { r: 7 }], [ring[2][0], ring[2][1], { r: 5 }], [ring[3][0], ring[3][1], { r: 5 }], [ring[4][0], ring[4][1], { r: 7 }]],
        [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [2, 5]], { over: cap('size ∝ number of ties') });
    }
  },
  {
    id: 'betw', topic: T.C, name: 'Betweenness centrality',
    def: 'How often a node lies on the shortest paths between other pairs. High betweenness = broker or gatekeeper who controls flow between groups.',
    formula: 'C_B(v) = Σ_{s≠v≠t} σ_st(v) / σ_st',
    tip: 'The toll booth every shortest route passes through.',
    vis: () => D.svg([[25, 45, 'n'], [25, 95, 'n'], [66, 70, { c: 'd', r: 8 }], [100, 70, { c: 'a', r: 11 }], [134, 70, { c: 'd', r: 8 }], [175, 45, 'n'], [175, 95, 'n']],
      [[0, 1], [0, 2], [1, 2], [2, 3, 'hl'], [3, 4, 'hl'], [4, 5], [4, 6], [5, 6]], { over: cap('lies on many shortest paths') })
  },
  {
    id: 'close', topic: T.C, name: 'Closeness centrality',
    def: 'The inverse of the average distance from a node to every other node. A close node can reach (or inform) everyone in few steps.',
    formula: 'C_C(v) = (n−1) / Σ_u d(v,u)',
    tip: 'Dashed rings = distance 1, 2 from the centre.',
    vis: () => D.svg([[100, 66, { c: 'a', r: 10 }], [100, 38, 'n'], [128, 66, 'n'], [100, 94, 'n'], [72, 66, 'n'], [156, 66, 'n']],
      [[0, 1], [0, 2], [0, 3], [0, 4], [2, 5]],
      { under: '<circle class="ring" cx="100" cy="66" r="28"/><circle class="ring" cx="100" cy="66" r="56"/>', over: cap('short average distance to everyone') })
  },
  {
    id: 'eigen', topic: T.C, name: 'Eigenvector centrality',
    def: 'A node is important if it is connected to important nodes. Scores are the leading eigenvector of the adjacency matrix; quality of ties beats quantity.',
    formula: 'λ x_i = Σ_j A_ij x_j',
    tip: 'Y has fewer friends than X, but better-connected ones.',
    vis: () => {
      const lx = R(4, 38, 66, 28, 45);
      return D.svg([[38, 66, { c: 'd', r: 9, l: 'X' }], ...pts(lx, { r: 4.5 }),
        [140, 66, { c: 'a', r: 11, l: 'Y' }], [140, 30, { c: 'a', r: 8 }], [140, 102, { c: 'a', r: 8 }],
        [112, 14, { r: 4 }], [168, 14, { r: 4 }], [112, 118, { r: 4 }], [168, 118, { r: 4 }]],
        [[0, 1], [0, 2], [0, 3], [0, 4], [5, 6, 'hl'], [5, 7, 'hl'], [6, 8], [6, 9], [7, 10], [7, 11]], { over: cap('few ties, but to well-connected nodes', 138) });
    }
  },
  {
    id: 'pagerank', topic: T.C, name: 'PageRank',
    def: 'Eigenvector-style centrality for directed networks: a random surfer follows links and occasionally teleports. Rank flows along edges and is split among out-links.',
    formula: 'PR(i) = (1−d)/n + d Σ_{j→i} PR(j)/k_j^out',
    tip: 'A vote from an important page counts more.',
    vis: () => D.svg([[100, 66, { c: 'a', r: 13 }], [155, 100, { c: 'a', r: 9 }], [38, 26, 'n'], [45, 100, 'n'], [38, 66, 'n'], [150, 26, 'n']],
      [[2, 0, 'arrow'], [3, 0, 'arrow'], [4, 0, 'arrow'], [5, 0, 'arrow'], [0, 1, 'arrow hl'], [1, 3, 'arrow']], { over: cap('importance flows along links') })
  },

  /* ───────────── TIES & COMMUNITIES ───────────── */
  {
    id: 'community', topic: T.T, name: 'Community structure',
    def: 'Groups of nodes that are densely connected inside and sparsely connected to the rest. Communities often map onto real social groups, topics or functions.',
    tip: 'Colour = community. Few lines cross colours.',
    vis: () => {
      const cl = [[45, 42, 'a'], [155, 42, 'b'], [100, 104, 'c']];
      const nodes = [], e = [];
      cl.forEach(([cx, cy, c], k) => {
        R(4, cx, cy, 20).forEach(p => nodes.push([p[0], p[1], c]));
        const o = k * 4;
        e.push([o, o + 1], [o + 1, o + 2], [o + 2, o + 3], [o + 3, o], [o, o + 2]);
      });
      e.push([1, 7, 'thin'], [5, 10, 'thin'], [11, 3, 'thin']);
      return D.svg(nodes, e, { over: cap('dense inside, sparse between', 138) });
    }
  },
  {
    id: 'modularity', topic: T.T, name: 'Modularity',
    def: 'Quality score of a partition: the fraction of edges inside groups minus what you would expect if edges were placed at random with the same degrees. High Q = real community structure.',
    formula: 'Q = 1/(2m) Σ_ij [A_ij − k_i k_j /(2m)] δ(c_i, c_j)',
    tip: 'Same graph, two colourings: only the left one earns a high Q.',
    vis: () => {
      const mk = cols => {
        const g1 = R(4, 25, 35, 15), g2 = R(4, 75, 35, 15), nodes = [...g1, ...g2].map((p, i) => [p[0], p[1], cols[i]]);
        const e = [];
        [0, 4].forEach(o => e.push([o, o + 1], [o + 1, o + 2], [o + 2, o + 3], [o + 3, o], [o, o + 2]));
        e.push([1, 7]);
        return { nodes, edges: e, s: 1.0 };
      };
      const [n, e] = D.union([{ ...mk(['a', 'a', 'a', 'a', 'b', 'b', 'b', 'b']), dx: 2, dy: 12 }, { ...mk(['a', 'b', 'a', 'b', 'b', 'a', 'b', 'a']), dx: 102, dy: 12 }]);
      return D.svg(n, e, { over: D.t(52, 108, 'good split · high Q') + D.t(154, 108, 'random split · Q≈0') + '<line class="axis" x1="100" y1="12" x2="100" y2="120"/>' });
    }
  },
  {
    id: 'homophily', topic: T.T, name: 'Homophily',
    def: '"Birds of a feather flock together": ties form more often between similar people (age, race, beliefs, education). It is one of the most robust patterns in social networks.',
    tip: 'Follow a colour: nearly every line joins like to like.',
    vis: () => {
      const col = ['a', 'b', 'a', 'a', 'b', 'b', 'a', 'b', 'b', 'a'];
      return D.svg(R(10, 100, 64, 48).map((p, i) => [p[0], p[1], { c: col[i], r: 7 }]),
        [[0, 2], [2, 3], [3, 6], [6, 9], [9, 0], [2, 6], [1, 4], [4, 5], [5, 7], [7, 8], [8, 1], [4, 8], [3, 4, 'thin ghost']], { over: cap('ties mostly join similar nodes') });
    }
  },
  {
    id: 'triadic', topic: T.T, name: 'Triadic closure',
    def: 'If A knows B and A knows C, then B and C are likely to become acquainted. It is the main reason social networks have high clustering.',
    tip: 'Introduce your two friends to each other.',
    vis: () => D.svg([[100, 28, { c: 'a', l: 'A', r: 10 }], [48, 98, { c: 'n', l: 'B', r: 10 }], [152, 98, { c: 'n', l: 'C', r: 10 }]],
      [[0, 1], [0, 2], [1, 2, 'hl dash']], { over: D.t(100, 106, '?') + cap('friends of friends become friends') })
  },
  {
    id: 'holes', topic: T.T, name: 'Structural holes (Burt)',
    def: 'Gaps between people who are not directly connected. A broker who spans a hole gets non-redundant information and control. Redundant contacts (all linked to each other) add little.',
    formula: 'Constraint ↓ when your contacts are unconnected',
    tip: 'Right ego = brokerage advantage. Left ego = redundant echo.',
    vis: () => {
      const l = R(3, 44, 66, 34, -90), r = R(3, 156, 66, 34, -90);
      return D.svg([[44, 66, { c: 'a', r: 8 }], ...pts(l, 'n'), [156, 66, { c: 'd', r: 8 }], ...pts(r, 'n')],
        [[0, 1], [0, 2], [0, 3], [1, 2, 'thin'], [2, 3, 'thin'], [3, 1, 'thin'], [4, 5, 'hl'], [4, 6, 'hl'], [4, 7, 'hl']],
        { over: '<line class="axis" x1="100" y1="12" x2="100" y2="124"/>' + D.t(44, 128, 'redundant') + D.t(156, 128, 'holes → broker') });
    }
  },
  {
    id: 'weak', topic: T.T, name: 'Strength of weak ties (Granovetter)',
    def: 'Acquaintances (weak ties) often bridge otherwise separate clusters, so they bring novel information such as job leads. Strong ties are redundant because friends know the same things.',
    tip: 'Thick = strong, thin dashed = weak. The weak one is the lifeline.',
    vis: () => D.svg([[28, 46, 'a'], [28, 100, 'a'], [70, 73, 'a'], [130, 73, 'b'], [172, 46, 'b'], [172, 100, 'b']],
      [[0, 1, 'thick'], [0, 2, 'thick'], [1, 2, 'thick'], [3, 4, 'thick'], [3, 5, 'thick'], [4, 5, 'thick'], [2, 3, 'hl dash thin']], { over: cap('weak tie = bridge to new information') })
  },
  {
    id: 'ego', topic: T.T, name: 'Ego network',
    def: 'One focal person (ego), their direct contacts (alters), and the ties among those alters. The standard unit of analysis in survey-based social network research.',
    tip: 'Zoom in on one person and ask "who knows whom around me?"',
    vis: () => D.svg([[100, 64, { c: 'a', r: 10, l: 'ego' }], ...pts(R(6, 100, 64, 48, -60), 'n')],
      [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 2, 'hl'], [3, 4, 'hl'], [4, 5, 'hl']], { over: cap('ego + alters + ties among alters') })
  },

  /* ───────────── SOCIOLOGY ───────────── */
  {
    id: 'capital', topic: T.O, name: 'Social capital: bonding vs bridging',
    def: 'Resources accessed through ties. Bonding capital (dense, within-group, Coleman) gives trust and support; bridging capital (across groups, Burt/Putnam) gives access to diverse information.',
    tip: 'Green = bonding, amber = bridging.',
    vis: () => D.svg([[100, 66, { c: 'a', r: 10 }], [48, 34, 'c'], [30, 78, 'c'], [60, 108, 'c'], [152, 38, 'd'], [160, 100, 'd'], [185, 20, 'n'], [186, 66, 'n'], [186, 118, 'n']],
      [[0, 1, 'pos'], [0, 2, 'pos'], [0, 3, 'pos'], [1, 2, 'pos'], [2, 3, 'pos'], [1, 3, 'pos'], [0, 4, 'amb thick'], [0, 5, 'amb thick'], [4, 6], [4, 7], [5, 8]],
      { over: D.t(46, 132, 'bonding') + D.t(150, 132, 'bridging') })
  },
  {
    id: 'structeq', topic: T.O, name: 'Structural equivalence',
    def: 'Two actors are structurally equivalent if they have the same ties to the same others, even if they are not connected to each other. Used to find social roles (two managers with the same reports).',
    tip: 'Swap u and v and nothing changes.',
    vis: () => D.svg([[36, 66, { c: 'd', l: 'u', r: 10 }], [164, 66, { c: 'd', l: 'v', r: 10 }], [100, 22, 'n'], [100, 66, 'n'], [100, 110, 'n']],
      [[0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4]], { over: cap('same neighbours ⇒ same position', 138) })
  },
  {
    id: 'balance', topic: T.O, name: 'Structural balance (Heider)',
    def: 'A signed triangle is balanced if the product of its signs is positive: a friend of my friend is my friend, and an enemy of my enemy is my friend. Unbalanced triads create pressure to change.',
    formula: 'balanced ⇔ s_ij · s_jk · s_ki > 0',
    tip: 'Green solid = +, red dashed = −. Count the minuses: even = balanced.',
    vis: () => {
      const tri = (cx, signs) => ({ nodes: [[cx, 28, 'a'], [cx - 24, 84, 'a'], [cx + 24, 84, 'a']], edges: [[0, 1, signs[0]], [1, 2, signs[1]], [2, 0, signs[2]]] });
      const [n, e] = D.union([tri(36, ['pos', 'pos', 'pos']), tri(100, ['pos', 'neg', 'neg']), tri(164, ['pos', 'pos', 'neg'])]);
      return D.svg(n, e, { over: D.t(36, 112, '+ + +') + D.t(100, 112, '+ − −') + D.t(164, 112, '+ + −') + D.t(36, 128, 'balanced', 'cap ok') + D.t(100, 128, 'balanced', 'cap ok') + D.t(164, 128, 'unbalanced', 'cap bad') });
    }
  },
  {
    id: 'prestige', topic: T.O, name: 'Prestige',
    def: 'Status measured by the ties a person receives rather than sends (in-degree): being chosen, cited or deferred to. Distinguishes popularity from mere activity.',
    formula: 'P_D(i) = k_i^in / (n−1)',
    tip: 'All arrows point at the prestigious actor.',
    vis: () => D.svg([[100, 66, { c: 'a', r: 14 }], ...pts(R(5, 100, 66, 52), { r: 5 })], [1, 2, 3, 4, 5].map(i => [i, 0, 'arrow']), { over: cap('chosen by many') })
  },
  {
    id: 'echo', topic: T.O, name: 'Echo chamber',
    def: 'A group where people mostly hear and repeat views like their own, with little exposure to the other side. Homophily + sharing within a dense cluster amplify and harden opinions.',
    tip: 'Messages circulate inside; the cross-link is missing.',
    vis: () => {
      const A = R(5, 50, 66, 30), B = R(5, 150, 66, 30), e = [];
      for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) { e.push([i, j]); e.push([5 + i, 5 + j]); }
      return D.svg([...pts(A, { c: 'a', r: 7 }), ...pts(B, { c: 'b', r: 7 })], e, { over: D.t(100, 70, '✕', 'x') + cap('no cross-cutting exposure') });
    }
  },
  {
    id: 'filter', topic: T.O, name: 'Filter bubble',
    def: 'Algorithmic personalisation shows you content similar to what you already like, so the information you see is a narrow slice of the network. (Pariser)',
    tip: 'The faded nodes exist, but you never see them.',
    vis: () => {
      const inner = R(4, 100, 66, 26, -45), outer = R(7, 100, 66, 56, -80);
      return D.svg([[100, 66, { c: 'a', r: 9 }], ...pts(inner, { c: 'a', r: 6 }), ...pts(outer, { c: 'b', r: 6, o: 0.3 })],
        [[0, 1], [0, 2], [0, 3], [0, 4], ...outer.map((_, i) => [0, 5 + i, 'ghost'])], { under: '<circle class="ring solid" cx="100" cy="66" r="38"/>', over: cap('personalised feed = bubble', 138) });
    }
  },
  {
    id: 'circles', topic: T.O, name: 'Intersecting social circles (Simmel)',
    def: 'Individuality arises from the unique intersection of the groups someone belongs to (family, work, friends). Overlapping memberships also connect otherwise separate circles.',
    tip: 'You are the point where your circles overlap.',
    vis: () => D.svg([[100, 72, { c: 'a', r: 7, l: '' }]], [], {
      under: '<circle class="venn v1" cx="72" cy="58" r="40"/><circle class="venn v2" cx="128" cy="58" r="40"/><circle class="venn v3" cx="100" cy="94" r="40"/>',
      over: D.t(52, 44, 'family') + D.t(148, 44, 'work') + D.t(100, 128, 'friends')
    })
  },
  {
    id: 'selinf', topic: T.O, name: 'Selection vs influence',
    def: 'Why do connected people look alike? Selection: similar people form ties (homophily). Influence: ties make people converge. Cross-sectional data cannot tell them apart; longitudinal models can.',
    tip: 'Top: similarity → tie. Bottom: tie → similarity.',
    vis: () => D.svg([[24, 34, 'a'], [76, 34, 'a'], [124, 34, 'a'], [176, 34, 'a'], [24, 94, 'a'], [76, 94, 'b'], [124, 94, 'a'], [176, 94, 'a']],
      [[2, 3, 'hl'], [4, 5], [6, 7, 'hl']],
      { over: D.t(100, 38, '→', 'big') + D.t(100, 98, '→', 'big') + D.t(100, 56, 'similar nodes tie up') + D.t(100, 118, 'tied nodes converge') })
  },
  {
    id: 'constraint', topic: T.O, name: 'Constraint (in a belief system)',
    def: 'Converse (1964) defines a belief system as a configuration of ideas and attitudes whose elements are bound together by some form of constraint or functional interdependence. Constraint is the predictability of one attitude from another: in a high-constraint system, changing one central view shifts related views; in a low-constraint system the others stay put.',
    tip: 'Constraint = "if you hold this, you will also hold that."'
  },
  {
    id: 'socconstraint', topic: T.O, name: 'Social constraint (theories of)',
    def: 'Attitudes cohere not because individuals derive them from shared principles, but because belief systems are socially packaged and transmitted. Coherent systems are the creative synthesis of a tiny elite, then spread as bundles that consumers come to see as natural wholes. The link between attitudes may be social rather than logical. Classic sources: Campbell et al. (1960), Converse (1964).',
    tip: 'Elites write the package; the public buys the bundle.'
  },
  {
    id: 'idheuristic', topic: T.O, name: 'Political identity as a heuristic',
    def: 'Under social-constraint theories, people use a political identity (party, ideology) as a cue to acquire further beliefs cheaply: they learn what "people like me" or their side\'s leaders (politicians, journalists, activists) endorse and adopt it, instead of deriving positions from first principles. Identity is the channel through which elite information reaches the mass public.',
    tip: 'Identity first, positions follow.'
  },
  {
    id: 'schelling', topic: T.O, name: 'Schelling segregation',
    def: 'Even mild preferences (e.g. "at least 1/3 of my neighbours like me") produce strongly segregated neighbourhoods. Micro-motives do not equal macro-behaviour.',
    tip: 'Outlined cells are unhappy and would move.',
    vis: () => {
      const rows = ['aabbab.ab.', 'ab.aabbbba', 'bbaaa.abab', 'a.bbabaaab', 'abab.aabbb'];
      const g = rows.map(r => r.split('')), H = g.length, W = g[0].length;
      let s = '';
      g.forEach((row, y) => row.forEach((v, x) => {
        if (v === '.') { s += `<rect class="cell empty" x="${22 + x * 15.6}" y="${14 + y * 15.6}" width="14" height="14" rx="2"/>`; return; }
        let same = 0, tot = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const o = (g[y + dy] || [])[x + dx];
          if (o && o !== '.') { tot++; if (o === v) same++; }
        }
        const unhappy = tot > 0 && same / tot < 0.5;
        s += `<rect class="cell c-${v === 'a' ? 'a' : 'b'}${unhappy ? ' unhappy' : ''}" x="${22 + x * 15.6}" y="${14 + y * 15.6}" width="14" height="14" rx="2"/>`;
      }));
      return D.frame(s + cap('outlined = unhappy (< ½ alike)', 124), 'Schelling grid');
    }
  },

  /* ───────────── DYNAMICS ───────────── */
  {
    id: 'simplecont', topic: T.Y, name: 'Simple contagion',
    def: 'Spreading where a single contact can transmit (diseases, rumours, news). Each exposure infects with probability β, so spread is fast along weak ties and shortcuts.',
    formula: 'P(infect) = 1 − (1−β)^m, m = infected neighbours',
    tip: 'One red neighbour is enough.',
    vis: () => D.svg([[28, 66, 'b'], [75, 34, 'b'], [75, 100, 'n'], [125, 34, 'n'], [125, 100, 'n'], [172, 66, 'n']],
      [[0, 1], [0, 2, 'arrow hl dash'], [1, 3, 'arrow hl dash'], [2, 4], [3, 5], [4, 5]], { over: cap('one exposure can infect') })
  },
  {
    id: 'complexcont', topic: T.Y, name: 'Complex contagion / threshold model',
    def: 'Adoption needs reinforcement: you adopt only if enough neighbours already have (a threshold θ). Typical for costly or risky behaviours (protests, norms). Needs clustered, redundant ties rather than long bridges.',
    formula: 'adopt if (active neighbours / k_i) ≥ θ_i',
    tip: 'Two red neighbours → the middle node flips (θ = 2).',
    vis: () => D.svg([[100, 66, { c: 'n', r: 11, l: '?' }], [58, 32, 'b'], [142, 32, 'b'], [58, 100, 'n'], [142, 100, 'n']],
      [[1, 0, 'arrow hl'], [2, 0, 'arrow hl'], [3, 0], [4, 0]], { over: cap('adopts if ≥ 2 neighbours are active') })
  },
  {
    id: 'degroot', topic: T.Y, name: 'DeGroot model',
    def: 'Each agent repeatedly replaces their opinion by a weighted average of their neighbours\' opinions. On a connected, aperiodic network opinions converge to consensus.',
    formula: 'x(t+1) = W x(t)',
    tip: 'Colours blur together until everyone matches.',
    vis: () => {
      const e = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2]];
      const v0 = [0.05, 0.9, 0.3, 0.7, 0.5], v1 = [0.47, 0.47, 0.47, 0.47, 0.47];
      const mk = (v, cx) => ({ nodes: R(5, cx, 62, 32).map((p, i) => [p[0], p[1], { r: 9, f: D.op(v[i]), l: v[i].toFixed(1) }]), edges: e });
      const [n, ed] = D.union([mk(v0, 50), mk(v1, 150)]);
      return D.svg(n, ed, { over: D.t(100, 66, '→', 'big') + D.t(50, 112, 'start') + D.t(150, 112, 'consensus') });
    }
  },
  {
    id: 'fj', topic: T.Y, name: 'Friedkin–Johnsen model',
    def: 'DeGroot with stubbornness: each agent partly clings to their innate opinion x(0) and partly averages with neighbours. Opinions settle but do not reach consensus, so disagreement persists.',
    formula: 'x(t+1) = ΛW x(t) + (I−Λ) x(0)',
    tip: 'Inner fill = current opinion, ring = initial opinion.',
    vis: () => {
      const v0 = [0.05, 0.9, 0.3, 0.7, 0.5], v1 = [0.2, 0.75, 0.35, 0.6, 0.5];
      const e = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2]];
      return D.svg(R(5, 100, 62, 40).map((p, i) => [p[0], p[1], { r: 11, f: D.op(v1[i]), s: D.op(v0[i]), sw: 3.5 }]), e, { over: cap('ring = own belief, fill = after talking', 132) });
    }
  },
  {
    id: 'bc', topic: T.Y, name: 'Bounded confidence (Deffuant / Hegselmann–Krause)',
    def: 'Agents only listen to others whose opinion is within a confidence bound ε. Small ε gives several stable opinion clusters (fragmentation); large ε gives consensus.',
    formula: '|x_i − x_j| < ε → x_i moves toward x_j',
    tip: 'Only the dots inside the shaded band get heard.',
    vis: () => {
      const xs = [0.08, 0.15, 0.3, 0.42, 0.5, 0.58, 0.8, 0.92], X = v => 20 + 160 * v;
      const sel = 3, eps = 0.17;
      return D.svg(xs.map((v, i) => [X(v), 76, i === sel ? { c: 'd', r: 8 } : Math.abs(v - xs[sel]) < eps ? { c: 'a', r: 6 } : { r: 5 }]), [], {
        under: `<rect class="band" x="${X(xs[sel] - eps)}" y="40" width="${320 * eps}" height="70" rx="6"/><line class="axis" x1="16" y1="76" x2="184" y2="76"/>`,
        over: D.t(X(xs[sel]), 34, 'ε') + D.t(20, 96, '0', 'cap') + D.t(180, 96, '1', 'cap') + D.t(100, 126, 'opinion axis · listens only inside ±ε')
      });
    }
  },
  {
    id: 'voter', topic: T.Y, name: 'Voter model',
    def: 'At each step a random agent copies the opinion of a random neighbour. Simple, noisy dynamics that eventually reach consensus; time to consensus depends on network structure.',
    formula: 'x_i(t+1) = x_j(t), j random neighbour of i',
    tip: 'Imitate someone nearby, nothing more.',
    vis: () => D.svg([[100, 66, { c: 'a', r: 12, l: '?' }], ...R(4, 100, 66, 50, -45).map((p, i) => [p[0], p[1], { c: i < 3 ? 'b' : 'a', r: 8 }])],
      [[1, 0, 'arrow hl thick'], [2, 0], [3, 0], [4, 0]], { over: cap('copy a random neighbour') })
  },
  {
    id: 'polar', topic: T.Y, name: 'Opinion polarization',
    def: 'The opinion distribution splits into two opposed camps with an empty middle. Network drivers: homophily, echo chambers, repulsive influence, algorithmic curation.',
    tip: 'Bimodal histogram = polarised; single peak = consensus.',
    vis: () => D.svg([], [], { over: D.bars([3, 10, 16, 9, 2, 1, 2, 9, 17, 12, 4], { col: i => (i < 5 ? 'a' : i > 5 ? 'b' : 'n'), xl: 'opinion  −1 … +1', yl: 'agents' }) })
  },
  {
    id: 'sir', topic: T.Y, name: 'SIR epidemic model',
    def: 'Compartment model: Susceptible → Infected → Recovered. On networks the epidemic threshold shrinks with degree heterogeneity: in scale-free networks even weak diseases can spread.',
    formula: 'dS/dt = −βSI,  dI/dt = βSI − γI,  R₀ = β/γ',
    tip: 'S (blue) → I (red) → R (green).',
    vis: () => D.svg([[35, 62, { c: 'a', r: 17, l: 'S' }], [100, 62, { c: 'b', r: 17, l: 'I' }], [165, 62, { c: 'c', r: 17, l: 'R' }]],
      [[0, 1, 'arrow hl'], [1, 2, 'arrow hl']], { over: D.t(67, 48, 'β') + D.t(133, 48, 'γ') + cap('infection rate β · recovery rate γ', 118) })
  },
  {
    id: 'robust', topic: T.Y, name: 'Robustness & targeted attack',
    def: 'Scale-free networks survive random node failure but shatter when hubs are removed. Percolation theory predicts the critical fraction of nodes whose removal destroys the giant component.',
    tip: 'Delete the hub and the star falls into pieces.',
    vis: () => {
      const mk = gone => {
        const ring = R(6, 100, 70, 48);
        const e = [[1, 2], [3, 4], [5, 6]];
        for (let i = 1; i <= 6; i++) e.push([0, i, gone ? 'ghost' : '']);
        return { nodes: [[100, 70, gone ? { d: 1, r: 12 } : { c: 'a', r: 12 }], ...pts(ring, 'n')], edges: e, s: 0.52, dx: gone ? 98 : -2, dy: 30 };
      };
      const [n, e] = D.union([mk(false), mk(true)]);
      return D.svg(n, e, { over: D.t(50, 112, 'intact') + D.t(150, 112, 'hub removed → fragments') });
    }
  },
  {
    id: 'hebbian', topic: T.Y, name: 'Hebbian (associative) learning',
    def: 'A connection between two units strengthens when both are active at the same time (Hebb 1949). Things that co-occur become linked, so activating one later tends to activate the other (associative recall, pattern completion, as in Hopfield networks). The rule is local and unsupervised: no teacher or error signal. Pure Hebb lets weights grow without bound, so models add decay or normalisation (e.g. Oja\'s rule).',
    formula: 'Δw_ij = η x_i x_j',
    tip: 'Cells that fire together wire together.',
    vis: () => {
      const mk = (cls, dx) => ({ nodes: [[60, 66, { c: 'd', r: 12 }], [140, 66, { c: 'd', r: 12 }]], edges: [[0, 1, cls]], s: 0.5, dx, dy: 33 });
      const [n, e] = D.union([mk('thin dash', 0), mk('thick hl', 100)]);
      return D.svg(n, e, { over: D.t(50, 96, 'before') + D.t(150, 96, 'after') + D.t(100, 70, '→', 'big') });
    }
  }
];
