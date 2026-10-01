/**
 * Student Hub - Theme Manager (Lavender Light & Dark Mode)
 * Persists theme state across all pages via localStorage
 */

const THEME_KEY = 'studenthub_theme';

export function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  document.body.classList.toggle('dark-mode', isDark);

  // Update all theme toggle buttons across the page
  const buttons = document.querySelectorAll('.theme-toggle-btn');
  buttons.forEach(btn => {
    btn.innerHTML = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });
}

export function getSavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  // Check OS system preference if none saved
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function toggleTheme(showToastNotification = true) {
  const current = document.documentElement.getAttribute('data-theme') || getSavedTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);

  if (showToastNotification && window.showToast) {
    window.showToast(`${next === 'dark' ? '🌙 Dark' : '☀️ Light'} mode enabled`, 'info');
  }
  return next;
}

export function initTheme() {
  const theme = getSavedTheme();
  applyTheme(theme);

  // Attach click listeners to all theme toggle buttons
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme(true);
    });
  });
}

// Auto-run immediately to prevent flash of unstyled theme
(() => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();
