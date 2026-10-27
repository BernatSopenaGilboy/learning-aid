/* Card data. Add your own by appending to DECK.
   { id, topic, name, def, formula (optional), tip (memory hook) }. Diagram: diagrams/<id>.tex (TikZ). */
const T = { S: 'Structure', C: 'Centrality', T: 'Ties & communities', O: 'Sociology', Y: 'Dynamics' };

const DECK = [
  /* ───────────── STRUCTURE ───────────── */
  {
    id: 'degree', topic: T.S, name: 'Degree',
    def: 'The number of edges attached to a node. In directed networks, split into in-degree (edges received) and out-degree (edges sent).',
    formula: 'k_i = Σ_j A_ij',
    tip: 'Count the lines touching the dot.'
  },
  {
    id: 'degdist', topic: T.S, name: 'Degree distribution',
    def: 'P(k): the fraction of nodes with degree k. Real networks are usually heavy-tailed: most nodes have few ties, a few have a huge number.',
    formula: 'P(k) = N_k / N',
    tip: 'A skyline with a long right tail = hubs exist.'
  },
  {
    id: 'clustering', topic: T.S, name: 'Clustering coefficient',
    def: 'The fraction of a node\'s neighbour pairs that are themselves connected: how often "friends of my friends are also my friends". Triangles ÷ possible triangles.',
    formula: 'C_i = 2 e_i / (k_i (k_i − 1))',
    tip: 'Here 2 of the 6 neighbour pairs are linked → C = 1/3.'
  },
  {
    id: 'density', topic: T.S, name: 'Density',
    def: 'The share of all possible edges that actually exist. Sparse networks (density ≪ 1) are the norm for large real-world systems.',
    formula: 'ρ = 2m / (n(n−1))',
    tip: 'Solid lines = present, dotted = missing. 8 of 15 → ρ ≈ 0.53.'
  },
  {
    id: 'path', topic: T.S, name: 'Shortest path (geodesic)',
    def: 'The fewest edges needed to get from one node to another. Average shortest path length and the diameter (the longest one) summarise how "far apart" a network is.',
    formula: 'ℓ = ⟨d(i,j)⟩',
    tip: 'Many routes, but only the shortest one counts.'
  },
  {
    id: 'smallworld', topic: T.S, name: 'Small-world network',
    def: 'High clustering AND short average paths. A mostly local lattice with a handful of random long-range shortcuts (Watts–Strogatz) is enough to shrink the world.',
    formula: 'ℓ ~ ln N, C stays high',
    tip: 'Six degrees of separation: a few shortcuts do all the work.'
  },
  {
    id: 'scalefree', topic: T.S, name: 'Scale-free network',
    def: 'A network whose degree distribution follows a power law: no typical degree, a few huge hubs, many tiny nodes. Often explained by preferential attachment.',
    formula: 'P(k) ∝ k^(−γ), usually 2 < γ < 3',
    tip: 'Hubs and spokes. Remove a hub and things break.'
  },
  {
    id: 'er', topic: T.S, name: 'Random graph (Erdős–Rényi)',
    def: 'The null model: every pair of nodes is linked independently with probability p. Degrees are Poisson-distributed, so there are no hubs and clustering is low.',
    formula: '⟨k⟩ = p (n−1)',
    tip: 'Roll a die for every pair. Compare real networks against this.'
  },
  {
    id: 'assort', topic: T.S, name: 'Assortativity',
    def: 'The tendency of nodes to connect to similar nodes, often measured by degree. Assortative: hubs link to hubs (typical of social networks). Disassortative: hubs link to small nodes (typical of technological networks).',
    formula: 'r = Pearson corr. of degrees at the two ends of an edge',
    tip: 'Big with big, small with small → r > 0.'
  },
  {
    id: 'bipartite', topic: T.S, name: 'Bipartite network',
    def: 'Nodes come in two types and edges only join different types. Examples: people–organisations, authors–papers. Project it to get one-mode networks (co-membership).',
    tip: 'Two columns; no edges inside a column.'
  },
  {
    id: 'components', topic: T.S, name: 'Connected components & giant component',
    def: 'A component is a set of nodes all reachable from each other. Many real networks have one giant component containing most nodes, plus small islands and isolates.',
    tip: 'If you can walk between two nodes, they share a component.'
  },
  {
    id: 'reciprocity', topic: T.S, name: 'Directed ties & reciprocity',
    def: 'In a directed network edges have a direction (follows, cites, trusts). Reciprocity is the fraction of edges that are returned: A→B and B→A.',
    formula: 'r = (# mutual edges) / (# edges)',
    tip: 'Double-headed arrow = mutual tie.'
  },
  {
    id: 'clique', topic: T.S, name: 'Clique',
    def: 'A set of nodes in which every pair is connected: a maximally cohesive group. Cliques are the strictest definition of a tight subgroup.',
    tip: 'K5: five people who all know each other.'
  },
  {
    id: 'bridge', topic: T.S, name: 'Bridge',
    def: 'An edge whose removal disconnects the network (or increases the number of components). It carries all traffic between the two sides.',
    tip: 'The single road between two towns.'
  },
  {
    id: 'coreperiph', topic: T.S, name: 'Core–periphery structure',
    def: 'A dense, well-connected core surrounded by a sparsely connected periphery whose members mostly link to the core, not to each other.',
    tip: 'Capital city and its suburbs.'
  },
  {
    id: 'prefattach', topic: T.S, name: 'Preferential attachment',
    def: 'Growth rule (Barabási–Albert): new nodes link to existing nodes with probability proportional to their degree. "The rich get richer" produces hubs and power laws.',
    formula: 'Π(k_i) = k_i / Σ_j k_j',
    tip: 'Thick dashed arrow = most likely landing spot.'
  },

  /* ───────────── CENTRALITY ───────────── */
  {
    id: 'degcent', topic: T.C, name: 'Degree centrality',
    def: 'The simplest importance score: how many direct ties a node has (optionally divided by n−1). It measures local popularity or exposure.',
    formula: 'C_D(i) = k_i / (n−1)',
    tip: 'Bigger node = more ties.'
  },
  {
    id: 'betw', topic: T.C, name: 'Betweenness centrality',
    def: 'How often a node lies on the shortest paths between other pairs. High betweenness = broker or gatekeeper who controls flow between groups.',
    formula: 'C_B(v) = Σ_{s≠v≠t} σ_st(v) / σ_st',
    tip: 'The toll booth every shortest route passes through.'
  },
  {
    id: 'close', topic: T.C, name: 'Closeness centrality',
    def: 'The inverse of the average distance from a node to every other node. A close node can reach (or inform) everyone in few steps.',
    formula: 'C_C(v) = (n−1) / Σ_u d(v,u)',
    tip: 'Dashed rings = distance 1, 2 from the centre.'
  },
  {
    id: 'eigen', topic: T.C, name: 'Eigenvector centrality',
    def: 'A node is important if it is connected to important nodes. Scores are the leading eigenvector of the adjacency matrix; quality of ties beats quantity.',
    formula: 'λ x_i = Σ_j A_ij x_j',
    tip: 'Y has fewer friends than X, but better-connected ones.'
  },
  {
    id: 'pagerank', topic: T.C, name: 'PageRank',
    def: 'Eigenvector-style centrality for directed networks: a random surfer follows links and occasionally teleports. Rank flows along edges and is split among out-links.',
    formula: 'PR(i) = (1−d)/n + d Σ_{j→i} PR(j)/k_j^out',
    tip: 'A vote from an important page counts more.'
  },

  /* ───────────── TIES & COMMUNITIES ───────────── */
  {
    id: 'community', topic: T.T, name: 'Community structure',
    def: 'Groups of nodes that are densely connected inside and sparsely connected to the rest. Communities often map onto real social groups, topics or functions.',
    tip: 'Fill and shape mark the communities; few lines cross between them.'
  },
  {
    id: 'modularity', topic: T.T, name: 'Modularity',
    def: 'Quality score of a partition: the fraction of edges inside groups minus what you would expect if edges were placed at random with the same degrees. High Q = real community structure.',
    formula: 'Q = 1/(2m) Σ_ij [A_ij − k_i k_j /(2m)] δ(c_i, c_j)',
    tip: 'Same graph, two partitions: only the left one earns a high Q.'
  },
  {
    id: 'homophily', topic: T.T, name: 'Homophily',
    def: '"Birds of a feather flock together": ties form more often between similar people (age, race, beliefs, education). It is one of the most robust patterns in social networks.',
    tip: 'Follow the filled nodes: nearly every line joins like to like.'
  },
  {
    id: 'triadic', topic: T.T, name: 'Triadic closure',
    def: 'If A knows B and A knows C, then B and C are likely to become acquainted. It is the main reason social networks have high clustering.',
    tip: 'Introduce your two friends to each other.'
  },
  {
    id: 'holes', topic: T.T, name: 'Structural holes (Burt)',
    def: 'Gaps between people who are not directly connected. A broker who spans a hole gets non-redundant information and control. Redundant contacts (all linked to each other) add little.',
    formula: 'Constraint ↓ when your contacts are unconnected',
    tip: 'Right ego = brokerage advantage. Left ego = redundant echo.'
  },
  {
    id: 'weak', topic: T.T, name: 'Strength of weak ties (Granovetter)',
    def: 'Acquaintances (weak ties) often bridge otherwise separate clusters, so they bring novel information such as job leads. Strong ties are redundant because friends know the same things.',
    tip: 'Thick = strong, thin dashed = weak. The weak one is the lifeline.'
  },
  {
    id: 'ego', topic: T.T, name: 'Ego network',
    def: 'One focal person (ego), their direct contacts (alters), and the ties among those alters. The standard unit of analysis in survey-based social network research.',
    tip: 'Zoom in on one person and ask "who knows whom around me?"'
  },

  /* ───────────── SOCIOLOGY ───────────── */
  {
    id: 'capital', topic: T.O, name: 'Social capital: bonding vs bridging',
    def: 'Resources accessed through ties. Bonding capital (dense, within-group, Coleman) gives trust and support; bridging capital (across groups, Burt/Putnam) gives access to diverse information.',
    tip: 'Dense cluster = bonding; long ties out to other groups = bridging.'
  },
  {
    id: 'structeq', topic: T.O, name: 'Structural equivalence',
    def: 'Two actors are structurally equivalent if they have the same ties to the same others, even if they are not connected to each other. Used to find social roles (two managers with the same reports).',
    tip: 'Swap u and v and nothing changes.'
  },
  {
    id: 'balance', topic: T.O, name: 'Structural balance (Heider)',
    def: 'A signed triangle is balanced if the product of its signs is positive: a friend of my friend is my friend, and an enemy of my enemy is my friend. Unbalanced triads create pressure to change.',
    formula: 'balanced ⇔ s_ij · s_jk · s_ki > 0',
    tip: 'Solid = +, dashed = −. Count the minuses: even = balanced.'
  },
  {
    id: 'prestige', topic: T.O, name: 'Prestige',
    def: 'Status measured by the ties a person receives rather than sends (in-degree): being chosen, cited or deferred to. Distinguishes popularity from mere activity.',
    formula: 'P_D(i) = k_i^in / (n−1)',
    tip: 'All arrows point at the prestigious actor.'
  },
  {
    id: 'echo', topic: T.O, name: 'Echo chamber',
    def: 'A group where people mostly hear and repeat views like their own, with little exposure to the other side. Homophily + sharing within a dense cluster amplify and harden opinions.',
    tip: 'Messages circulate inside; the cross-link is missing.'
  },
  {
    id: 'filter', topic: T.O, name: 'Filter bubble',
    def: 'Algorithmic personalisation shows you content similar to what you already like, so the information you see is a narrow slice of the network. (Pariser)',
    tip: 'The dashed nodes exist, but you never see them.'
  },
  {
    id: 'circles', topic: T.O, name: 'Intersecting social circles (Simmel)',
    def: 'Individuality arises from the unique intersection of the groups someone belongs to (family, work, friends). Overlapping memberships also connect otherwise separate circles.',
    tip: 'You are the point where your circles overlap.'
  },
  {
    id: 'selinf', topic: T.O, name: 'Selection vs influence',
    def: 'Why do connected people look alike? Selection: similar people form ties (homophily). Influence: ties make people converge. Cross-sectional data cannot tell them apart; longitudinal models can.',
    tip: 'Top: similarity → tie. Bottom: tie → similarity.'
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
    tip: 'Crossed cells are unhappy and would move.'
  },

  /* ───────────── DYNAMICS ───────────── */
  {
    id: 'simplecont', topic: T.Y, name: 'Simple contagion',
    def: 'Spreading where a single contact can transmit (diseases, rumours, news). Each exposure infects with probability β, so spread is fast along weak ties and shortcuts.',
    formula: 'P(infect) = 1 − (1−β)^m, m = infected neighbours',
    tip: 'One infected neighbour is enough.'
  },
  {
    id: 'complexcont', topic: T.Y, name: 'Complex contagion / threshold model',
    def: 'Adoption needs reinforcement: you adopt only if enough neighbours already have (a threshold θ). Typical for costly or risky behaviours (protests, norms). Needs clustered, redundant ties rather than long bridges.',
    formula: 'adopt if (active neighbours / k_i) ≥ θ_i',
    tip: 'Two active neighbours → the middle node flips (θ = 2).'
  },
  {
    id: 'degroot', topic: T.Y, name: 'DeGroot model',
    def: 'Each agent repeatedly replaces their opinion by a weighted average of their neighbours\' opinions. On a connected, aperiodic network opinions converge to consensus.',
    formula: 'x(t+1) = W x(t)',
    tip: 'Shades blur together until everyone matches.'
  },
  {
    id: 'fj', topic: T.Y, name: 'Friedkin–Johnsen model',
    def: 'DeGroot with stubbornness: each agent partly clings to their innate opinion x(0) and partly averages with neighbours. Opinions settle but do not reach consensus, so disagreement persists.',
    formula: 'x(t+1) = ΛW x(t) + (I−Λ) x(0)',
    tip: 'Inner fill = current opinion, ring = initial opinion.'
  },
  {
    id: 'bc', topic: T.Y, name: 'Bounded confidence (Deffuant / Hegselmann–Krause)',
    def: 'Agents only listen to others whose opinion is within a confidence bound ε. Small ε gives several stable opinion clusters (fragmentation); large ε gives consensus.',
    formula: '|x_i − x_j| < ε → x_i moves toward x_j',
    tip: 'Only the dots inside the shaded band get heard.'
  },
  {
    id: 'voter', topic: T.Y, name: 'Voter model',
    def: 'At each step a random agent copies the opinion of a random neighbour. Simple, noisy dynamics that eventually reach consensus; time to consensus depends on network structure.',
    formula: 'x_i(t+1) = x_j(t), j random neighbour of i',
    tip: 'Imitate someone nearby, nothing more.'
  },
  {
    id: 'polar', topic: T.Y, name: 'Opinion polarization',
    def: 'The opinion distribution splits into two opposed camps with an empty middle. Network drivers: homophily, echo chambers, repulsive influence, algorithmic curation.',
    tip: 'Bimodal histogram = polarised; single peak = consensus.'
  },
  {
    id: 'sir', topic: T.Y, name: 'SIR epidemic model',
    def: 'Compartment model: Susceptible → Infected → Recovered. On networks the epidemic threshold shrinks with degree heterogeneity: in scale-free networks even weak diseases can spread.',
    formula: 'dS/dt = −βSI,  dI/dt = βSI − γI,  R₀ = β/γ',
    tip: 'S (open) → I (filled) → R (dashed): susceptible, infected, removed.'
  },
  {
    id: 'robust', topic: T.Y, name: 'Robustness & targeted attack',
    def: 'Scale-free networks survive random node failure but shatter when hubs are removed. Percolation theory predicts the critical fraction of nodes whose removal destroys the giant component.',
    tip: 'Delete the hub and the star falls into pieces.'
  },
  {
    id: 'hebbian', topic: T.Y, name: 'Hebbian (associative) learning',
    def: 'A connection between two units strengthens when both are active at the same time (Hebb 1949). Things that co-occur become linked, so activating one later tends to activate the other (associative recall, pattern completion, as in Hopfield networks). The rule is local and unsupervised: no teacher or error signal. If activity is only 0/1 (firing or silent), links can only grow. If states are ±1 (spins, as in Hopfield and Ising belief networks), opposite signs make the product negative, so the link weakens or turns negative. Pure Hebb lets weights grow without bound, so models add decay or normalisation (e.g. Oja\'s rule).',
    formula: 'Δw_ij = η x_i x_j   (x ∈ {0,1}: only grows; x ∈ {−1,+1}: can shrink)',
    tip: 'Fire together, wire together; out of sync, lose the link.'
  }
];
