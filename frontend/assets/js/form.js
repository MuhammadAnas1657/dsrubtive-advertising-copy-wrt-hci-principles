/* ========================================
   FORM.JS — Multi-step contact & audit forms
   Disruptive Advertising Copy — HCI Project
   ======================================== */

'use strict';

// ==========================================
// MULTI-STEP FORM ENGINE
// ==========================================
class MultiStepForm {
  constructor(formEl) {
    this.form = formEl;
    this.steps = Array.from(formEl.querySelectorAll('.form-step'));
    this.stepDots = Array.from(formEl.querySelectorAll('.form-step-dot'));
    this.stepNodes = Array.from(formEl.querySelectorAll('.step-node'));
    this.stepConnectors = Array.from(formEl.querySelectorAll('.step-connector'));
    this.stepLabel = formEl.querySelector('.form-step-label');
    this.current = 0;
    this.data = {};

    this.init();
  }

  init() {
    this.showStep(0);

    // Next buttons
    this.form.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => this.next());
    });

    // Back buttons
    this.form.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => this.back());
    });

    // Submit
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation for improved version
    if (this.form.classList.contains('validate-realtime')) {
      this.form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('error')) this.validateField(field);
        });
      });
    }
  }

  showStep(index) {
    this.steps.forEach((step, i) => {
      step.style.display = i === index ? 'block' : 'none';
    });

    // Update dots
    this.stepDots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < index) dot.classList.add('done');
      if (i === index) dot.classList.add('active');
    });

    // Update step nodes (improved version)
    this.stepNodes.forEach((node, i) => {
      node.classList.remove('active', 'done');
      if (i < index) { node.classList.add('done'); node.textContent = '✓'; }
      else { node.textContent = i + 1; }
      if (i === index) node.classList.add('active');
    });

    // Update connectors
    this.stepConnectors.forEach((conn, i) => {
      conn.classList.toggle('done', i < index);
    });

    // Update label
    if (this.stepLabel) {
      this.stepLabel.textContent = `Step ${index + 1} of ${this.steps.length}`;
    }

    this.current = index;
  }

  validateField(field) {
    const group = field.closest('.form-group');
    const errMsg = group && group.querySelector('.form-error-msg');
    let valid = true;
    let msg = '';

    if (field.required && !field.value.trim()) {
      valid = false;
      msg = `${field.labels?.[0]?.textContent || 'This field'} is required.`;
    } else if (field.type === 'email' && field.value.trim()) {
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(field.value.trim())) {
        valid = false;
        msg = 'Please enter a valid email address.';
      }
    } else if (field.type === 'tel' && field.value.trim()) {
      if (field.value.trim().length < 7) {
        valid = false;
        msg = 'Please enter a valid phone number.';
      }
    } else if (field.type === 'url' && field.value.trim()) {
      if (!field.value.trim().match(/^https?:\/\/.+/)) {
        valid = false;
        msg = 'Please include https:// in your URL.';
      }
    }

    if (group) {
      field.classList.toggle('error', !valid);
      field.classList.toggle('field-valid', valid && field.value.trim() !== '');
      if (errMsg) {
        errMsg.textContent = msg;
        errMsg.classList.toggle('show', !valid);
      }
    }

    return valid;
  }

  validateStep(index) {
    const step = this.steps[index];
    const fields = step.querySelectorAll('input[required], select[required], textarea[required]');
    let allValid = true;
    fields.forEach(field => {
      if (!this.validateField(field)) allValid = false;
    });
    return allValid;
  }

  next() {
    if (!this.validateStep(this.current)) return;
    this.collectStepData(this.current);
    if (this.current < this.steps.length - 1) {
      this.showStep(this.current + 1);
    }
  }

  back() {
    if (this.current > 0) this.showStep(this.current - 1);
  }

  collectStepData(index) {
    const step = this.steps[index];
    step.querySelectorAll('input, select, textarea').forEach(field => {
      if (field.name) {
        if (field.type === 'checkbox') {
          if (!this.data[field.name]) this.data[field.name] = [];
          if (field.checked) this.data[field.name].push(field.value);
        } else {
          this.data[field.name] = field.value;
        }
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (!this.validateStep(this.current)) return;
    this.collectStepData(this.current);

    const submitBtn = this.form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    // Determine endpoint
    const endpoint = this.form.dataset.endpoint || '/api/contact';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.data, form_type: this.form.dataset.formType || 'contact' })
      });
      const json = await res.json();

      if (json.success) {
        this.showSuccess(json.message);
      } else {
        this.showErrors(json.errors || {});
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit'; }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      this.showNetworkError();
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Try Again'; }
    }
  }

  showSuccess(message) {
    this.form.innerHTML = `
      <div class="form-success-msg" role="status" aria-live="polite">
        <div class="check-icon">✅</div>
        <h3>You're All Set!</h3>
        <p>${message || "Thank you! We'll be in touch within 1 business day."}</p>
        <p style="margin-top:12px;font-size:13px;color:#aaa;">Check your inbox for a confirmation email.</p>
      </div>`;
    if (window.showNotification) showNotification('Form submitted successfully!', '✅');
  }

  showErrors(errors) {
    Object.entries(errors).forEach(([name, msg]) => {
      const field = this.form.querySelector(`[name="${name}"]`);
      if (field) {
        field.classList.add('error');
        const group = field.closest('.form-group');
        const errEl = group && group.querySelector('.form-error-msg');
        if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
      }
    });
  }

  showNetworkError() {
    const errState = this.form.querySelector('.error-state');
    if (errState) {
      errState.classList.add('show');
    } else if (window.showNotification) {
      showNotification(
        "Couldn't send your message. Please check your connection and try again.",
        '⚠️',
        6000
      );
    }
  }
}

// ==========================================
// AUDIT FORM (simpler, single step)
// ==========================================
async function submitAuditForm(formEl) {
  const data = {};
  new FormData(formEl).forEach((v, k) => { data[k] = v; });

  const submitBtn = formEl.querySelector('[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

  try {
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();

    if (json.success) {
      formEl.innerHTML = `
        <div class="form-success-msg" role="status">
          <div class="check-icon">🎯</div>
          <h3>Audit Request Received!</h3>
          <p>${json.message}</p>
        </div>`;
      if (window.showNotification) showNotification('Audit request sent!', '🎯');
    } else {
      // Show inline errors
      Object.entries(json.errors || {}).forEach(([name, msg]) => {
        const field = formEl.querySelector(`[name="${name}"]`);
        if (field) {
          field.classList.add('error');
          const group = field.closest('.form-group');
          const errEl = group && group.querySelector('.form-error-msg');
          if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
        }
      });
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Try Again'; }
    }
  } catch {
    if (window.showNotification) {
      showNotification('Network error. Please try again.', '⚠️', 5000);
    }
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Try Again'; }
  }
}

// ==========================================
// IMPROVED VERSION: Keyboard shortcut for search
// ==========================================
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Press '/' to open contact modal
    if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const contactBtn = document.querySelector('[data-modal="contact-modal"]');
      if (contactBtn) contactBtn.click();
    }
    // Press 'Escape' handled in main.js (close modal)
  });
}

// ==========================================
// BOOT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Init multi-step forms
  document.querySelectorAll('.multi-step-form').forEach(formEl => {
    new MultiStepForm(formEl);
  });

  // Init simple audit forms
  document.querySelectorAll('.audit-form').forEach(formEl => {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      submitAuditForm(formEl);
    });
  });

  // Keyboard shortcuts (improved version only)
  if (document.body.classList.contains('improved-page')) {
    initKeyboardShortcuts();
  }
});
