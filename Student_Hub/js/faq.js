/**
 * Student Hub - FAQ Module
 * Fetches data/faqs.json dynamically via Fetch API, provides loading and error states,
 * and renders an accessible accordion.
 */

export async function loadFaqs() {
  const container = document.getElementById('faqAccordion');
  if (!container) return;

  // Render loading state
  container.innerHTML = `
    <div class="state-box">
      <div class="state-spinner"></div>
      <div class="state-title">Loading FAQs...</div>
      <div class="state-desc">Fetching questions and answers from <code>data/faqs.json</code>.</div>
    </div>
  `;

  try {
    const response = await fetch('data/faqs.json');
    if (!response.ok) {
      throw new Error(`Failed to load FAQs: HTTP ${response.status}`);
    }
    const faqs = await response.json();

    if (!Array.isArray(faqs) || faqs.length === 0) {
      container.innerHTML = `
        <div class="state-box">
          <div class="state-title">No FAQs Available</div>
          <div class="state-desc">Check back later for updated academic questions.</div>
        </div>
      `;
      return;
    }

    renderFaqs(container, faqs);
  } catch (error) {
    console.error('FAQ Fetch Error:', error);
    container.innerHTML = `
      <div class="state-box">
        <div style="font-size:2.5rem">⚠️</div>
        <div class="state-title">Unable to load FAQs</div>
        <div class="state-desc">${error.message || 'Please check your local web server configuration and try again.'}</div>
        <button id="retryFaqBtn" class="btn btn-secondary btn-sm" style="margin-top:12px">🔄 Retry Loading</button>
      </div>
    `;

    document.getElementById('retryFaqBtn')?.addEventListener('click', () => {
      loadFaqs();
    });

    if (window.showToast) {
      window.showToast('Could not load FAQ records. Run the project with Live Server.', 'error');
    }
  }
}

function renderFaqs(container, faqs) {
  container.innerHTML = '';

  faqs.forEach((faq, index) => {
    const item = document.createElement('article');
    item.className = 'faq-item';
    item.id = `faq-${faq.id || index + 1}`;

    const contentId = `faq-content-${faq.id || index + 1}`;
    const buttonId = `faq-btn-${faq.id || index + 1}`;

    item.innerHTML = `
      <button id="${buttonId}" class="faq-header" aria-expanded="false" aria-controls="${contentId}">
        <span>${faq.question}</span>
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div id="${contentId}" class="faq-content" role="region" aria-labelledby="${buttonId}">
        <p>${faq.answer}</p>
        ${faq.category ? `<span class="badge badge-primary" style="margin-top:10px">${faq.category}</span>` : ''}
      </div>
    `;

    const button = item.querySelector('.faq-header');
    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Toggle this item
      item.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });

    container.appendChild(item);
  });
}

export function initFaqModule() {
  loadFaqs();
}
