/**
 * Student Hub - Main Application Orchestrator
 * Bootstraps theme, authentication, navigation, and page-specific controllers
 */

import { initTheme } from './theme.js';
import { initAuth, getCurrentUser, setCurrentUser, logout } from './auth.js';
import { initHamburgerMenu, initModals, initSlider, initNotificationBanner, showToast } from './components.js';
import { initRegistrationValidation, initLoginValidation } from './validation.js';
import { initFaqModule } from './faq.js';
import { initEventsModule } from './events.js';
import { initStudentsModule } from './students.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize core system modules
  initTheme();
  initAuth();
  initHamburgerMenu();
  initModals();
  initNotificationBanner();

  // 2. Set dynamic current year in footer
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // 3. Initialize slider if present
  if (document.querySelector('.slider-container')) {
    initSlider();
  }

  // 4. Initialize FAQ if present (Landing page)
  if (document.getElementById('faqAccordion')) {
    initFaqModule();
  }

  // 5. Initialize Registration validation if present
  if (document.getElementById('registerForm')) {
    initRegistrationValidation();
  }

  // 6. Initialize Login validation if present
  if (document.getElementById('loginForm')) {
    initLoginValidation();
  }

  // 7. Initialize Events module if present
  if (document.getElementById('eventsContainer')) {
    initEventsModule();
  }

  // 8. Initialize Students module if present
  if (document.getElementById('studentTableBody')) {
    initStudentsModule();
  }

  // 9. Profile Page Controller (Editable Profile saved to localStorage)
  const profileForm = document.getElementById('profileEditForm');
  if (profileForm) {
    const user = getCurrentUser();
    const nameInput = document.getElementById('profName');
    const emailInput = document.getElementById('profEmail');
    const mobileInput = document.getElementById('profMobile');
    const bioInput = document.getElementById('profBio');
    const courseSelect = document.getElementById('profCourse');
    const yearSelect = document.getElementById('profYear');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (mobileInput) mobileInput.value = user.mobile || '';
    if (bioInput) bioInput.value = user.bio || '';
    if (courseSelect) courseSelect.value = user.course || 'B.Tech Computer Engineering';
    if (yearSelect) yearSelect.value = user.year || '2nd Year';

    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        name: nameInput?.value.trim() || user.name,
        email: emailInput?.value.trim() || user.email,
        mobile: mobileInput?.value.trim() || user.mobile,
        bio: bioInput?.value.trim() || user.bio,
        course: courseSelect?.value || user.course,
        year: yearSelect?.value || user.year
      };
      setCurrentUser(updated);
      showToast('🎉 Profile updated and saved to localStorage!', 'success');
    });
  }

  // 10. Generic Demo Actions (for buttons like Pay Fees Demo, Submit Demo, etc.)
  document.querySelectorAll('[data-demo-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = btn.getAttribute('data-demo-action') || 'Action completed successfully!';
      const type = btn.getAttribute('data-demo-type') || 'success';
      showToast(msg, type);
    });
  });
});
