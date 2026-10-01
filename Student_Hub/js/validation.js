/**
 * Student Hub - Form Validation & Password Strength
 * Vanilla JS dynamic validation with RegEx rules, ARIA states, and inline errors
 */

import { setAuthenticated, setCurrentUser } from './auth.js';

// Regex patterns
const REGEX = {
  name: /^[A-Za-z\s]{2,50}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  mobile: /^[6-9]\d{9}$/,
  passwordRules: {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
  }
};

export function evaluatePassword(pwd) {
  const rules = {
    length: REGEX.passwordRules.length.test(pwd),
    uppercase: REGEX.passwordRules.uppercase.test(pwd),
    lowercase: REGEX.passwordRules.lowercase.test(pwd),
    number: REGEX.passwordRules.number.test(pwd),
    special: REGEX.passwordRules.special.test(pwd)
  };

  const score = Object.values(rules).filter(Boolean).length;
  let label = 'Weak';
  let level = 'weak';

  if (score >= 5) {
    label = 'Strong';
    level = 'strong';
  } else if (score >= 3) {
    label = 'Medium';
    level = 'medium';
  } else {
    label = 'Weak';
    level = 'weak';
  }

  return { rules, score, label, level, isValid: score === 5 };
}

export function setFieldError(field, errorEl, message) {
  if (!field || !errorEl) return;
  if (message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    field.setAttribute('aria-invalid', 'true');
    errorEl.textContent = `❌ ${message}`;
    errorEl.style.display = 'flex';
  } else {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    field.setAttribute('aria-invalid', 'false');
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}

export function initRegistrationValidation() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    mobile: document.getElementById('mobile'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    course: document.getElementById('course'),
    year: document.getElementById('year'),
    terms: document.getElementById('terms')
  };

  const errors = {
    name: document.getElementById('err-name'),
    email: document.getElementById('err-email'),
    mobile: document.getElementById('err-mobile'),
    password: document.getElementById('err-password'),
    confirmPassword: document.getElementById('err-confirmPassword'),
    course: document.getElementById('err-course'),
    year: document.getElementById('err-year'),
    gender: document.getElementById('err-gender'),
    terms: document.getElementById('err-terms')
  };

  // Live password strength indicator elements
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  const ruleItems = {
    length: document.getElementById('rule-length'),
    uppercase: document.getElementById('rule-uppercase'),
    lowercase: document.getElementById('rule-lowercase'),
    number: document.getElementById('rule-number'),
    special: document.getElementById('rule-special')
  };

  // Password live input handler
  if (fields.password) {
    fields.password.addEventListener('input', () => {
      const val = fields.password.value;
      const { rules, level, label } = evaluatePassword(val);

      if (strengthFill) {
        strengthFill.className = `strength-bar-fill ${val ? level : ''}`;
      }
      if (strengthText) {
        strengthText.textContent = val ? `Strength: ${label}` : 'Strength: —';
        strengthText.style.color = level === 'strong' ? 'var(--success-color)' : level === 'medium' ? 'var(--warning-color)' : 'var(--danger-color)';
      }

      // Update checklist indicators
      Object.keys(ruleItems).forEach(key => {
        if (ruleItems[key]) {
          ruleItems[key].classList.toggle('met', rules[key]);
          ruleItems[key].querySelector('span').textContent = rules[key] ? '✓' : '•';
        }
      });

      if (val && !evaluatePassword(val).isValid) {
        setFieldError(fields.password, errors.password, 'Must meet all 5 password requirements.');
      } else if (val) {
        setFieldError(fields.password, errors.password, '');
      }

      // Revalidate confirm password if already typed
      if (fields.confirmPassword && fields.confirmPassword.value) {
        if (fields.confirmPassword.value !== val) {
          setFieldError(fields.confirmPassword, errors.confirmPassword, 'Passwords do not match.');
        } else {
          setFieldError(fields.confirmPassword, errors.confirmPassword, '');
        }
      }
    });
  }

  // Live input sanitization & validation
  fields.name?.addEventListener('input', () => {
    const val = fields.name.value.trim();
    if (!val) {
      setFieldError(fields.name, errors.name, 'Full Name is required.');
    } else if (!REGEX.name.test(val)) {
      setFieldError(fields.name, errors.name, 'Only alphabetic letters and spaces allowed (2-50 chars).');
    } else {
      setFieldError(fields.name, errors.name, '');
    }
  });

  fields.email?.addEventListener('input', () => {
    const val = fields.email.value.trim();
    if (!val) {
      setFieldError(fields.email, errors.email, 'Email address is required.');
    } else if (!REGEX.email.test(val)) {
      setFieldError(fields.email, errors.email, 'Please enter a valid email address (e.g., student@charusat.edu.in).');
    } else {
      setFieldError(fields.email, errors.email, '');
    }
  });

  fields.mobile?.addEventListener('input', () => {
    // Only allow digits
    fields.mobile.value = fields.mobile.value.replace(/\D/g, '').slice(0, 10);
    const val = fields.mobile.value;
    if (!val) {
      setFieldError(fields.mobile, errors.mobile, 'Mobile number is required.');
    } else if (!REGEX.mobile.test(val)) {
      setFieldError(fields.mobile, errors.mobile, 'Enter a valid 10-digit Indian mobile starting with 6-9.');
    } else {
      setFieldError(fields.mobile, errors.mobile, '');
    }
  });

  fields.confirmPassword?.addEventListener('input', () => {
    const val = fields.confirmPassword.value;
    if (!val) {
      setFieldError(fields.confirmPassword, errors.confirmPassword, 'Please confirm your password.');
    } else if (val !== fields.password.value) {
      setFieldError(fields.confirmPassword, errors.confirmPassword, 'Passwords do not match.');
    } else {
      setFieldError(fields.confirmPassword, errors.confirmPassword, '');
    }
  });

  fields.course?.addEventListener('change', () => {
    if (!fields.course.value) {
      setFieldError(fields.course, errors.course, 'Please select your academic course.');
    } else {
      setFieldError(fields.course, errors.course, '');
    }
  });

  fields.year?.addEventListener('change', () => {
    if (!fields.year.value) {
      setFieldError(fields.year, errors.year, 'Please select your study year.');
    } else {
      setFieldError(fields.year, errors.year, '');
    }
  });

  document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (errors.gender) {
        errors.gender.textContent = '';
        errors.gender.style.display = 'none';
      }
    });
  });

  fields.terms?.addEventListener('change', () => {
    if (!fields.terms.checked) {
      if (errors.terms) {
        errors.terms.textContent = '❌ You must accept the terms and conditions.';
        errors.terms.style.display = 'flex';
      }
    } else {
      if (errors.terms) {
        errors.terms.textContent = '';
        errors.terms.style.display = 'none';
      }
    }
  });

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    const nameVal = fields.name.value.trim();
    if (!nameVal || !REGEX.name.test(nameVal)) {
      setFieldError(fields.name, errors.name, 'Please enter a valid alphabetic name (2-50 chars).');
      isValid = false;
    } else {
      setFieldError(fields.name, errors.name, '');
    }

    // Validate Email
    const emailVal = fields.email.value.trim();
    if (!emailVal || !REGEX.email.test(emailVal)) {
      setFieldError(fields.email, errors.email, 'Please enter a valid email address.');
      isValid = false;
    } else {
      setFieldError(fields.email, errors.email, '');
    }

    // Validate Mobile
    const mobileVal = fields.mobile.value.trim();
    if (!mobileVal || !REGEX.mobile.test(mobileVal)) {
      setFieldError(fields.mobile, errors.mobile, 'Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).');
      isValid = false;
    } else {
      setFieldError(fields.mobile, errors.mobile, '');
    }

    // Validate Password
    const pwdVal = fields.password.value;
    const pwdEval = evaluatePassword(pwdVal);
    if (!pwdEval.isValid) {
      setFieldError(fields.password, errors.password, 'Password must be at least 8 chars with uppercase, lowercase, number, and special char.');
      isValid = false;
    } else {
      setFieldError(fields.password, errors.password, '');
    }

    // Validate Confirm Password
    if (!fields.confirmPassword.value || fields.confirmPassword.value !== pwdVal) {
      setFieldError(fields.confirmPassword, errors.confirmPassword, 'Passwords do not match.');
      isValid = false;
    } else {
      setFieldError(fields.confirmPassword, errors.confirmPassword, '');
    }

    // Validate Course
    if (!fields.course.value) {
      setFieldError(fields.course, errors.course, 'Please select your course.');
      isValid = false;
    } else {
      setFieldError(fields.course, errors.course, '');
    }

    // Validate Year
    if (!fields.year.value) {
      setFieldError(fields.year, errors.year, 'Please select your year.');
      isValid = false;
    } else {
      setFieldError(fields.year, errors.year, '');
    }

    // Validate Gender
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    if (!selectedGender) {
      if (errors.gender) {
        errors.gender.textContent = '❌ Please select your gender.';
        errors.gender.style.display = 'flex';
      }
      isValid = false;
    } else {
      if (errors.gender) {
        errors.gender.textContent = '';
        errors.gender.style.display = 'none';
      }
    }

    // Validate Terms
    if (!fields.terms.checked) {
      if (errors.terms) {
        errors.terms.textContent = '❌ You must agree to the Terms & Conditions.';
        errors.terms.style.display = 'flex';
      }
      isValid = false;
    } else {
      if (errors.terms) {
        errors.terms.textContent = '';
        errors.terms.style.display = 'none';
      }
    }

    if (!isValid) {
      if (window.showToast) {
        window.showToast('⚠️ Please fix the highlighted errors in the form.', 'error');
      }
      return;
    }

    // Form is completely valid!
    const newUser = {
      name: nameVal,
      email: emailVal,
      mobile: mobileVal,
      course: fields.course.value,
      year: fields.year.value,
      gender: selectedGender.value,
      division: 'CE-A',
      enrollmentNo: '25CS' + Math.floor(100 + Math.random() * 900)
    };

    setCurrentUser(newUser);

    // Show success modal or toast
    const modal = document.getElementById('regSuccessModal');
    if (modal) {
      modal.classList.add('open');
    } else {
      if (window.showToast) {
        window.showToast('🎉 Registration successful! Redirecting to Login...', 'success');
      }
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    }
  });
}

export function initLoginValidation() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailField = document.getElementById('loginEmail');
  const passwordField = document.getElementById('loginPassword');
  const emailErr = document.getElementById('loginEmailErr');
  const passErr = document.getElementById('loginPassErr');

  emailField?.addEventListener('input', () => {
    if (!emailField.value.trim() || !REGEX.email.test(emailField.value.trim())) {
      setFieldError(emailField, emailErr, 'Please enter a valid registered email address.');
    } else {
      setFieldError(emailField, emailErr, '');
    }
  });

  passwordField?.addEventListener('input', () => {
    if (!passwordField.value || passwordField.value.length < 6) {
      setFieldError(passwordField, passErr, 'Password must be at least 6 characters.');
    } else {
      setFieldError(passwordField, passErr, '');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    const emailVal = emailField.value.trim();
    const passVal = passwordField.value;

    if (!emailVal || !REGEX.email.test(emailVal)) {
      setFieldError(emailField, emailErr, 'Please enter a valid email address.');
      isValid = false;
    } else {
      setFieldError(emailField, emailErr, '');
    }

    if (!passVal || passVal.length < 6) {
      setFieldError(passwordField, passErr, 'Please enter your password (minimum 6 characters).');
      isValid = false;
    } else {
      setFieldError(passwordField, passErr, '');
    }

    if (!isValid) return;

    // Successful login demonstration
    setAuthenticated(true);
    if (window.showToast) {
      window.showToast('✅ Login successful! Welcome back.', 'success');
    }

    setTimeout(() => {
      const redirect = sessionStorage.getItem('redirect_after_login') || 'home.html';
      sessionStorage.removeItem('redirect_after_login');
      window.location.href = redirect.endsWith('.html') ? redirect : 'home.html';
    }, 600);
  });
}
