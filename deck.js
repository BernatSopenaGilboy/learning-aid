/* Card data. Add your own by appending to DECK.
   { id, topic, name, def, formula (optional), tip (memory hook) }. Diagram: diagrams/<id>.tex (TikZ). */
const T = { S: 'Structure', C: 'Centrality', T: 'Ties & communities', O: 'Sociology', Y: 'Dynamics', P: 'Programming', N: 'Exam network science' };

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
  {
    id: 'counterfactual', topic: T.O, name: 'Counterfactual test (causal relevance)',
    def: 'A factor counts as a cause if changing it would have changed the outcome: ask what would have happened had the factor been different. Abend (2008) requires a Theory$_2$ (an explanation of a particular phenomenon) to identify factors that pass such a test.',
    tip: 'Remove the factor in your head: does the outcome survive?'
  },
  {
    id: 'causaldepth', topic: T.O, name: 'Causal depth (analytical sociology)',
    def: 'The explicit identification of the microfoundations, the "social cogs and wheels" (actions and relations), through which a social fact is brought about. Associations between macro variables are surface phenomena that still need explaining. Hedström \\& Bearman (2009: 8--9).',
    tip: 'Depth means going down to what produces the outcome, not a longer chain.'
  },
  {
    id: 'supervenience', topic: T.O, name: 'Supervenience (micro--macro)',
    def: 'Macro properties M supervene on a micro base P: identical micro implies identical macro, but not the converse, since the same macro state can arise in different ways. The P-to-M relation is constitutive (parts to whole), not causal; an earlier macro state affects a later one only through the micro base. Hedström \\& Bearman (2009: 10--11).',
    formula: String.raw`$P_1 = P_2 \Rightarrow M_1 = M_2$, but not $M_1 = M_2 \Rightarrow P_1 = P_2$`,
    tip: 'The dyads do not cause the network; they are the network.'
  },
  {
    id: 'nestedmech', topic: T.O, name: 'Nested hierarchy of mechanisms (Mayntz)',
    def: 'Mechanisms exist at several levels of reality. An entity\'s activity can be studied in isolation, constitutively (via the lower-level mechanisms that generate it) or contextually (via the higher-level mechanism it is part of). Mayntz (2004) also argues that micro--macro mechanisms include structural and institutional factors, not only individual action, so the individual is not a privileged bottom level.',
    tip: 'Cells to organism, actors to system: zoom in or out, no fixed floor.'
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
  },
  {
    id: 'assocdiff', topic: T.Y, name: 'Associative diffusion (Goldberg & Stein 2018)',
    def: 'What spreads between people is not practices but perceived associations: which practices go together. Each agent holds an association matrix R (perceived links, never negative) and a preference vector V (how much they like each practice). Each step, a random actor enacts two practices (liked ones more often). The observer adds +1 to the association between them (all associations slowly decay), then randomly nudges the weaker of the two matching preferences and keeps the change only if it raises constraint satisfaction (similar preferences for associated practices, different for unassociated ones). Result: with no network structure, agents reach interpretative consensus (agree on what goes with what) but split into about two groups with opposed preferences. Contagion models need a segregated network to produce this.',
    formula: 'see co-occurrence → R_ij += 1 (decay λ);  keep Δv only if CS(V, R) ↑',
    tip: 'Agree on what goes together; disagree on which side is good.'
  },
  {
    id: 'cs-assocdiff', topic: T.Y, name: 'Constraint satisfaction: the evaluation step in Goldberg & Stein\'s (2018) associative diffusion model',
    def: 'In Goldberg & Stein\'s (2018) associative diffusion model, the evaluation step: a 0–1 score of how well a person\'s preferences (V) fit the associations they perceive (R). It is high when strongly associated practices are liked about equally and unassociated ones are liked differently. After seeing two practices together, the observer randomly changes the weaker of the two matching preferences and keeps the change only if the score rises. Because "not associated" counts like a negative link, the score is symmetric: two people with the same associations can fit equally well with opposite preferences, so the population splits into two opposed camps. Roots (as cited by Goldberg & Stein): cognitive consistency as a connectionist balancing of linked ideas (Shultz & Lepper 1996; Kunda & Thagard 1996); preferences shifting to fit (Holyoak & Simon 1999; Simon, Krawczyk & Holyoak 2004; Goldberg & Stein take from Simon et al. the rule that associated practices should be liked about equally); learning plus this balancing gives entrenched, polarized preferences (Monroe & Read 2008); in the sociology of culture (Goldberg 2011; Schröder, Hoey & Rogers 2016).',
    formula: 'average over pairs of |R̃_ij − Ω̃_ij|,  Ω_ij = |v_i − v_j|  (R and Ω divided by their max)',
    tip: 'Same associations, opposite tastes: both can fit equally well.'
  },
  {
    id: 'eft', topic: T.Y, name: 'Effective field theory (EFT)',
    def: 'A way to calculate at one scale without knowing the full theory underneath. Write down every term the symmetries allow, ordered by importance at the scale of interest, and measure the coefficients there. The short-distance details are absorbed into those coefficients (Manohar, \\emph{Introduction to Effective Field Theories}).',
    tip: 'Engineers build bridges with the elastic modulus of steel, not with quantum gravity.'
  },
  {
    id: 'slowfast', topic: T.Y, name: 'Slow--fast system (separation of time scales)',
    def: 'A dynamical system where some variables change much more slowly than others ($\\epsilon \\ll 1$). Freeze the slow variable, let the fast one settle, then let the slow one move: the fast variables follow the slow ones adiabatically (Strogatz, ch.~7). In Haken\'s synergetics the slow variables enslave the fast ones on short scales and are rewritten by them on long scales.',
    formula: String.raw`\[\dot x = F(x, \lambda), \qquad \frac{d\lambda}{dT} = G(x, \lambda), \quad T = \epsilon t\]`,
    tip: 'On short scales the slow variable is a fixed parameter; on long scales it moves.'
  },

  /* ───────────── PROGRAMMING ───────────── */
  {
    id: 'py-default-once', topic: T.P,
    name: `What does this print? (Python)<pre style="text-align:left;display:inline-block;font-size:.6em;margin:12px auto 0"><code>def add(x, bucket=[]):
    bucket.append(x)
    return bucket

for i in range(3):
    print(add(i))</code></pre>`,
    def: 'It prints <code>[0]</code>, then <code>[0, 1]</code>, then <code>[0, 1, 2]</code>, not <code>[0]</code>, <code>[1]</code>, <code>[2]</code>. Python evaluates a default argument only once, when the <code>def</code> statement runs, not at each call. Every call that omits <code>bucket</code> therefore gets the same list object, and each <code>append</code> changes that one list. The body, by contrast, runs anew at every call.',
    formula: `<pre style="text-align:left;display:inline-block;margin:0"><code>def add(x, bucket=None):
    if bucket is None:
        bucket = []   # a fresh list at every call
    bucket.append(x)
    return bucket</code></pre>`,
    tip: 'The default is made once, at definition time: one list, shared by every call. Use None as the default for anything mutable.'
  },

  /* ───────────── EXAM: NETWORK SCIENCE (CEU, Battiston/Betti; Menczer, Fortunato & Davis 2020) ───────────── */
  {
    id: 'ns-avgdegree', topic: T.N, name: 'Average degree (and the handshake lemma)',
    def: String.raw`The mean of the node degrees. Every link has two ends, so it adds 1 to the degree of each of its two nodes: the degrees sum to $2L$. In terms of density, $\langle k\rangle = d\,(N-1)$.`,
    formula: String.raw`$\langle k\rangle = \dfrac{1}{N}\sum_i k_i = \dfrac{2L}{N}$, \quad $d = \dfrac{\langle k\rangle}{N-1}$`,
    tip: 'Count link ends, not links: 2L ends shared among N nodes.'
  },
  {
    id: 'ns-singleton', topic: T.N, name: 'Singleton',
    def: String.raw`A node with no neighbours ($k=0$). It is the smallest possible connected component.`,
    tip: 'A dot with no lines touching it.'
  },
  {
    id: 'ns-simplifying', topic: T.N, name: 'The three simplifying assumptions of the course',
    def: String.raw`(1) Single-layer networks, with one type of node and one type of link. (2) No self-loops. (3) At most one link between two nodes (two opposite-direction links are allowed in a directed network). Multilayer networks, self-loops and multi-edges are therefore ruled out.`,
    tip: 'One layer, no loops, no multi-edges.'
  },
  {
    id: 'ns-adjacency', topic: T.N, name: 'Adjacency matrix: directed case, degrees and strengths',
    def: String.raw`An $N\times N$ matrix with $a_{ij}=1$ if there is a link from $i$ to $j$ (source $i$, target $j$), else $0$; in a weighted network $a_{ij}=w_{ij}$. The diagonal is zero (no self-loops). It is symmetric if and only if the network is undirected. Summing across a row gives the out-degree (out-strength), summing down a column gives the in-degree (in-strength).`,
    formula: String.raw`$k_i^{\mathrm{out}} = \sum_j a_{ij}$, \quad $k_i^{\mathrm{in}} = \sum_j a_{ji}$, \quad $s_i = \sum_j w_{ij}$`,
    tip: 'Rows go out, columns come in; row $i$ = what $i$ sends.'
  },
  {
    id: 'ns-strength', topic: T.N, name: 'Strength (weighted degree)',
    def: String.raw`The degree of a node in a weighted network: the sum of the weights of its links. In a directed weighted network it splits into in-strength (weights received) and out-strength (weights sent).`,
    formula: String.raw`$s_i = \sum_j w_{ij}$, \quad $s_i^{\mathrm{in}} = \sum_j w_{ji}$, \quad $s_i^{\mathrm{out}} = \sum_j w_{ij}$`,
    tip: 'Degree counts links, strength adds up their weights.'
  },
  {
    id: 'ns-density', topic: T.N, name: 'Maximum number of links and density: undirected vs directed',
    def: String.raw`The maximum number of links is $L_{\max}=\binom{N}{2}=\frac{N(N-1)}{2}$ if undirected and $N(N-1)$ if directed (each ordered pair can carry a link). Density is the fraction of those that exist. A complete network has $d=1$.`,
    formula: String.raw`$d = \dfrac{2L}{N(N-1)}$ (undirected), \quad $d = \dfrac{L}{N(N-1)}$ (directed)`,
    tip: 'Directed doubles the possible links, so the factor 2 disappears.'
  },
  {
    id: 'ns-sparse', topic: T.N, name: 'Sparse network (and why real networks are sparse)',
    def: String.raw`A network is sparse if $d \ll 1$. Real networks are sparse because the number of links grows roughly in proportion to $N$, whereas the maximum number grows like $N^2$. Facebook: $N\approx 10^9$, $L\approx 10^3 N$, so $d\approx 10^3/10^9 = 10^{-6}$. Consequence: an adjacency matrix (memory $\propto N^2$) wastes space on zeros, so adjacency lists or edge lists are used instead.`,
    formula: String.raw`$d \approx \langle k\rangle / N \ll 1$`,
    tip: 'Links scale like $N$, possible links like $N^2$.'
  },
  {
    id: 'ns-subnetwork', topic: T.N, name: 'Subnetwork',
    def: String.raw`The network obtained by selecting a subset of the nodes together with \emph{all} the links among them. A clique is a subnetwork that is complete (every pair connected, so $d=1$).`,
    tip: 'Pick the nodes; the links among them come along automatically.'
  },
  {
    id: 'ns-adjlist-edgelist', topic: T.N, name: 'Adjacency list vs edge list',
    def: String.raw`Two sparse representations that store only the links that exist. Adjacency list: for each node, the list of its neighbours (in an undirected network each link appears twice; weighted: pairs (neighbour, weight)). Edge list: the list of connected node pairs (weighted: triples $(i,j,w)$). Storage is proportional to $L$, not $N^2$.`,
    tip: 'Per-node neighbours vs one flat list of links.'
  },
  {
    id: 'ns-bipartite-proj', topic: T.N, name: 'Bipartite network and its projection',
    def: String.raw`Two groups of nodes, with links only between groups, never inside a group (movies--actors, classes--students). The biadjacency matrix is rectangular, groups $\times$ members. The projection onto one group links two nodes that share at least one neighbour in the other group; counting how many they share gives a weighted projection.`,
    tip: 'Two actors are linked if they appeared in a movie together; the weight is how many.'
  },
  {
    id: 'ns-forcelayout', topic: T.N, name: 'Force-directed (spring) layout',
    def: String.raw`A network layout algorithm places nodes on a plane to visualize a network. The force-directed kind simulates a physical system in which adjacent nodes are joined by springs and all nodes repel each other. Result: connected nodes sit close together, links have similar lengths, and crossings are minimized. It can reveal community structure if the network is not too dense or too large.`,
    tip: 'Springs pull neighbours together, repulsion spreads everyone else out.'
  },
  {
    id: 'ns-walks', topic: T.N, name: 'Powers of the adjacency matrix',
    def: String.raw`The entry $(A^k)_{ij}$ counts the walks of length $k$ from $i$ to $j$ (walks, not necessarily simple paths: a walk may revisit nodes and links). For $k=2$ the diagonal entries $(A^2)_{ii}$ equal the degrees $k_i$ in an undirected simple network.`,
    formula: String.raw`$(A^2)_{ij} = \sum_m a_{im}a_{mj}$`,
    tip: 'Multiplying by $A$ takes one more step.'
  },

  /* ── exam network science, deck 2: shortest paths & clustering ── */
  {
    id: 'ns-path-types', topic: T.N, name: 'Path, simple path, cycle, path length',
    def: String.raw`A path is a sequence of links traversed to go from a source to a target node; in a directed network the links must be followed in their direction, and there may be no path at all. A cycle is a path whose source and target are the same node. A simple path does not traverse the same link more than once (the course only uses simple paths). Path length is the number of links in the path.`,
    tip: 'Length counts links, not nodes.'
  },
  {
    id: 'ns-apl-diameter', topic: T.N, name: 'Average path length (APL) and diameter, and disconnected networks',
    def: String.raw`The diameter is the largest shortest-path length over all pairs of nodes. The APL is the mean shortest-path length over all pairs (undirected: $N(N-1)/2$ pairs; directed: $N(N-1)$ ordered pairs, since $\ell_{ij}\neq\ell_{ji}$ in general). If some pair has no path, $\ell=\infty$ and both are undefined. Fixes: (1) say they are undefined, as NetworkX does; (2) measure within the largest connected component; (3) average the inverse distances $1/\ell_{ij}$ (an unreachable pair contributes $0$) and invert the result.`,
    formula: String.raw`$\ell_{\max}=\max_{i,j}\ell_{ij}$, \quad $\langle\ell\rangle=\dfrac{2\sum_{i<j}\ell_{ij}}{N(N-1)}$ (undirected)`,
    tip: 'Diameter = worst pair, APL = typical pair.'
  },
  {
    id: 'ns-weak-strong', topic: T.N, name: 'Strongly vs weakly connected (directed networks)',
    def: String.raw`Strongly connected: there is a directed path from every node to every other, following link directions. Weakly connected: there is a path between every pair if the directions are ignored. Example: $a\to b\leftarrow c$ is weakly but not strongly connected (no directed path between $a$ and $c$). The same words apply to components. Strong implies weak, not conversely.`,
    tip: 'Weak = connected once the arrowheads are erased.'
  },
  {
    id: 'ns-in-out-component', topic: T.N, name: 'In-component and out-component of a strongly connected component',
    def: String.raw`For a strongly connected component $S$: the in-component is the set of nodes from which one can reach $S$ but that cannot be reached from $S$; the out-component is the set of nodes that can be reached from $S$ but from which one cannot reach $S$.`,
    tip: 'In = feeds into S, out = fed by S, neither is part of S.'
  },
  {
    id: 'ns-giant', topic: T.N, name: 'Connected component, giant component, singleton',
    def: String.raw`A connected component is a connected subnetwork. If a network is not connected it has several. The largest one is the giant component, when it contains a substantial portion of the network. A singleton ($k=0$) is the smallest possible component.`,
    tip: 'Islands of nodes; the giant one is the mainland.'
  },
  {
    id: 'ns-tree', topic: T.N, name: 'Tree',
    def: String.raw`A connected network without cycles; equivalently, a connected network with $N-1$ links (the course sets proving the equivalence as an exercise). There is a single path between any two nodes. Trees are hierarchical: choose a root; every other node has a parent (towards the root) and possibly children (away from it). The root has no parent, the leaves have no children.`,
    formula: String.raw`$L = N-1$`,
    tip: 'Connected + no cycle, or connected + exactly $N-1$ links.'
  },
  {
    id: 'ns-bfs', topic: T.N, name: 'Breadth-first search',
    def: String.raw`The algorithm used to find shortest paths. Start from a source node (the root) and visit the whole breadth of the network layer by layer: first all nodes at distance 1, then distance 2, and so on, before going deeper. Repeating from every node gives all pairs' shortest paths (slow, about $O(N^2)$).`,
    tip: 'Ripples spreading out from the source.'
  },
  {
    id: 'ns-erdos', topic: T.N, name: 'Erdős number and social distance',
    def: String.raw`Social distance is how far apart two nodes are in a social network, measured by path length and averaged as the APL. An author's Erdős number is the length of the shortest path between them and Paul Erdős in the coauthorship network (nodes: scholars; links: having coauthored at least one paper). Erdős had over 500 coauthors, a hub of that network.`,
    tip: 'Erdős himself has number 0, his coauthors 1.'
  },
  {
    id: 'ns-milgram', topic: T.N, name: 'Milgram\'s small-world experiment and its replications',
    def: String.raw`Milgram (1967): 160 letters to people in Omaha and Wichita, to be forwarded to the personal acquaintance more likely to know a target in Massachusetts (a student's wife in Sharon, a stockbroker in Boston). 42 letters arrived (26%), after 6.5 steps on average (range 3--12): much shorter than expected. Replications: Yahoo Research by email (2003; APL 4, estimated median 5--7 once broken chains are counted); Facebook and Milan (2011; 721 million users, APL 4.74). "Six degrees of separation": Karinthy (1929), popularized by Guare (1991).`,
    tip: '26% of letters made it, in about 6.5 hops.'
  },
  {
    id: 'ns-smallworld', topic: T.N, name: 'Small-world effect (short paths)',
    def: String.raw`Most real networks have very short paths. "Short" is relative to size: the APL grows very slowly with $N$, like $\log N$. Examples: social networks, air transportation, the Internet, the Web, Wikipedia. Exceptions: grid-like networks.`,
    formula: String.raw`$\langle\ell\rangle \sim \log N$`,
    tip: 'Doubling the network adds only a constant to the distance.'
  },
  {
    id: 'ns-triadic', topic: T.N, name: 'Triadic closure',
    def: String.raw`The mechanism by which two people who share a friend tend to become friends themselves (we meet through common friends), closing a triangle. It explains why social networks have high clustering coefficients. A triangle is the closed configuration of three mutually connected nodes; triadic closure is the process that creates it.`,
    tip: 'Friend of a friend becomes a friend.'
  },
  {
    id: 'ns-clustering', topic: T.N, name: 'Clustering coefficient of a node and of the network',
    def: String.raw`Node: the fraction of pairs of the node's neighbours that are connected to each other, $\tau(i)$ divided by the $\binom{k_i}{2}$ possible. It is undefined for $k_i<2$ (NetworkX sets $C=0$). Network: the average of $C(i)$ over the nodes with $k_i>1$ (note: this is not the triangles-over-open-triads ratio, which is the global clustering coefficient or transitivity). Social networks have high $C$; bipartite and tree-like networks have low $C$.`,
    formula: String.raw`$C(i)=\dfrac{\tau(i)}{\binom{k_i}{2}}=\dfrac{2\tau(i)}{k_i(k_i-1)}$, \quad $C=\dfrac{1}{N_{k>1}}\sum_{i:k_i>1}C(i)$`,
    tip: '$\tau(i)$ = links among the neighbours of $i$.'
  },
  {
    id: 'ns-shortest-path', topic: T.N, name: 'Shortest path and distance (unweighted vs weighted)',
    def: String.raw`The shortest path between two nodes is a path of minimal length (there may be several). Its length is the distance $\ell_{ij}$, undefined ($\infty$) if there is no path. In a weighted network the weights may represent distances, so the length of a path is the sum of the weights of its links and the shortest path can differ from the one with fewest links.`,
    tip: 'Fewest links and smallest total weight need not be the same route.'
  },
  {
    id: 'ns-konigsberg', topic: T.N, name: 'Königsberg bridges (Euler, 1736)',
    def: String.raw`Question: can one cross all 7 bridges exactly once each? Euler modelled land masses as nodes and bridges as links. A walk using every link once can have at most two nodes of odd degree (the start and the end). In Königsberg all four nodes have odd degree, so the answer is no.`,
    tip: 'At most two odd-degree nodes: start and finish.'
  },
  {
    id: 'ns-clustering-vs-transitivity', topic: T.N, name: 'Network clustering coefficient vs transitivity',
    def: String.raw`Two different ways to summarize clustering for the whole network. The course's network clustering coefficient is the \emph{average} of the node coefficients $C(i)$ over nodes with $k_i>1$. Transitivity (the global clustering coefficient) is the ratio of closed triads to all connected triples (triangles over open and closed triads); it weights high-degree nodes more heavily. They generally give different numbers.`,
    formula: String.raw`$C=\dfrac{1}{N_{k>1}}\sum_{i:k_i>1}C(i)$ \quad vs \quad $\dfrac{3\times\#\text{triangles}}{\#\text{connected triples}}$`,
    tip: 'Average of ratios vs ratio of totals.'
  },

  /* ── exam network science, deck 3: centrality ── */
  {
    id: 'ns-betweenness', topic: T.N, name: 'Betweenness centrality',
    def: String.raw`A node is more central the more often it is crossed by shortest paths. For every pair of other nodes $(h,j)$, take the fraction of shortest paths from $h$ to $j$ that run through $i$, and sum over all pairs. Here $\sigma_{hj}$ is the number of shortest paths from $h$ to $j$ and $\sigma_{hj}(i)$ the number of those through $i$. (Not "paths through $i$ divided by $N-1$".)`,
    formula: String.raw`$b_i=\sum_{h\neq j\neq i}\dfrac{\sigma_{hj}(i)}{\sigma_{hj}}$`,
    tip: 'A sum over pairs of fractions, not a count divided by N.'
  },
  {
    id: 'ns-closeness', topic: T.N, name: 'Closeness centrality',
    def: String.raw`A node is more central the closer it is, on average, to all the other nodes: the inverse of the sum of its distances to them. The slide formula has no normalization; the usual normalized version (as in NetworkX) \emph{multiplies} by $N-1$, so it equals the inverse of the mean distance.`,
    formula: String.raw`$g_i=\dfrac{1}{\sum_{j\neq i}\ell_{ij}}$, \quad normalized: $\dfrac{N-1}{\sum_{j\neq i}\ell_{ij}}$`,
    tip: 'Small total distance gives high closeness; normalizing multiplies by N-1.'
  },
  {
    id: 'ns-hubs-betweenness', topic: T.N, name: 'Hubs vs high-betweenness nodes',
    def: String.raw`Hubs (high-degree nodes) usually have high betweenness, but a node can have high betweenness without being a hub. Typical case: a broker with only two links that is the sole connection between two tight communities. Every shortest path between the communities passes through it, so its betweenness is high while its degree is low.`,
    tip: 'The only bridge between two communities: low degree, huge betweenness.'
  },
  {
    id: 'ns-edge-betweenness', topic: T.N, name: 'Link (edge) betweenness',
    def: String.raw`The extension of betweenness to links: the fraction of the shortest paths among all possible node pairs that pass through the link.`,
    tip: 'The same idea as node betweenness, counted on a link.'
  },
  {
    id: 'ns-degree-centrality', topic: T.N, name: 'Centrality and degree centrality',
    def: String.raw`Centrality measures the importance of a node (real networks are heterogeneous: some nodes and links are much more central than others). The three basic measures are degree, closeness and betweenness. Degree centrality is simply the degree $k_i$, the number of neighbours; nodes with very high degree are called hubs.`,
    formula: String.raw`$\langle k\rangle=\dfrac{1}{N}\sum_i k_i=\dfrac{2L}{N}$`,
    tip: 'Degree, closeness, betweenness: how many, how near, how between.'
  },
  {
    id: 'ns-histogram', topic: T.N, name: 'Degree histogram, frequency $f_k$ and probability $p_k$',
    def: String.raw`Histogram: $n_k$ is the number of nodes with degree $k$. The frequency is $f_k=n_k/N$ (already a fraction of nodes). For large $N$ the frequency $f_k$ becomes the probability $p_k$ that a node has degree $k$; the probability distribution is the plot of $p_k$ against $k$.`,
    formula: String.raw`$f_k=\dfrac{n_k}{N}\ \xrightarrow{\ N\ \text{large}\ }\ p_k$`,
    tip: 'Count, divide by N once, call it a probability when N is large.'
  },
  {
    id: 'ns-cumulative', topic: T.N, name: 'Cumulative distribution and binning',
    def: String.raw`If the variable is not an integer (e.g. betweenness), divide its range into intervals (bins) and count how many values fall in each. The cumulative distribution $P(x)$ shown in the slides is the probability that the variable takes values \emph{larger} than $x$ (strictly this is the complementary distribution $1-P(X\le x)$); compute it by summing the frequencies of the bins to the right of $x$.`,
    formula: String.raw`$P(x)=\sum_{x'>x}p(x')$`,
    tip: 'Add up everything to the right of x.'
  },
  {
    id: 'ns-heavytail', topic: T.N, name: 'Logarithmic scale and heavy-tail distributions',
    def: String.raw`When a variable spans a huge range of values, plot the logarithms of the values on both axes (log-log), e.g. $\log_{10}1000=3$. A heavy-tail distribution has a variable that goes from small to very large values; this holds for degree and also for betweenness (e.g. Twitter, Wikipedia). A straight line on a log-log plot indicates a power law.`,
    tip: 'Logs compress huge ranges so the tail stays visible.'
  },
  {
    id: 'ns-heterogeneity', topic: T.N, name: 'Heterogeneity parameter',
    def: String.raw`Measures how broad the degree distribution is. If most nodes have the same degree $k_0$ then $\langle k\rangle\approx k_0$, $\langle k^2\rangle\approx k_0^2$ and $\kappa\approx1$. For a very heterogeneous distribution $\kappa\gg1$ (the average of $k^2$ is dominated by the hubs).`,
    formula: String.raw`$\kappa=\dfrac{\langle k^2\rangle}{\langle k\rangle^2}$, \quad $\langle k^2\rangle=\dfrac{\sum_i k_i^2}{N}$`,
    tip: 'Near 1: everyone alike. Much larger than 1: hubs exist.'
  },
  {
    id: 'ns-directed', topic: T.N, name: 'Directed networks (links from source to target)',
    def: String.raw`Each link goes from a source to a target. Node degree splits into in-degree and out-degree, and paths must respect the link directions. Examples: email, the Web, Wikipedia, citation networks.`,
    tip: 'In = arrows arriving, out = arrows leaving.'
  },
  {
    id: 'ns-citation', topic: T.N, name: 'Citation network',
    def: String.raw`Nodes are scholarly articles and links are citations of references. The direction of the links must be consistent with publication time (an article can only cite earlier ones). Two articles can be related by co-citation (both cited by a third) or by co-reference (both cite the same article).`,
    tip: 'Arrows point back in time.'
  },
  {
    id: 'ns-web-graph', topic: T.N, name: 'Web graph vs host graph (and the Web vs the Internet)',
    def: String.raw`The (World-Wide) Web is not the same as the Internet. Web graph (web link graph): nodes are Web pages identified by URLs, links are hyperlinks. Host graph (site graph): nodes are websites (identified by hostname or domain name), with a link between two sites if any hyperlink exists between their pages. Wikipedia is a subnetwork of the Web graph.`,
    tip: 'Pages vs sites: the host graph lumps all pages of a site into one node.'
  },
  {
    id: 'ns-web-history', topic: T.N, name: 'Web history: why one-directional links',
    def: String.raw`Hypertext existed for decades before the Web, but bidirectional links were hard to implement: they needed a centralized authority. In the early 1990s Tim Berners-Lee introduced the WWW model with one-directional hyperlinks from the source page: easy to implement in a distributed fashion, with no need for reciprocity from the target or persistence (broken links are okay). His three key ingredients: URLs (addresses), HTML (pages), HTTP (client--server communication).`,
    tip: 'One-way links need no permission from the target.'
  },
  {
    id: 'ns-web-indegree', topic: T.N, name: 'Web degree distributions: in-degree vs out-degree',
    def: String.raw`The in-degree distribution is heavy-tailed, with huge hubs; it arises from the collective behaviour of authors. The out-degree distribution is less meaningful: it depends on individual content providers and can be gamed, e.g. by link farms for spamdexing. The core of the Web has short paths.`,
    tip: 'Others link to you (hard to fake); your own out-links cost nothing.'
  },
  {
    id: 'ns-pagerank', topic: T.N, name: 'PageRank and the random surfer model',
    def: String.raw`A centrality measure for nodes in directed networks, used to compute the importance (prestige) of Web pages and to rank pages that look equally relevant by content; introduced by Brin and Page (1998) as a key ingredient of Google. Random surfer: browse the Web by clicking a random link from each page; at each step, with probability $\alpha$ (the teleportation or jump factor, typically $0.15$) stop and start a new session from a random page. PageRank is how often the surfer visits a page; $1-\alpha$ is the damping factor.`,
    formula: String.raw`$R_t(i)=\dfrac{\alpha}{N}+(1-\alpha)\sum_{j\in\mathrm{pred}(i)}\dfrac{R_{t-1}(j)}{k^{\mathrm{out}}(j)}$`,
    tip: 'Jump anywhere with prob. alpha; otherwise inherit rank from in-neighbours, split among their out-links.'
  },
  {
    id: 'ns-pagerank-power', topic: T.N, name: 'Power method and conservation of PageRank',
    def: String.raw`Power method: initialize every node with $R_0=1/N$, then at each iteration update every node with the recursive PageRank equation; it converges in few iterations if $\alpha>0$. PageRank is conserved, neither created nor destroyed: $\sum_i R(i)=1$. Example with $\alpha=0$: if $R(1)=0.2$, $k^{\mathrm{out}}(1)=5$, $R(2)=0.3$, $k^{\mathrm{out}}(2)=2$ and both point to node 3, then $R(3)=0.2/5+0.3/2=0.19$.`,
    formula: String.raw`$R_0(i)=\dfrac{1}{N}$, \quad $\sum_i R(i)=1$`,
    tip: 'Start uniform, iterate, total always stays 1.'
  },
  {
    id: 'ns-pagerank-indegree', topic: T.N, name: 'PageRank vs in-degree',
    def: String.raw`The PageRank distribution is very skewed, similar to the in-degree distribution. To a first approximation PageRank is similar to in-degree, if all incoming links originate from pages with the same PageRank. But links from more important pages bring more importance.`,
    tip: 'In-degree counts links; PageRank weighs them by who sends them.'
  },
  {
    id: 'ns-seo', topic: T.N, name: 'Search engine optimization (SEO) and spamdexing',
    def: String.raw`SEO companies try to boost a client website's PageRank. Unscrupulous ones may use spamdexing (e.g. link farms); if caught by the search engines, the client can be de-listed.`,
    tip: 'Legitimate SEO vs gaming the ranking.'
  },

  /* ── exam network science, deck 4: friendship paradox, assortativity, robustness ── */
  {
    id: 'ns-friendship-paradox', topic: T.N, name: 'Friendship paradox',
    def: String.raw`On average, the neighbours of a node have more neighbours than the node itself: our friends have more friends than we do. Slide example: average degree of a node $=2.29$, average degree of its neighbours $=2.83$. It holds on average, not for every node.`,
    tip: 'Your friends are, on average, more popular than you.'
  },
  {
    id: 'ns-friendship-why', topic: T.N, name: 'Why the friendship paradox arises (nodes vs links)',
    def: String.raw`Choosing nodes at random gives everybody the same chance; choosing links at random favours high-degree nodes (a node of degree $k$ has $k$ links to be reached through). Averaging the degree of nodes picks them at random; averaging the degree of neighbours follows links, so a node of degree $k$ is counted $k$ times, which inflates the average. The more hubs, the stronger the effect.`,
    tip: 'Following a link makes you land on hubs more often.'
  },
  {
    id: 'ns-assortativity-mech', topic: T.N, name: 'Assortativity: selection (homophily) vs social influence',
    def: String.raw`Assortativity is the tendency of similar nodes to be connected. Two mechanisms produce it naturally: (1) selection or homophily: similar nodes become connected; (2) (social) influence: connected nodes become more similar. The two have opposite causal directions. Downside: echo chambers and groupthink, where your friends are like you, diversity is killed and you only meet opinions that reinforce your pre-existing beliefs.`,
    tip: 'Selection: similar then linked. Influence: linked then similar.'
  },
  {
    id: 'ns-degree-assortativity', topic: T.N, name: 'Degree assortativity: assortative vs disassortative networks',
    def: String.raw`Degree assortativity (degree correlation) is assortativity measured on the degree: do hubs link to hubs? Assortative networks have a core-periphery structure with hubs in the core (example: social networks). Disassortative networks have a hub-and-spoke (star) structure, where hubs link to low-degree nodes (examples: the Web, the Internet, food webs, biological networks).`,
    tip: 'Assortative: hubs together in a core. Disassortative: hub with spokes.'
  },
  {
    id: 'ns-assortativity-attr', topic: T.N, name: 'Assortativity by attribute (categorical, numerical, degree)',
    def: String.raw`Assortativity can be computed from a categorical attribute (e.g. gender), a numerical attribute (e.g. age), or the degree. For degree it is the Pearson correlation between the degrees of adjacent nodes, $r$: positive for assortative networks, negative for disassortative ones.`,
    tip: 'Pick the attribute, then ask whether linked nodes agree on it.'
  },
  {
    id: 'ns-knn', topic: T.N, name: 'Average nearest-neighbour degree $k_{nn}$',
    def: String.raw`$k_{nn}(i)$ is the average degree of the neighbours of node $i$; $k_{nn}(k)$ averages it over all nodes of degree $k$. A second way to get the degree assortativity is the Pearson correlation between $k$ and $k_{nn}(k)$. Under the friendship paradox $k_{nn}$ is on average larger than $k$.`,
    formula: String.raw`$k_{nn}(i)=\dfrac{1}{k_i}\sum_j a_{ij}k_j$, \quad $k_{nn}(k)=\langle k_{nn}(i)\rangle_{i:\,k_i=k}$`,
    tip: 'Increasing in $k$: assortative; decreasing: disassortative.'
  },
  {
    id: 'ns-robustness', topic: T.N, name: 'Robustness and the robustness test',
    def: String.raw`A system is robust if the failure of some components does not affect its function; for networks the key point is connectedness. Test: remove nodes (and their links) and plot the relative size $S$ of the largest connected component against the fraction $f$ of removed nodes. The network is initially connected ($S=1$) and $S$ decreases as it breaks into components.`,
    tip: 'Delete nodes and watch the giant component shrink.'
  },
  {
    id: 'ns-failures-attacks', topic: T.N, name: 'Random failures vs targeted attacks',
    def: String.raw`Random failures: a fraction $f$ of nodes is removed at random, all with the same probability. Attacks: hubs are deliberately targeted, removing the fraction $f$ of nodes with the largest degree, from the biggest downwards. Conclusion: real networks are robust against random failures but fragile against targeted attacks.`,
    tip: 'Random loss is mostly small nodes; an attack hits the hubs first.'
  },
  {
    id: 'ns-er-giant', topic: T.N, name: 'Emergence of the giant component in an Erdős–Rényi network',
    def: String.raw`In a random network $G(N,p)$ with $\langle k\rangle = p(N-1)$, a giant component appears at the critical point $\langle k\rangle = 1$, i.e. $p_c \approx 1/N$. Below it (subcritical) all components are small tree-like clusters, the largest of size $\sim \ln N$. Above it (supercritical) one component holds a finite fraction $S$ of the nodes, which grows continuously from $0$: a phase transition. For $\langle k\rangle > \ln N$ the network is fully connected. Why at $1$: exploring outwards, each reached node leads on average to $\langle k\rangle$ new nodes, so the search dies out if $\langle k\rangle<1$ and can go on forever if $\langle k\rangle>1$.`,
    formula: String.raw`\[S = 1 - e^{-\langle k\rangle S}, \qquad \langle k\rangle_c = 1\]`,
    tip: 'One link per node on average is the tipping point: below it islands, above it a mainland.'
  }
];
