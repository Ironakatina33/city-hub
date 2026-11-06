(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const STORE_THEME = 'cityhub.theme.v1';
  const STORE_SHORTCUTS = 'cityhub.shortcuts.v1';
  const STORE_RECENT = 'cityhub.recent.v1';
  const apps = Array.isArray(window.CITY_HUB_APPS) ? window.CITY_HUB_APPS : [];
  let filter = 'all';
  let deferredInstallPrompt = null;
  let toastTimeout = null;

  const icons = {
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h3m3 0h3m-6 3h3"/>',
    basket: '<path d="M3 10h18l-2 10H5L3 10Zm4 0 5-7 5 7M9 14v3m6-3v3"/>',
    box: '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm-9 5 9 5 9-5m-9 5v10"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'
  };
  const arrowIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  function safeStoreRead(key, fallback) {
    try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; }
  }
  function safeStoreWrite(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  function safeURL(raw) {
    try { const parsed = new URL(raw); return ['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password ? parsed.href : null; } catch { return null; }
  }
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function showToast(message) {
    const node = $('#toast');
    node.textContent = message;
    node.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => node.classList.remove('visible'), 3500);
  }
  function makeAppCard(app) {
    const url = safeURL(app.url);
    if (!url) return null;
    const color = ['blue', 'orange', 'purple', 'green'].includes(app.color) ? app.color : 'blue';
    const card = el('article', `app-card${color === 'orange' ? ' orange-accent' : ''}`);
    const top = el('div', 'app-card-top');
    const icon = el('div', `app-icon ${color}`);
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = `<svg viewBox="0 0 24 24">${icons[app.icon] || icons.link}</svg>`;
    top.appendChild(icon);
    top.appendChild(el('span', 'availability-tag', 'Accès direct'));
    card.appendChild(top);
    card.appendChild(el('div', 'app-eyebrow', app.label || 'OUTIL MAGASIN'));
    card.appendChild(el('h3', 'app-title', app.title || 'Application'));
    card.appendChild(el('p', 'app-description', app.description || 'Ouvrez cette application en un clic.'));
    const footer = el('div', 'app-card-footer');
    const tags = el('div', 'app-tags');
    (Array.isArray(app.tags) ? app.tags.slice(0, 2) : []).forEach(tag => tags.appendChild(el('span', 'app-tag', tag)));
    const link = el('a', 'app-open');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Ouvrir ${app.title} dans un nouvel onglet`);
    link.appendChild(document.createTextNode('Ouvrir '));
    link.insertAdjacentHTML('beforeend', arrowIcon);
    link.addEventListener('click', () => { safeStoreWrite(STORE_RECENT, app.id); setRecent(); });
    footer.append(tags, link);
    card.appendChild(footer);
    return card;
  }
  function makeComingCard() {
    const card = el('div', 'coming-card');
    card.style.gridColumn = '1 / -1';
    const icon = el('div', 'coming-icon', '+');
    icon.setAttribute('aria-hidden', 'true');
    const copy = el('div', 'coming-copy');
    copy.append(el('strong', '', 'Et la suite ?'), el('p', '', 'Vos prochaines applications trouveront aussi leur place ici.'));
    card.append(icon, copy, el('span', 'coming-suffix', 'À VENIR'));
    return card;
  }
  function renderApps() {
    const query = $('#appSearch').value.trim().toLocaleLowerCase('fr');
    const filtered = apps.filter(app => {
      const matchesCategory = filter === 'all' || app.category === filter;
      const haystack = [app.title, app.label, app.description, ...(app.tags || [])].join(' ').toLocaleLowerCase('fr');
      return matchesCategory && (!query || haystack.includes(query));
    });
    const grid = $('#appsGrid');
    grid.replaceChildren();
    filtered.forEach(app => { const node = makeAppCard(app); if (node) grid.appendChild(node); });
    if (!query && filter === 'all') grid.appendChild(makeComingCard());
    $('#emptyState').hidden = filtered.length > 0;
    $('#appCount').textContent = String(apps.length).padStart(2, '0');
    $('#sideCount').textContent = String(apps.length).padStart(2, '0');
  }
  function setRecent() {
    const recentId = safeStoreRead(STORE_RECENT, null);
    const app = apps.find(item => item.id === recentId);
    const tip = $('.shortcut-tip');
    tip.textContent = app ? `Dernier outil ouvert : ${app.title}` : 'Vos outils favoris, à portée de main.';
  }
  function setTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    $('#themeMoon').hidden = dark;
    $('#themeSun').hidden = !dark;
    $('#themeToggle').setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
    $('meta[name="theme-color"]').content = dark ? '#0b1628' : '#10254a';
    safeStoreWrite(STORE_THEME, dark ? 'dark' : 'light');
  }
  function loadShortcuts() {
    const data = safeStoreRead(STORE_SHORTCUTS, []);
    return Array.isArray(data) ? data.filter(x => x && typeof x.name === 'string' && safeURL(x.url)).slice(0, 12) : [];
  }
  function renderShortcuts() {
    const items = loadShortcuts();
    const root = $('#personalShortcuts');
    root.replaceChildren();
    if (items.length === 0) {
      const empty = el('div', 'placeholder-shortcut');
      empty.append(el('span', '', '✦'), el('strong', '', 'Votre espace personnel'), el('small', '', 'Vos raccourcis apparaîtront ici.'));
      root.append(empty);
      return;
    }
    items.forEach((item, index) => {
      const url = safeURL(item.url);
      const row = el('div', 'shortcut-item');
      const mark = el('div', 'shortcut-favicon', item.name.charAt(0).toUpperCase());
      const copy = el('div', 'shortcut-text');
      copy.append(el('strong', '', item.name), el('small', '', new URL(url).hostname));
      const link = el('a', 'shortcut-open', 'Ouvrir ↗');
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `Ouvrir le raccourci ${item.name}`);
      const remove = el('button', 'shortcut-remove', '✕');
      remove.type = 'button';
      remove.title = `Supprimer ${item.name}`;
      remove.setAttribute('aria-label', `Supprimer le raccourci ${item.name}`);
      remove.addEventListener('click', () => {
        const newItems = loadShortcuts();
        newItems.splice(index, 1);
        safeStoreWrite(STORE_SHORTCUTS, newItems);
        renderShortcuts();
        showToast('Raccourci supprimé');
      });
      row.append(mark, copy, link, remove);
      root.appendChild(row);
    });
  }
  function instructions() {
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const android = /Android/.test(navigator.userAgent);
    if (ios) return '<h3>Sur iPhone / iPad (Safari)</h3><ol><li>Ouvrez City Hub dans <strong>Safari</strong>.</li><li>Appuyez sur le bouton <strong>Partager</strong> (carré avec une flèche).</li><li>Sélectionnez <strong>Sur l’écran d’accueil</strong>, puis <strong>Ajouter</strong>.</li></ol>';
    if (android) return '<h3>Sur Android (Chrome)</h3><ol><li>Ouvrez le portail dans <strong>Chrome</strong>.</li><li>Ouvrez le menu <strong>⋮</strong>.</li><li>Choisissez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.</li></ol>';
    return '<h3>Sur ordinateur</h3><ol><li>Ouvrez le portail dans <strong>Chrome</strong> ou <strong>Edge</strong>.</li><li>Utilisez <strong>Installer l’application</strong> dans la barre d’adresse ou le menu du navigateur.</li></ol><p>Sur mobile, une icône City Hub sera ajoutée à votre écran d’accueil.</p>';
  }
  function setGreeting() {
    const date = new Date();
    const hour = date.getHours();
    $('#greeting').textContent = hour < 12 ? 'Bonjour' : (hour < 18 ? 'Bon après-midi' : 'Bonsoir');
    $('#todayDate').textContent = new Intl.DateTimeFormat('fr-FR', {weekday:'long', day:'numeric', month:'long'}).format(date);
    $('#todayDate').dateTime = date.toISOString().slice(0, 10);
  }
  function updateNav() {
    const hash = (location.hash || '#accueil').replace('#', '');
    $$('.nav-link').forEach(link => link.classList.toggle('is-active', link.dataset.nav === hash));
  }
  function configureEvents() {
    $('#appSearch').addEventListener('input', renderApps);
    $$('.filter-button').forEach(button => button.addEventListener('click', () => {
      filter = button.dataset.filter;
      $$('.filter-button').forEach(node => node.classList.toggle('is-selected', node === button));
      renderApps();
    }));
    $('#resetFilters').addEventListener('click', () => {
      $('#appSearch').value = '';
      $('.filter-button[data-filter="all"]').click();
      $('#appSearch').focus();
    });
    $('#themeToggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme !== 'dark'));
    window.addEventListener('hashchange', updateNav);
    $$('.dialog [data-close]').forEach(button => button.addEventListener('click', () => $('#' + button.dataset.close).close()));
    $$('.dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
    $('#addShortcutButton').addEventListener('click', () => $('#shortcutDialog').showModal());
    $('#shortcutForm').addEventListener('submit', event => {
      event.preventDefault();
      const name = $('#shortcutName').value.trim();
      let rawURL = $('#shortcutUrl').value.trim();
      if (rawURL && !/^https?:\/\//i.test(rawURL)) rawURL = 'https://' + rawURL;
      const url = safeURL(rawURL);
      if (!name || !url) { showToast('Entrez un nom et une adresse web valide.'); return; }
      const existing = loadShortcuts();
      if (existing.length >= 12) { showToast('Maximum 12 raccourcis personnels.'); return; }
      existing.push({name: name.slice(0, 45), url});
      safeStoreWrite(STORE_SHORTCUTS, existing);
      renderShortcuts();
      $('#shortcutDialog').close();
      $('#shortcutForm').reset();
      showToast('Raccourci ajouté à cet appareil !');
    });
    $('#installButton').addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        const prompt = deferredInstallPrompt;
        deferredInstallPrompt = null;
        try { await prompt.prompt(); await prompt.userChoice; } catch { $('#installDialog').showModal(); }
      } else {
        $('#installInstructions').innerHTML = instructions();
        $('#installDialog').showModal();
      }
    });
    window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredInstallPrompt = event; });
    window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; showToast('City Hub est installé !'); });
  }

  setTheme(safeStoreRead(STORE_THEME, 'light') === 'dark');
  configureEvents();
  setGreeting();
  setRecent();
  renderApps();
  renderShortcuts();
  updateNav();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();
