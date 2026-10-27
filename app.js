(() => {
  const $ = s => document.querySelector(s);
  const KEY = 'netsoc-flashcards-v1';
  const MIN = 6e4, DAY = 864e5;
  const day = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ── state ── */
  let S = { cards: {}, log: {}, settings: { view: 'study', mode: 'forward', kind: 'All', fvis: true, topic: 'All', newLimit: 10, theme: '' } };
  try {
    const r = JSON.parse(localStorage.getItem(KEY));
    if (r && r.cards) S = { ...S, ...r, settings: { ...S.settings, ...r.settings } };
  } catch (e) { /* storage unavailable: run in memory */ }
  if (!['forward', 'reverse'].includes(S.settings.mode)) S.settings.mode = 'forward';
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  /* ── scheduler (SM-2 lite) ── */
  const fresh = () => ({ ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0 });
  function next(c, q) {
    c = { ...(c || fresh()) };
    if (q === 0) { c.lapses++; c.interval = 0; c.ease = Math.max(1.3, c.ease - 0.2); c.due = Date.now() + MIN; }
    else {
      if (q === 1) { c.interval = Math.max(1, c.interval * 1.2); c.ease = Math.max(1.3, c.ease - 0.15); }
      else if (q === 2) c.interval = c.interval < 1 ? 1 : c.interval * c.ease;
      else { c.interval = c.interval < 1 ? 3 : c.interval * c.ease * 1.3; c.ease += 0.1; }
      c.interval = Math.max(1, Math.round(c.interval));
      c.due = Date.now() + c.interval * DAY;
    }
    c.reps++;
    return c;
  }
  const fmt = c => { const m = (c.due - Date.now()) / MIN; return m < 90 ? `${Math.max(1, Math.round(m))}m` : `${Math.round(c.interval)}d`; };
  function rate(id, q) {
    S.cards[id] = next(S.cards[id], q);
    S.log[day()] = (S.log[day()] || 0) + 1;
    save();
  }

  /* ── helpers ── */
  const isProp = c => c.type === 'prop';
  const tx = (c, k) => TeX.text(c[k], c.id);   /* card text is typeset by tex.js (KaTeX for math) */
  /* diagrams are compiled from diagrams/<id>.tex into diagrams.js; a proposition borrows its ref's diagram */
  const visOf = c => (typeof DIAGRAMS !== 'undefined' && DIAGRAMS[isProp(c) ? c.ref : c.id]) || '';
  const pool = () => DECK.filter(c => (S.settings.topic === 'All' || c.topic === S.settings.topic) && (S.settings.kind === 'All' || (S.settings.kind === 'prop') === isProp(c)));
  const isDue = c => { const s = S.cards[c.id]; return s && s.reps > 0 && s.due <= Date.now(); };
  const isNew = c => !S.cards[c.id] || !S.cards[c.id].reps;
  function buildQueue(all) {
    const p = pool();
    if (all) return shuffle(p);
    return [...shuffle(p.filter(isDue)), ...shuffle(p.filter(isNew)).slice(0, S.settings.newLimit)];
  }
  const streak = () => { let n = 0, t = Date.now(); if (!S.log[day(t)]) t -= DAY; while (S.log[day(t)]) { n++; t -= DAY; } return n; };

  /* ── views ── */
  let queue = [], flipped = false, quizState = null;
  const view = $('#view');

  function render() {
    const v = S.settings.view;
    document.querySelectorAll('#tabs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === v));
    $('#mode').style.display = v === 'study' ? '' : 'none';
    $('#kind').style.display = v === 'stats' || v === 'quiz' ? 'none' : '';
    document.querySelector('.chk').style.display = v === 'study' || v === 'quiz' ? '' : 'none';
    $('#topic').style.display = v === 'stats' ? 'none' : '';
    ({ study: renderStudy, quiz: renderQuiz, browse: renderBrowse, stats: renderStats })[v]();
  }

  function renderStudy() {
    if (!queue.length) {
      const due = pool().filter(c => S.cards[c.id] && S.cards[c.id].reps > 0).map(c => S.cards[c.id].due).sort((a, b) => a - b)[0];
      view.innerHTML = `<div class="center"><h2>All caught up.</h2><p class="def">No cards due${S.settings.topic === 'All' ? '' : ' in ' + S.settings.topic}.${due ? ' Next review: ' + new Date(due).toLocaleString() + '.' : ''}</p>
        <div class="row" style="justify-content:center"><button class="btn primary" id="new">Start new session</button><button class="btn" id="cram">Cram everything</button></div></div>`;
      $('#new').onclick = () => { queue = buildQueue(); flipped = false; render(); };
      $('#cram').onclick = () => { queue = buildQueue(true); flipped = false; render(); };
      return;
    }
    const c = queue[0], fwd = S.settings.mode === 'forward', spark = S.settings.fvis;
    const vis = visOf(c), chip = `<span class="chip">${c.topic}</span>`;
    /* typeset like a LaTeX document: Proposition / Proof sketch / Definition / Remark */
    const fig = spark && vis ? `<div class="vis small">${vis}</div>` : '';
    const formula = c.formula ? `<div class="formula">${tx(c, 'formula')}</div>` : '';
    const prop = `<span class="thm-h">Proposition.</span> <span class="thm-b">${tx(c, 'name')}</span>`;
    const defn = `<p class="def"><span class="thm-h">Definition.</span> ${tx(c, 'def')}</p>`;
    const remark = `<p class="tip"><span class="rem-h">Remark.</span> ${tx(c, 'tip')}</p>`;
    const hint = '<p class="hint">space = flip</p>';
    let front, back;
    if (isProp(c)) {
      front = `${chip}<div class="mid"><div class="thm">${prop}</div></div><p class="prompt">Why is this true? Reconstruct the argument.</p>${hint}`;
      back = `${chip}<p class="thm small">${prop}</p><div class="proof"><span class="proof-h">Proof sketch.</span> ${tx(c, 'def')}<span class="qed" aria-hidden="true">□</span></div><p class="src">${tx(c, 'src')}</p>${fig}`;
    } else if (fwd) {
      front = `${chip}<div class="mid"><h1 class="big-name">${tx(c, 'name')}</h1>${fig}</div><p class="prompt">Define it in your own words.</p>${hint}`;
      back = `${chip}<h2>${tx(c, 'name')}</h2>${defn}${formula}${remark}${fig}`;
    } else {
      front = `${chip}<div class="mid">${defn}${formula}</div><p class="prompt">Which concept is this?</p>${hint}`;
      back = `${chip}<h2>${tx(c, 'name')}</h2>${remark}${fig}`;
    }
    const st = S.cards[c.id];
    view.innerHTML = `<div class="meta"><span>${queue.length} left in session</span><span>${st && st.reps ? 'reviewed ' + st.reps + '×' : 'new card'}</span></div>
      <div class="stage"><div class="card${flipped ? ' flipped' : ''}" id="card"><div class="face front">${front}</div><div class="face back">${back}</div></div></div>
      <div class="rate" id="rate">${flipped
        ? [0, 1, 2, 3].map(q => `<button class="r${q}" data-q="${q}">${['Again', 'Hard', 'Good', 'Easy'][q]}<small>${q + 1} · ${fmt(next(st, q))}</small></button>`).join('')
        : '<button class="btn primary" id="show">Show answer</button>'}</div>`;
    $('#card').onclick = flip;
    const sh = $('#show'); if (sh) sh.onclick = flip;
    document.querySelectorAll('#rate [data-q]').forEach(b => b.onclick = () => answer(+b.dataset.q));
  }
  function flip() { if (S.settings.view !== 'study' || !queue.length) return; flipped = !flipped; renderKeepAnim(); }
  function renderKeepAnim() {
    const card = $('#card'); if (!card) return render();
    card.classList.toggle('flipped', flipped);
    const r = $('#rate'), c = queue[0], st = S.cards[c.id];
    r.innerHTML = flipped
      ? [0, 1, 2, 3].map(q => `<button class="r${q}" data-q="${q}">${['Again', 'Hard', 'Good', 'Easy'][q]}<small>${q + 1} · ${fmt(next(st, q))}</small></button>`).join('')
      : '<button class="btn primary" id="show">Show answer</button>';
    const sh = $('#show'); if (sh) sh.onclick = flip;
    r.querySelectorAll('[data-q]').forEach(b => b.onclick = () => answer(+b.dataset.q));
  }
  function answer(q) {
    const c = queue.shift();
    rate(c.id, q);
    if (q === 0) queue.splice(Math.min(queue.length, 3), 0, c);
    flipped = false; render();
  }

  /* quiz: multiple choice from picture */
  function newQuiz() {
    // concept cards of the chosen topic; the kind filter is hidden in Quiz, so it must not apply here
    const p = DECK.filter(c => !isProp(c) && (S.settings.topic === 'All' || c.topic === S.settings.topic)); if (p.length < 4) return quizState = null;
    const due = p.filter(isDue), src = due.length && Math.random() < 0.6 ? due : p;
    const c = src[Math.random() * src.length | 0];
    const same = shuffle(DECK.filter(x => !isProp(x) && x.id !== c.id && x.topic === c.topic)), other = shuffle(DECK.filter(x => !isProp(x) && x.id !== c.id && x.topic !== c.topic));
    const opts = shuffle([c, ...[...same, ...other].slice(0, 3)]);
    quizState = { c, opts, picked: null, vis: S.settings.fvis ? visOf(c) : '' };
  }
  function renderQuiz() {
    if (!quizState) newQuiz();
    if (!quizState) { view.innerHTML = '<p class="center">Quiz needs at least 4 concept cards in this selection.</p>'; return; }
    const { c, opts, picked, vis } = quizState;
    view.innerHTML = `<div class="quiz-vis"><p class="def"><span class="thm-h">Definition.</span> ${tx(c, 'def')}</p>${vis}</div><div class="opts">${opts.map((o, i) => {
      const cls = picked == null ? '' : o.id === c.id ? 'ok' : o.id === picked ? 'bad' : '';
      return `<button class="${cls}" data-id="${o.id}" ${picked != null ? 'disabled' : ''}><kbd>${i + 1}</kbd>${tx(o, 'name')}</button>`;
    }).join('')}</div>${picked != null ? `<div class="reveal"><b>${tx(c, 'name')}</b> <span class="sc">(${c.topic})</span>${c.formula ? `<div class="formula">${tx(c, 'formula')}</div>` : ''}<p class="tip"><span class="rem-h">Remark.</span> ${tx(c, 'tip')}</p><button class="btn primary" id="nq">Next →</button></div>` : ''}`;
    view.querySelectorAll('.opts button').forEach(b => b.onclick = () => pick(b.dataset.id));
    const n = $('#nq'); if (n) n.onclick = () => { newQuiz(); render(); };
  }
  function pick(id) {
    if (!quizState || quizState.picked != null) return;
    quizState.picked = id;
    rate(quizState.c.id, id === quizState.c.id ? 2 : 0);
    render();
  }

  function renderBrowse() {
    view.innerHTML = `<div class="tools"><input type="search" id="q" placeholder="Search concepts…" style="flex:1;min-width:180px"></div><div class="grid" id="grid"></div>`;
    const draw = () => {
      const q = $('#q').value.toLowerCase();
      $('#grid').innerHTML = pool().filter(c => !q || (c.name + c.def).toLowerCase().includes(q)).map(c =>
        `<div class="tile" data-id="${c.id}"><span class="chip">${c.topic}</span>${isProp(c) ? '' : visOf(c)}<h3>${tx(c, 'name')}</h3><div class="more">${tx(c, 'def')}${c.formula ? `<div class="formula">${tx(c, 'formula')}</div>` : ''}${isProp(c) ? `<p class="src">${tx(c, 'src')}</p>` : `<p class="tip">${tx(c, 'tip')}</p>`}</div></div>`).join('');
      document.querySelectorAll('.tile').forEach(t => t.onclick = () => t.classList.toggle('open'));
    };
    $('#q').oninput = draw; draw();
  }

  function renderStats() {
    const all = DECK.map(c => S.cards[c.id]).filter(Boolean);
    const learned = all.filter(c => c.reps > 0).length, mature = all.filter(c => c.interval >= 21).length;
    const due = DECK.filter(isDue).length, today = S.log[day()] || 0;
    const topics = [...new Set(DECK.map(c => c.topic))];
    view.innerHTML = `<div class="stats">
      <div class="stat"><b>${learned}/${DECK.length}</b><span>cards seen</span></div>
      <div class="stat"><b>${mature}</b><span>mature (≥21d)</span></div>
      <div class="stat"><b>${due}</b><span>due now</span></div>
      <div class="stat"><b>${today}</b><span>reviews today</span></div>
      <div class="stat"><b>${streak()}</b><span>day streak</span></div></div>
      ${topics.map(t => { const cs = DECK.filter(c => c.topic === t), k = cs.filter(c => S.cards[c.id] && S.cards[c.id].reps > 0).length;
        return `<div class="prog"><div style="display:flex;justify-content:space-between"><span>${t}</span><span>${k}/${cs.length}</span></div><div class="bar"><i style="width:${100 * k / cs.length}%"></i></div></div>`; }).join('')}
      <div class="row"><button class="btn" id="exp">Export progress</button><button class="btn" id="imp">Import progress</button><button class="btn" id="rst">Reset all</button><input type="file" id="file" accept=".json" hidden></div>`;
    $('#exp').onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }));
      a.download = 'flashcards-progress.json'; a.click(); URL.revokeObjectURL(a.href);
    };
    $('#imp').onclick = () => $('#file').click();
    $('#file').onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then(t => {
        const r = JSON.parse(t), ok = {};
        for (const [id, c] of Object.entries(r.cards || {})) if (DECK.some(d => d.id === id) && ['ease', 'interval', 'due', 'reps', 'lapses'].every(k => Number.isFinite(c[k]))) ok[id] = c;
        S.cards = ok; S.log = r.log && typeof r.log === 'object' ? r.log : {}; save(); queue = buildQueue(); render();
      }).catch(() => alert('Could not read that file.'));
    };
    $('#rst').onclick = () => { if (confirm('Erase all progress?')) { S.cards = {}; S.log = {}; save(); queue = buildQueue(); render(); } };
  }

  /* ── wiring ── */
  const topics = ['All', ...new Set(DECK.map(c => c.topic))];
  $('#kind').value = S.settings.kind; $('#fvis').checked = S.settings.fvis;
  $('#kind').onchange = e => { S.settings.kind = e.target.value; save(); queue = buildQueue(); flipped = false; quizState = null; render(); };
  $('#fvis').onchange = e => { S.settings.fvis = e.target.checked; save(); quizState = null; render(); };
  $('#topic').innerHTML = topics.map(t => `<option>${t}</option>`).join('');
  $('#topic').value = S.settings.topic;
  $('#mode').value = S.settings.mode;
  if (S.settings.theme) document.documentElement.dataset.theme = S.settings.theme;
  $('#topic').onchange = e => { S.settings.topic = e.target.value; save(); queue = buildQueue(); flipped = false; quizState = null; render(); };
  $('#mode').onchange = e => { S.settings.mode = e.target.value; save(); render(); };
  $('#theme').onclick = () => {
    const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
    S.settings.theme = dark ? 'light' : 'dark'; document.documentElement.dataset.theme = S.settings.theme; save();
  };
  document.querySelectorAll('#tabs button').forEach(b => b.onclick = () => { S.settings.view = b.dataset.view; save(); render(); });
  document.addEventListener('keydown', e => {
    if ((e.target.matches && e.target.matches('input,select,textarea')) || e.ctrlKey || e.metaKey) return;
    const v = S.settings.view;
    if (v === 'study') {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      else if (flipped && '1234'.includes(e.key) && e.key) answer(+e.key - 1);
    } else if (v === 'quiz' && quizState) {
      if (quizState.picked == null && '1234'.includes(e.key) && e.key) { const o = quizState.opts[+e.key - 1]; if (o) pick(o.id); }
      else if (quizState.picked != null && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); newQuiz(); render(); }
    }
  });

  queue = buildQueue();
  render();
})();
