# 🎓 Student Hub — Interactive Multi-Page Academic Portal

A modern, responsive, and interactive multi-page Student Academic Portal built with **pure HTML5, CSS3, Vanilla ES6 JavaScript, Fetch API, and localStorage**.

Designed with a **lavender/purple visual identity**, featuring unified **Light & Dark theme persistence**, dynamic JSON data loading, regex form validation, live password strength scoring, accessible modal dialogs, interactive sliders, search/filter/sorting/pagination, and a responsive slide-out hamburger navigation drawer.

---

## 🚀 User Flow

```
Information / Landing Page (index.html)
     │
     ├── Login (login.html) ──────────┐
     └── Register (register.html) ────┴──► Home / Dashboard (home.html)
                                                │
                                                ├── ☰ Responsive Hamburger Menu
                                                ├── 📊 Attendance (attendance.html)
                                                ├── 📝 Assignments (assignments.html)
                                                ├── 📅 Campus Events (events.html)
                                                ├── 💳 Fees (fees.html)
                                                ├── 🎯 Results & Grades (results.html)
                                                ├── 🗓 Timetable (timetable.html)
                                                ├── 👥 Student Directory (students.html)
                                                ├── 👤 My Profile (profile.html)
                                                ├── 📚 Learning Hub (learning.html)
                                                └── 🚪 Logout (Clears session -> index.html)
```

---

## 🌟 Key Features & Requirements Demonstrated

### 1. Landing & Information Page (`index.html`)
- Professional intro with Student Hub brand, About, Features, and Preview.
- Hero section with gradient text, floating shapes, and call-to-action buttons.
- 8 feature cards covering all academic modules with custom iconography.
- Interactive content slider with previous/next controls, dot indicators, and autoplay.
- Dynamic FAQ accordion queried via Fetch API from `data/faqs.json`.

### 2. Registration Page & Validation (`register.html`)
- Fields: Full Name, Student Email, 10-digit Indian Mobile Number, Password, Confirm Password, Course, Year, Gender, Terms & Conditions checkbox.
- **JavaScript & RegEx Validation**:
  - Name: Letters and spaces only (2–50 characters).
  - Email: Standard RFC email format.
  - Mobile: Valid 10-digit Indian numbers starting with 6, 7, 8, or 9.
  - Password: Strong password check (min 8 chars, uppercase, lowercase, digit, special symbol).
  - Confirm Password: Strict equality check.
  - Dropdowns & Radios: Mandatory selection validation.
  - Terms: Required checkbox.
- **Live Password Strength Meter**:
  - Dynamic score bar (Weak, Medium, Strong).
  - Interactive checklist updating 5 criteria in real-time.
- Accessible inline error messages with `aria-live` and `aria-invalid`.
- Registration success modal with one-click redirect to login.

### 3. Login Page & Protection (`login.html`)
- Email & password validation with remember-me state.
- Demo prefilled credentials:
  - **Email:** `25cs053@charusat.edu.in`
  - **Password:** `Charusat@2026`
- Forgot password modal popup with guidance.
- Sets authentication token in `localStorage` and redirects to `home.html`.
- Protected routes redirect unauthenticated users back to login automatically.

### 4. Home Dashboard (`home.html`)
- Personalized welcome greeting reading student name from `localStorage`.
- 4 clickable summary stat cards (Attendance 88%, 4 Assignments, 16 Events, ₹12k Fee due).
- Dismissible notification banner with session persistence.
- Interactive news slider.
- Quick access module cards linking to all portal pages.
- "Portal Guide" accessible modal dialog.

### 5. Responsive Hamburger Drawer Navigation
- Top navigation bar featuring menu toggle (☰) on mobile and responsive screens.
- Smooth CSS transform drawer animation with backdrop overlay.
- Keyboard accessible (closes on `Escape`, focus management).
- Links to all 11 pages with zero `href="#"` placeholders.
- Active page link indicator.

### 6. Light & Dark Mode
- Centralized theme controller (`js/theme.js`) storing state in `localStorage`.
- Custom CSS properties for lavender light mode and deep midnight purple dark mode.
- Theme choice seamlessly persists across all page navigations and reloads.

### 7. Fetch API & Dynamic JSON Datasets (`data/`)
- `data/events.json`: 16 detailed events with ID, title, date, category, location, and description.
- `data/students.json`: 16 student records with ID, name, email, course, year, division, and attendance.
- `data/faqs.json`: 16 FAQ records with ID, question, answer, and category.
- Full loading spinners, empty states, and error handling with retry buttons.

### 8. Events Page (`events.html`)
- Dynamic event cards rendered via DOM manipulation.
- Live keyword search across title, description, and venue.
- Category filtering (Technical, Workshop, Seminar, Cultural, Sports).
- Sorting by upcoming date, latest date, title A-Z, title Z-A.
- Client-side pagination (6 events per page).
- Accessible event detail modal dialog.

### 9. Students Directory (`students.html`)
- Dynamic table rendering.
- Multi-criteria filtering: Course, Year, and Attendance tier (>=90%, 80-89%, 75-79%, <75%).
- Search by name or email.
- Sorting by Name (A-Z, Z-A) and Attendance rate (High-to-Low, Low-to-High).
- Pagination controls with active page buttons.

### 10. Academics & Tools
- **Attendance (`attendance.html`):** Subject-by-subject percentage progress bars, cutoff alerts (<75%), and filter.
- **Assignments (`assignments.html`):** Filter by subject and status, search, and "View Details" submission modal.
- **Fees (`fees.html`):** Semester breakdown, installment schedule, and demo payment gateway modal.
- **Results (`results.html`):** Semester 3 transcript, credit calculation, and interactive SGPA Target Simulator.
- **Timetable (`timetable.html`):** Daily tabbed schedule and full weekly matrix.
- **Profile (`profile.html`):** Editable student profile saved to `localStorage` with live reflection across the portal.
- **Learning Hub (`learning.html`):** Curated study resources (Coursera, MDN, GitHub) with interactive bookmark toggles.

---

## 📁 Project Directory Structure

```text
Student_Hub/
│
├── index.html            # Landing / Information page (public)
├── login.html            # Student Login page
├── register.html         # Student Registration page (alias: registration.html)
├── home.html             # Student Dashboard (alias: deskboard.html)
├── attendance.html       # Attendance tracking module
├── assignments.html      # Assignments tracker (alias: assignment.html)
├── events.html           # Dynamic Campus Events (Fetch API)
├── fees.html             # Fee payment & installment schedule
├── results.html          # Academic results & SGPA simulator (alias: result.html)
├── timetable.html        # Class schedule matrix (alias: time_table.html)
├── students.html         # Student Directory (Fetch API)
├── profile.html          # Student profile & settings
├── learning.html         # Curated learning resources (alias: coursera.html)
│
├── css/
│   └── style.css         # Centralized lavender design system & variables
├── style.css             # Root stylesheet proxy
│
├── js/
│   ├── app.js            # Master orchestrator & bootstrapper
│   ├── auth.js           # Session manager, route protection & logout
│   ├── theme.js          # Light & Dark theme toggle with localStorage
│   ├── validation.js     # Form validation & password strength meter
│   ├── components.js     # Hamburger drawer, modals, slider, toast, banner
│   ├── faq.js            # Dynamic FAQ loader & accordion
│   ├── events.js         # Dynamic Events search, filter, sort & pagination
│   └── students.js       # Dynamic Student directory table controller
├── app.js                # Root proxy script
│
├── data/
│   ├── events.json       # 16 realistic campus event records
│   ├── students.json     # 16 student directory records
│   └── faqs.json         # 16 academic FAQ records
│
└── assets/
    └── images/           # Campus and student avatars (student.jpg, hub.jpg)
```

---

## 💻 How to Run the Project

Due to browser security policies protecting the **Fetch API** (`fetch("data/*.json")`), the project should be served through a local web server rather than double-clicking HTML files via `file://`.

### Option 1: VS Code Live Server (Recommended)
1. Open the `Student_Hub` folder in **Visual Studio Code**.
2. Right-click `index.html` and click **"Open with Live Server"**.
3. The portal will open in your browser at `http://127.0.0.1:5500/index.html`.

### Option 2: Python Built-in HTTP Server
Open PowerShell / Terminal inside the `Student_Hub` directory and run:
```bash
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000/index.html`.

### Option 3: Node.js `npx serve`
```bash
npx serve .
```

---

## 👩‍💻 Student Information
- **Name:** Diya Palan
- **Enrolment Number:** 25CS053
- **Institution:** CSPIT, CHARUSAT University
- **Program:** B.Tech Computer Engineering (2nd Year)
