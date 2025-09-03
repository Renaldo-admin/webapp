// Minimal, config-driven app
// Loads solutions from data/solutions.json, renders buttons, and shows prerequisites per solution.

/** @typedef {{label:string, url:string}} Link */
/** @typedef {{type:string, text:string}} Prereq */
/** @typedef {{id:string, title:string, description?:string, prerequisites:Prereq[], links?:Link[]}} Solution */
/** @typedef {{name:string, solutions:Solution[]}} Category */

const state = { solutions: /** @type {Solution[]} */ ([]), filtered: [] };

// Util: create element with classes and text
function el(tag, className, text){
  const e = document.createElement(tag);
  if(className) e.className = className;
  if(text) e.textContent = text;
  return e;
}

async function loadConfig(){
  // Fetch JSON config with cache-busting in dev
  const res = await fetch('data/solutions.json?ts=' + Date.now());
  if(!res.ok) throw new Error('Unable to load solutions.json');
  const cfg = await res.json();
  // Flatten across categories for easier search
  state.solutions = cfg.categories.flatMap(c => c.solutions);
  state.filtered = state.solutions;
  renderButtons();
}

function renderButtons(){
  const container = document.getElementById('buttons');
  container.innerHTML = '';
  state.filtered.forEach(sol => {
    const card = el('button','btn-card');
    card.addEventListener('click', () => showDetails(sol));
    const title = el('div','btn-title', sol.title);
    const desc = el('div','muted', sol.description || '');
    card.append(title, desc);
    container.appendChild(card);
  });
}

function showDetails(sol){
  const details = document.getElementById('details');
  details.classList.remove('hidden');
  document.getElementById('solutionTitle').textContent = sol.title;
  document.getElementById('solutionDesc').textContent = sol.description || '';

  // Build prerequisites checklist
  const pr = document.getElementById('prereqContainer');
  pr.innerHTML = '';

  const section = el('div','prereq');
  const h = el('h3', null, 'Prerequisites');
  section.appendChild(h);

  const list = el('div','checklist');
  sol.prerequisites.forEach((p, idx) => {
    const row = el('label','checklist-item');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = `cb-${sol.id}-${idx}`;
    const txt = el('div', null, p.text);
    const badge = el('span','badge', p.type);
    row.append(cb, txt, badge);
    list.appendChild(row);
  });
  section.appendChild(list);
  pr.appendChild(section);

  // Links
  const links = document.getElementById('links');
  links.innerHTML = '';
  if(sol.links && sol.links.length){
    sol.links.forEach(l => {
      const a = document.createElement('a');
      a.href = l.url; a.target = '_blank'; a.rel='noopener'; a.textContent = `↗ ${l.label}`;
      links.appendChild(a);
    });
  }

  // Actions
  document.getElementById('downloadJson').setAttribute('href', `data:text/json;charset=utf-8,` + encodeURIComponent(JSON.stringify(sol,null,2)));
  document.getElementById('downloadJson').setAttribute('download', `${sol.id}.json`);

  document.getElementById('copyMd').onclick = () => copyMarkdown(sol);
  document.getElementById('print').onclick = () => window.print();
}

function copyMarkdown(sol){
  // Build a Markdown checklist for the solution
  const lines = [
    `# ${sol.title}`,
    '',
    sol.description || '',
    '',
    '## Prerequisites',
    ...sol.prerequisites.map(p => `- [ ] **${p.type}** — ${p.text}`),
    '',
    ...(sol.links && sol.links.length ? ['## Links', ...sol.links.map(l => `- [${l.label}](${l.url})`)] : [])
  ];
  const md = lines.join('
');
  navigator.clipboard.writeText(md).then(()=>{
    const old = document.getElementById('copyMd').textContent;
    document.getElementById('copyMd').textContent = 'Copied!';
    setTimeout(()=> document.getElementById('copyMd').textContent = old, 1200);
  });
}

function initSearch(){
  const input = document.getElementById('search');
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    state.filtered = state.solutions.filter(s =>
      s.title.toLowerCase().includes(q) || (s.description||'').toLowerCase().includes(q)
    );
    renderButtons();
  });
}

function initNav(){
  document.getElementById('closeDetails').addEventListener('click', () => {
    document.getElementById('details').classList.add('hidden');
  });
}

loadConfig().catch(err => {
  console.error(err);
  document.getElementById('buttons').textContent = 'Kon de configuratie niet laden. Controleer data/solutions.json';
});
initSearch();
initNav();
