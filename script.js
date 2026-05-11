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
});
