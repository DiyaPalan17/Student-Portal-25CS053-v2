/**
 * Student Hub - Events Module
 * Dynamic cards, Fetch API, Search, Category Filter, Sorting, Pagination & Modal
 */

import { openModal } from './components.js';

let allEvents = [];
let currentPage = 1;
const itemsPerPage = 6;

export async function loadEvents() {
  const container = document.getElementById('eventsContainer');
  const countBadge = document.getElementById('eventCountBadge');
  if (!container) return;

  container.innerHTML = `
    <div class="state-box" style="grid-column: 1 / -1">
      <div class="state-spinner"></div>
      <div class="state-title">Loading campus events...</div>
      <div class="state-desc">Fetching upcoming activities from <code>data/events.json</code>.</div>
    </div>
  `;

  try {
    const res = await fetch('data/events.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    allEvents = await res.json();

    if (!Array.isArray(allEvents) || !allEvents.length) {
      container.innerHTML = `
        <div class="state-box" style="grid-column: 1 / -1">
          <div class="state-title">No Events Scheduled</div>
          <div class="state-desc">No active events found in the database.</div>
        </div>
      `;
      return;
    }

    // Populate category dropdown dynamically if exists
    populateCategories(allEvents);
    currentPage = 1;
    renderFilteredEvents();
  } catch (err) {
    console.error('Events Fetch Error:', err);
    container.innerHTML = `
      <div class="state-box" style="grid-column: 1 / -1">
        <div style="font-size:2.5rem">⚠️</div>
        <div class="state-title">Unable to load events</div>
        <div class="state-desc">${err.message || 'Error communicating with data/events.json.'}</div>
        <button id="retryEventsBtn" class="btn btn-secondary btn-sm" style="margin-top:12px">🔄 Retry Loading</button>
      </div>
    `;

    document.getElementById('retryEventsBtn')?.addEventListener('click', () => {
      loadEvents();
    });

    if (window.showToast) {
      window.showToast('Failed to load events. Run via local server.', 'error');
    }
  }
}

function populateCategories(events) {
  const filterSelect = document.getElementById('eventCategoryFilter');
  if (!filterSelect) return;

  const categories = [...new Set(events.map(e => e.category).filter(Boolean))];
  const currentVal = filterSelect.value;
  filterSelect.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filterSelect.appendChild(opt);
  });
  if (currentVal && categories.includes(currentVal)) {
    filterSelect.value = currentVal;
  }
}

export function renderFilteredEvents() {
  const container = document.getElementById('eventsContainer');
  const countBadge = document.getElementById('eventCountBadge');
  const searchInput = document.getElementById('eventSearch');
  const categoryFilter = document.getElementById('eventCategoryFilter');
  const sortSelect = document.getElementById('eventSort');
  const paginationWrap = document.getElementById('eventPagination');

  if (!container) return;

  let filtered = [...allEvents];

  // 1. Search Query
  const query = (searchInput?.value || '').trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(item => 
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.location && item.location.toLowerCase().includes(query))
    );
  }

  // 2. Category Filter
  const selectedCat = categoryFilter?.value || 'all';
  if (selectedCat !== 'all') {
    filtered = filtered.filter(item => item.category && item.category.toLowerCase() === selectedCat.toLowerCase());
  }

  // 3. Sorting
  const sortOption = sortSelect?.value || 'date-asc';
  filtered.sort((a, b) => {
    if (sortOption === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOption === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOption === 'title-asc') {
      return (a.title || '').localeCompare(b.title || '');
    } else if (sortOption === 'title-desc') {
      return (b.title || '').localeCompare(a.title || '');
    }
    return 0;
  });

  // Update Count
  if (countBadge) {
    countBadge.textContent = `${filtered.length} event${filtered.length === 1 ? '' : 's'}`;
  }

  // 4. Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  if (!paginated.length) {
    container.innerHTML = `
      <div class="state-box" style="grid-column: 1 / -1">
        <div class="state-title">No Matching Events Found</div>
        <div class="state-desc">Try clearing your search query or choosing another category filter.</div>
      </div>
    `;
    if (paginationWrap) paginationWrap.innerHTML = '';
    return;
  }

  // Render cards
  container.innerHTML = paginated.map(ev => `
    <article class="card event-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px">
        <span class="event-date-badge">📅 ${formatDate(ev.date)}</span>
        <span class="badge ${getCategoryBadgeClass(ev.category)}">${ev.category || 'General'}</span>
      </div>
      <div>
        <h3 class="event-title">${ev.title}</h3>
        <p class="section-sub" style="margin-top:6px; font-size:0.92rem; line-height:1.5">${ev.description}</p>
      </div>
      <div class="event-meta">
        <div class="event-meta-item">
          <span>📍</span>
          <span>${ev.location || 'CHARUSAT Campus'}</span>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm view-event-btn" data-event-id="${ev.id}">
        View Full Details →
      </button>
    </article>
  `).join('');

  // Attach modal detail clicks
  container.querySelectorAll('.view-event-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-event-id'), 10);
      const ev = allEvents.find(e => e.id === id);
      if (ev) showEventModal(ev);
    });
  });

  // Render Pagination controls
  renderPagination(paginationWrap, totalPages, currentPage, (newPage) => {
    currentPage = newPage;
    renderFilteredEvents();
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function showEventModal(event) {
  const modal = document.getElementById('eventDetailsModal');
  if (!modal) return;

  const modalTitle = document.getElementById('modalEventTitle');
  const modalDate = document.getElementById('modalEventDate');
  const modalCategory = document.getElementById('modalEventCategory');
  const modalVenue = document.getElementById('modalEventVenue');
  const modalDesc = document.getElementById('modalEventDesc');

  if (modalTitle) modalTitle.textContent = event.title;
  if (modalDate) modalDate.textContent = formatDate(event.date);
  if (modalCategory) modalCategory.textContent = event.category;
  if (modalVenue) modalVenue.textContent = event.location || 'CHARUSAT Campus';
  if (modalDesc) modalDesc.textContent = event.description;

  openModal('eventDetailsModal');
}

function formatDate(dateStr) {
  if (!dateStr) return 'TBA';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function getCategoryBadgeClass(category) {
  switch (category?.toLowerCase()) {
    case 'technical': return 'badge-primary';
    case 'workshop': return 'badge-info';
    case 'sports': return 'badge-warning';
    case 'cultural': return 'badge-success';
    default: return 'badge-secondary';
  }
}

function renderPagination(wrap, totalPages, current, onPageChange) {
  if (!wrap) return;
  if (totalPages <= 1) {
    wrap.innerHTML = '';
    return;
  }

  wrap.innerHTML = '';

  // Previous Button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerHTML = '‹ Prev';
  prevBtn.disabled = current === 1;
  prevBtn.addEventListener('click', () => onPageChange(current - 1));
  wrap.appendChild(prevBtn);

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const numBtn = document.createElement('button');
    numBtn.className = `page-btn ${i === current ? 'active' : ''}`;
    numBtn.textContent = i;
    numBtn.addEventListener('click', () => onPageChange(i));
    wrap.appendChild(numBtn);
  }

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.innerHTML = 'Next ›';
  nextBtn.disabled = current === totalPages;
  nextBtn.addEventListener('click', () => onPageChange(current + 1));
  wrap.appendChild(nextBtn);
}

export function initEventsModule() {
  const searchInput = document.getElementById('eventSearch');
  const categoryFilter = document.getElementById('eventCategoryFilter');
  const sortSelect = document.getElementById('eventSort');

  searchInput?.addEventListener('input', () => {
    currentPage = 1;
    renderFilteredEvents();
  });

  categoryFilter?.addEventListener('change', () => {
    currentPage = 1;
    renderFilteredEvents();
  });

  sortSelect?.addEventListener('change', () => {
    currentPage = 1;
    renderFilteredEvents();
  });

  loadEvents();
}
