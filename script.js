// Simple dark/light mode toggle with localStorage remember
window.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const modeToggle = document.getElementById('modeToggle');
  const modeIcon = document.getElementById('modeIcon');

  const savedMode = localStorage.getItem('complete-theme');
  if (savedMode === 'light') {
    body.classList.add('light');
    modeIcon.textContent = '○'; // light
  } else {
    body.classList.remove('light');
    modeIcon.textContent = '●'; // dark
  }

  modeToggle.addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    localStorage.setItem('complete-theme', isLight ? 'light' : 'dark');
    modeIcon.textContent = isLight ? '○' : '●';
  });

  // --- Apps + Admin logic ---

  const appsGrid = document.getElementById('appsGrid');
  const adminPanel = document.getElementById('adminPanel');
  const adminLoginSection = document.getElementById('adminLoginSection');
  const adminPasswordInput = document.getElementById('adminPassword');
  const adminLoginButton = document.getElementById('adminLoginButton');
  const saveAppButton = document.getElementById('saveApp');

  const appNameInput = document.getElementById('appName');
  const appDescriptionInput = document.getElementById('appDescription');
  const appLinkInput = document.getElementById('appLink');
  const appWipInput = document.getElementById('appWip');

  // Change this to whatever password you want
  const ADMIN_PASSWORD = 'your-admin-password';

  // Load apps from localStorage
  function loadApps() {
    const raw = localStorage.getItem('complete-apps');
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // Save apps to localStorage
  function saveApps(apps) {
    localStorage.setItem('complete-apps', JSON.stringify(apps));
  }

  // Render apps into the grid
  function renderApps() {
    const apps = loadApps();
    appsGrid.innerHTML = '';

    apps.forEach(app => {
      const card = document.createElement('article');
      card.className = 'product-card';

      const content = document.createElement('div');
      content.className = 'product-content';

      if (app.wip) {
        const badge = document.createElement('span');
        badge.className = 'status-badge';
        badge.textContent = 'Work in progress';
        card.appendChild(badge);
      }

      const title = document.createElement('h2');
      title.className = 'product-name';
      title.textContent = app.name;

      const desc = document.createElement('p');
      desc.className = 'product-text';
      desc.textContent = app.description;

      content.appendChild(title);
      content.appendChild(desc);
      card.appendChild(content);

      if (app.link) {
        const link = document.createElement('a');
        link.className = 'product-link';
        link.href = app.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = `Open ${app.name} →`;
        card.appendChild(link);
      }

      appsGrid.appendChild(card);
    });
  }

  // Seed initial apps (Planner + Calendar) once if there is nothing
  function seedDefaultApps() {
    const existing = loadApps();
    if (existing.length > 0) return;

    const defaults = [
      {
        name: 'Complete Planner',
        description: 'A simple planner in your browser. Add homework, sort it by class, and quickly see what’s coming up and what’s late.',
        link: 'https://completeapps.github.io/planner/',
        wip: true
      },
      {
        name: 'Complete Calendar',
        description: 'A calendar that pulls from the Complete Planner and drops your tasks onto a monthly view, so you can spot busy days and lighter ones fast.',
        link: 'https://completeapps.github.io/calendar/',
        wip: true
      }
    ];

    saveApps(defaults);
  }

  // Handle admin login
  adminLoginButton.addEventListener('click', () => {
    const input = adminPasswordInput.value;
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem('complete-is-admin', 'true');
      adminLoginSection.style.display = 'none';
      adminPanel.style.display = 'block';
    } else {
      alert('Incorrect password');
    }
  });

  // If already logged in in this session, show admin panel
  if (sessionStorage.getItem('complete-is-admin') === 'true') {
    adminLoginSection.style.display = 'none';
    adminPanel.style.display = 'block';
  } else {
    adminPanel.style.display = 'none';
    adminLoginSection.style.display = 'block';
  }

  // Handle adding a new app
  saveAppButton.addEventListener('click', () => {
    const name = appNameInput.value.trim();
    const description = appDescriptionInput.value.trim();
    const link = appLinkInput.value.trim();
    const wip = appWipInput.checked;

    if (!name || !description) {
      alert('Name and description are required.');
      return;
    }

    const apps = loadApps();
    apps.push({ name, description, link, wip });
    saveApps(apps);

    // Clear inputs
    appNameInput.value = '';
    appDescriptionInput.value = '';
    appLinkInput.value = '';
    appWipInput.checked = false;

    renderApps();
  });

  // Initial load
  seedDefaultApps();
  renderApps();
});
