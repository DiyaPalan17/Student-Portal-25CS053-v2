/**
 * Student Hub - Authentication & Session Manager
 * Handles login state, user profiles, route protection, and logout flow
 */

const AUTH_KEY = 'studenthub_auth';
const USER_KEY = 'studenthub_user';

export const DEFAULT_USER = {
  name: 'Diya Palan',
  email: '25cs053@charusat.edu.in',
  mobile: '9876543210',
  course: 'B.Tech Computer Engineering',
  year: '2nd Year',
  division: 'CE-A',
  enrollmentNo: '25CS053',
  gender: 'Female',
  bio: 'Second-year Computer Engineering student passionate about web development, UI systems, and algorithmic problem solving.',
  avatar: 'student.jpg'
};

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return { ...DEFAULT_USER };
    return { ...DEFAULT_USER, ...JSON.parse(raw) };
  } catch (e) {
    return { ...DEFAULT_USER };
  }
}

export function setCurrentUser(user) {
  const updated = { ...getCurrentUser(), ...user };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  renderUserElements();
  return updated;
}

export function setAuthenticated(isAuth = true, user = null) {
  if (isAuth) {
    localStorage.setItem(AUTH_KEY, 'true');
    if (user) {
      setCurrentUser(user);
    }
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function logout() {
  setAuthenticated(false);
  if (window.showToast) {
    window.showToast('🚪 Logged out successfully. Redirecting...', 'info');
  }
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

export function requireAuth() {
  const isProtected = document.body.hasAttribute('data-protected') || 
                      document.body.getAttribute('data-protected') === 'true';
  if (isProtected && !isAuthenticated()) {
    // Save intended destination
    sessionStorage.setItem('redirect_after_login', window.location.pathname);
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

export function renderUserElements() {
  const user = getCurrentUser();
  document.querySelectorAll('[data-student-name]').forEach(el => {
    el.textContent = user.name || 'Student';
  });
  document.querySelectorAll('[data-student-email]').forEach(el => {
    el.textContent = user.email || 'student@charusat.edu.in';
  });
  document.querySelectorAll('[data-student-course]').forEach(el => {
    el.textContent = user.course || 'B.Tech Computer Engineering';
  });
  document.querySelectorAll('[data-student-year]').forEach(el => {
    el.textContent = user.year || '2nd Year';
  });
  document.querySelectorAll('[data-student-division]').forEach(el => {
    el.textContent = user.division || 'CE-A';
  });
  document.querySelectorAll('[data-student-enrollment]').forEach(el => {
    el.textContent = user.enrollmentNo || '25CS053';
  });
}

export function initAuth() {
  // Check protection
  if (!requireAuth()) return;

  // Render current student info
  renderUserElements();

  // Attach logout handlers
  document.querySelectorAll('.logout-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  });
}
