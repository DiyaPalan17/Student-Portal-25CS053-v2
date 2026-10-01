/**
 * Student Hub - Students Directory Module
 * Fetch API, Dynamic Table Rendering, Multi-criteria Filters, Sort, and Pagination
 */

let allStudents = [];
let currentPage = 1;
const itemsPerPage = 8;

export async function loadStudents() {
  const tableBody = document.getElementById('studentTableBody');
  const countBadge = document.getElementById('studentCountBadge');
  if (!tableBody) return;

  tableBody.innerHTML = `
    <tr>
      <td colspan="7" class="state-box">
        <div class="state-spinner"></div>
        <div class="state-title" style="margin-top:12px">Loading students...</div>
        <div class="state-desc">Fetching directory records from <code>data/students.json</code>.</div>
      </td>
    </tr>
  `;

  try {
    const res = await fetch('data/students.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    allStudents = await res.json();

    if (!Array.isArray(allStudents) || !allStudents.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="state-box">
            <div class="state-title">No Students Found</div>
            <div class="state-desc">The student directory contains no records.</div>
          </td>
        </tr>
      `;
      return;
    }

    currentPage = 1;
    renderFilteredStudents();
  } catch (err) {
    console.error('Students Fetch Error:', err);
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="state-box">
          <div style="font-size:2.2rem">⚠️</div>
          <div class="state-title">Failed to load student data</div>
          <div class="state-desc">${err.message || 'Error reading data/students.json.'}</div>
          <button id="retryStudentsBtn" class="btn btn-secondary btn-sm" style="margin-top:12px">🔄 Retry Loading</button>
        </td>
      </tr>
    `;

    document.getElementById('retryStudentsBtn')?.addEventListener('click', () => {
      loadStudents();
    });

    if (window.showToast) {
      window.showToast('Unable to load student directory. Ensure server is active.', 'error');
    }
  }
}

export function renderFilteredStudents() {
  const tableBody = document.getElementById('studentTableBody');
  const countBadge = document.getElementById('studentCountBadge');
  const searchInput = document.getElementById('studentSearch');
  const courseFilter = document.getElementById('studentCourseFilter');
  const yearFilter = document.getElementById('studentYearFilter');
  const attendanceFilter = document.getElementById('studentAttendanceFilter');
  const sortSelect = document.getElementById('studentSort');
  const paginationWrap = document.getElementById('studentPagination');

  if (!tableBody) return;

  let filtered = [...allStudents];

  // 1. Search Query
  const query = (searchInput?.value || '').trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(st =>
      (st.name && st.name.toLowerCase().includes(query)) ||
      (st.email && st.email.toLowerCase().includes(query)) ||
      (st.division && st.division.toLowerCase().includes(query))
    );
  }

  // 2. Course Filter
  const selectedCourse = courseFilter?.value || 'all';
  if (selectedCourse !== 'all') {
    filtered = filtered.filter(st => st.course === selectedCourse);
  }

  // 3. Year Filter
  const selectedYear = yearFilter?.value || 'all';
  if (selectedYear !== 'all') {
    filtered = filtered.filter(st => st.year === selectedYear);
  }

  // 4. Attendance Filter
  const selectedAtt = attendanceFilter?.value || 'all';
  if (selectedAtt !== 'all') {
    filtered = filtered.filter(st => {
      const num = parseInt(st.attendance, 10) || 0;
      if (selectedAtt === '90plus') return num >= 90;
      if (selectedAtt === '80to89') return num >= 80 && num < 90;
      if (selectedAtt === '75to79') return num >= 75 && num < 80;
      if (selectedAtt === 'below75') return num < 75;
      return true;
    });
  }

  // 5. Sorting
  const sortOption = sortSelect?.value || 'name-asc';
  filtered.sort((a, b) => {
    if (sortOption === 'name-asc') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortOption === 'name-desc') {
      return (b.name || '').localeCompare(a.name || '');
    } else if (sortOption === 'att-desc') {
      return (parseInt(b.attendance, 10) || 0) - (parseInt(a.attendance, 10) || 0);
    } else if (sortOption === 'att-asc') {
      return (parseInt(a.attendance, 10) || 0) - (parseInt(b.attendance, 10) || 0);
    }
    return 0;
  });

  // Update Badge
  if (countBadge) {
    countBadge.textContent = `${filtered.length} student${filtered.length === 1 ? '' : 's'}`;
  }

  // 6. Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  if (!paginated.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="state-box">
          <div class="state-title">No matching students found</div>
          <div class="state-desc">Try resetting your search filters to view records.</div>
        </td>
      </tr>
    `;
    if (paginationWrap) paginationWrap.innerHTML = '';
    return;
  }

  // Render Rows
  tableBody.innerHTML = paginated.map(st => {
    const attNum = parseInt(st.attendance, 10) || 0;
    const badgeClass = attNum >= 85 ? 'badge-success' : attNum >= 75 ? 'badge-warning' : 'badge-danger';

    return `
      <tr>
        <td><strong>#${st.id}</strong></td>
        <td>
          <div style="display:flex; align-items:center; gap:10px">
            <span style="width:32px; height:32px; border-radius:50%; background:var(--surface-variant); color:var(--primary-color); display:grid; place-items:center; font-weight:700; font-size:0.85rem">
              ${(st.name || 'S').charAt(0)}
            </span>
            <span>${st.name}</span>
          </div>
        </td>
        <td><a href="mailto:${st.email}" style="color:var(--primary-color)">${st.email}</a></td>
        <td>${st.course}</td>
        <td>${st.year}</td>
        <td><span class="badge badge-info">${st.division}</span></td>
        <td><span class="badge ${badgeClass}">${st.attendance}</span></td>
      </tr>
    `;
  }).join('');

  // Render pagination
  renderPagination(paginationWrap, totalPages, currentPage, (newPage) => {
    currentPage = newPage;
    renderFilteredStudents();
  });
}

function renderPagination(wrap, totalPages, current, onPageChange) {
  if (!wrap) return;
  if (totalPages <= 1) {
    wrap.innerHTML = '';
    return;
  }

  wrap.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerHTML = '‹ Prev';
  prevBtn.disabled = current === 1;
  prevBtn.addEventListener('click', () => onPageChange(current - 1));
  wrap.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const numBtn = document.createElement('button');
    numBtn.className = `page-btn ${i === current ? 'active' : ''}`;
    numBtn.textContent = i;
    numBtn.addEventListener('click', () => onPageChange(i));
    wrap.appendChild(numBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.innerHTML = 'Next ›';
  nextBtn.disabled = current === totalPages;
  nextBtn.addEventListener('click', () => onPageChange(current + 1));
  wrap.appendChild(nextBtn);
}

export function initStudentsModule() {
  const searchInput = document.getElementById('studentSearch');
  const courseFilter = document.getElementById('studentCourseFilter');
  const yearFilter = document.getElementById('studentYearFilter');
  const attendanceFilter = document.getElementById('studentAttendanceFilter');
  const sortSelect = document.getElementById('studentSort');

  const update = () => {
    currentPage = 1;
    renderFilteredStudents();
  };

  searchInput?.addEventListener('input', update);
  courseFilter?.addEventListener('change', update);
  yearFilter?.addEventListener('change', update);
  attendanceFilter?.addEventListener('change', update);
  sortSelect?.addEventListener('change', update);

  loadStudents();
}
