(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const STORAGE_THEME = 'cityhub.theme.v1';
  const STORAGE_SHORTCUTS = 'cityhub.shortcuts.v1';
  const apps = Array.isArray(window.CITY_HUB_APPS) ? window.CITY_HUB_APPS : [];
  let deferredPrompt = null;
  let toastTimer;

  function stored(key, fallback) {
    try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); }
    catch { return fallback; }
  }
  function save(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch {} }
  function allowedURL(value) {
    try { const u = new URL(value); return (u.protocol === 'https:' || u.protocol === 'http:') && !u.username && !u.password ? u.href : null; }
    catch { return null; }
  }
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function toast(text) {
    const element = $('#toast');
    element.textContent = text;
    element.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('visible'), 2800);
  }
  function appCard(app, index) {
    const href = allowedURL(app.url);
    if (!href) return null;
    const kind = app.id === 'freshdesk' || app.category === 'rayon' ? 'fresh' : app.category === 'equipe' ? 'planning' : 'other';
    const card = node('article', 'app-card is-' + kind);
    const link = node('a', 'card-link');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Ouvrir ' + (app.title || 'application') + ' dans un nouvel onglet');
    const imageURL = app.image && allowedURL(app.image);
    if (imageURL && imageURL.startsWith('https://')) {
      const image = node('img', 'card-image');
      image.src = imageURL;
      image.alt = '';
      image.loading = index < 2 ? 'eager' : 'lazy';
      image.decoding = 'async';
      if (index === 0) image.fetchPriority = 'high';
      link.appendChild(image);
    }
    const shade = node('div', 'card-shade');
    shade.setAttribute('aria-hidden', 'true');
    const top = node('div', 'card-top');
    top.append(node('span', 'card-kicker', app.category === 'equipe' ? 'ÉQUIPE / 01' : app.category === 'rayon' ? 'RAYON / 02' : 'OUTIL / ' + String(index + 1).padStart(2, '0')),
               node('span', 'card-arrow', '↗'));
    top.lastChild.setAttribute('aria-hidden', 'true');
    const copy = node('div', 'card-copy');
    copy.appendChild(node('span', 'card-pretitle', app.label || 'APPLICATION MAGASIN'));
    copy.appendChild(node('h3', '', app.title || 'Application'));
    copy.appendChild(node('p', '', app.description || 'Accéder à cet outil.'));
    const action = node('span', 'card-action');
    action.appendChild(document.createTextNode(app.category === 'equipe' ? 'Voir le planning' : app.category === 'rayon' ? 'Préparer une commande' : 'Ouvrir l’application'));
    action.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 13 0m-5-5 5 5-5 5"/></svg>');
    copy.appendChild(action);
    link.append(shade, top, copy);
    card.appendChild(link);
    return card;
  }
  function renderApps() {
    const grid = $('#appsGrid');
    grid.replaceChildren();
    apps.forEach((app, index) => {
      const card = appCard(app, index);
      if (card) grid.appendChild(card);
    });
    $('#appCount').textContent = apps.length.toString().padStart(2, '0') + (apps.length === 1 ? ' outil disponible' : ' outils disponibles');
    $('#emptyState').hidden = grid.children.length !== 0;
  }
  function changeTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    $('#themeMoon').hidden = dark;
    $('#themeSun').hidden = !dark;
    $('#themeToggle').setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
    $('meta[name="theme-color"]').content = dark ? '#101a25' : '#f5f6f4';
    save(STORAGE_THEME, dark ? 'dark' : 'light');
  }
  function shortcuts() {
    const items = stored(STORAGE_SHORTCUTS, []);
    return Array.isArray(items) ? items.filter(item => item && typeof item.name === 'string' && allowedURL(item.url)).slice(0, 12) : [];
  }
  function renderShortcuts() {
    const host = $('#personalShortcuts');
    host.replaceChildren();
    const items = shortcuts();
    if (!items.length) {
      host.appendChild(node('div', 'shortcut-empty', 'Aucun raccourci personnel pour le moment.'));
      return;
    }
    items.forEach((item, index) => {
      const href = allowedURL(item.url);
      const row = node('div', 'shortcut-item');
      const initial = node('span', 'shortcut-avatar', item.name.trim().slice(0, 1).toUpperCase() || '•');
      const info = node('div', 'shortcut-info');
      info.append(node('strong', '', item.name), node('small', '', new URL(href).hostname));
      const open = node('a', 'shortcut-open', '↗');
      open.href = href;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.setAttribute('aria-label', 'Ouvrir ' + item.name);
      const remove = node('button', 'shortcut-remove', '×');
      remove.type = 'button';
      remove.setAttribute('aria-label', 'Supprimer ' + item.name);
      remove.addEventListener('click', () => {
        const updated = shortcuts();
        updated.splice(index, 1);
        save(STORAGE_SHORTCUTS, updated);
        renderShortcuts();
        toast('Raccourci supprimé');
      });
      row.append(initial, info, open, remove);
      host.appendChild(row);
    });
  }
  function installationInstructions() {
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (ios) return '<h3>iPhone / Safari</h3><ol><li>Ouvrez le site dans Safari.</li><li>Appuyez sur <strong>Partager</strong>.</li><li>Choisissez <strong>Sur l’écran d’accueil</strong> puis <strong>Ajouter</strong>.</li></ol>';
    if (/Android/.test(navigator.userAgent)) return '<h3>Android / Chrome</h3><ol><li>Ouvrez le site dans Chrome.</li><li>Appuyez sur le menu <strong>⋮</strong>.</li><li>Choisissez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.</li></ol>';
    return '<h3>Sur ordinateur</h3><ol><li>Ouvrez City Hub dans Chrome ou Edge.</li><li>Utilisez l’option <strong>Installer</strong> du navigateur.</li></ol>';
  }
  function setup() {
    changeTheme(stored(STORAGE_THEME, 'light') === 'dark');
    renderApps();
    renderShortcuts();
    $('#themeToggle').addEventListener('click', () => changeTheme(document.documentElement.dataset.theme !== 'dark'));
    document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => $('#' + btn.dataset.close).close()));
    document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
    $('#addShortcutButton').addEventListener('click', () => $('#shortcutDialog').showModal());
    $('#shortcutForm').addEventListener('submit', event => {
      event.preventDefault();
      const name = $('#shortcutName').value.trim();
      let raw = $('#shortcutUrl').value.trim();
      if (raw && !/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
      const url = allowedURL(raw);
      if (!name || !url) return toast('Indiquez un nom et une adresse valide.');
      const items = shortcuts();
      if (items.length >= 12) return toast('Maximum 12 raccourcis.');
      items.push({name: name.slice(0, 45), url});
      save(STORAGE_SHORTCUTS, items);
      renderShortcuts();
      $('#shortcutDialog').close();
      $('#shortcutForm').reset();
      toast('Raccourci ajouté !');
    });
    $('#installButton').addEventListener('click', async () => {
      if (deferredPrompt) {
        const p = deferredPrompt;
        deferredPrompt = null;
        try { await p.prompt(); await p.userChoice; return; } catch {}
      }
      $('#installInstructions').innerHTML = installationInstructions();
      $('#installDialog').showModal();
    });
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; });
    window.addEventListener('appinstalled', () => { deferredPrompt = null; toast('City Hub installé !'); });
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
    }
  }
  setup();
})();
