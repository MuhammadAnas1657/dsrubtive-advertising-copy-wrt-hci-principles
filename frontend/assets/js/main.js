/* ========================================
   MAIN.JS — Shared logic for both versions
   Disruptive Advertising Copy — HCI Project
   ======================================== */

'use strict';

// ==========================================
// NAVBAR — scroll behavior + mobile toggle
// ==========================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile hamburger
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.nav-mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Mobile accordion for sub-menus
    const mobileToggles = document.querySelectorAll('.mobile-accordion-toggle');
    mobileToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const sub = toggle.nextElementSibling;
        if (sub) {
          sub.classList.toggle('open');
          toggle.classList.toggle('expanded');
        }
      });
    });
  }
}

// ==========================================
// SCROLL PROGRESS BAR
// ==========================================
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct.toFixed(1) + '%';
  }, { passive: true });
}

// ==========================================
// SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
// ==========================================
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll(
    '.fade-in-up, .fade-in, .slide-in-left, .slide-in-right'
  );
  if (!animatedEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animatedEls.forEach(el => observer.observe(el));
}

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  const isDecimal = (el.dataset.decimal === 'true');

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ==========================================
// HERO TEXT CYCLING ANIMATION
// ==========================================
function initHeroCycling() {
  const texts = document.querySelectorAll('.hero-cycling-text');
  const dots = document.querySelectorAll('.hero-dot');
  if (!texts.length) return;

  let current = 0;
  let timer = null;
  const INTERVAL = 3200;

  function show(index) {
    texts.forEach((t, i) => {
      t.classList.toggle('active', i === index);
      t.classList.toggle('exit', i !== index && t.classList.contains('active'));
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === index));

    // Remove exit class after transition
    setTimeout(() => {
      texts.forEach(t => t.classList.remove('exit'));
    }, 700);
  }

  function next() {
    current = (current + 1) % texts.length;
    show(current);
  }

  function startTimer() {
    timer = setInterval(next, INTERVAL);
  }

  // Dot click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      current = i;
      show(current);
      startTimer();
    });
  });

  show(0);
  startTimer();
}

// ==========================================
// MODAL — open/close
// ==========================================
function initModals() {
  const overlays = document.querySelectorAll('.modal-overlay');

  // Open buttons
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.dataset.modal;
      const overlay = document.getElementById(targetId);
      if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus first input
        setTimeout(() => {
          const firstInput = overlay.querySelector('input, select, textarea');
          if (firstInput) firstInput.focus();
        }, 300);
      }
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay')));
  });

  // Close on overlay click
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) closeModal(activeModal);
    }
  });
}

function closeModal(overlay) {
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================
// SMOOTH SCROLL for anchor links
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ==========================================
// DROPDOWN accessibility (keyboard)
// ==========================================
function initDropdowns() {
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');
    if (!link || !dropdown) return;

    // Keyboard: Enter/Space opens dropdown
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = item.classList.toggle('keyboard-open');
        link.setAttribute('aria-expanded', String(isOpen));
      }
      if (e.key === 'Escape') {
        item.classList.remove('keyboard-open');
        link.setAttribute('aria-expanded', 'false');
        link.focus();
      }
    });

    // Arrow key navigation inside dropdown
    const links = dropdown.querySelectorAll('a');
    links.forEach((dLink, i) => {
      dLink.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (links[i + 1]) links[i + 1].focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (links[i - 1]) links[i - 1].focus();
          else link.focus();
        }
        if (e.key === 'Escape') {
          item.classList.remove('keyboard-open');
          link.setAttribute('aria-expanded', 'false');
          link.focus();
        }
      });
    });
  });
}

// ==========================================
// TESTIMONIAL CAROUSEL (auto-slide)
// ==========================================
function initTestimonialCarousel(selector) {
  const carousel = document.querySelector(selector);
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');

  if (!track || !slides.length) return;

  let current = 0;
  let auto = null;
  const INTERVAL = 5000;

  function go(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  function startAuto() {
    auto = setInterval(() => go(current + 1), INTERVAL);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(auto); go(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(auto); go(current + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(auto); go(i); startAuto(); }));

  // Touch swipe
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { clearInterval(auto); go(diff > 0 ? current + 1 : current - 1); startAuto(); }
  });

  go(0);
  startAuto();
}

// ==========================================
// SECTION INDICATOR DOTS (improved version)
// ==========================================
function initSectionIndicator() {
  const dots = document.querySelectorAll('.section-dot');
  if (!dots.length) return;

  const sections = Array.from(dots).map(dot => document.getElementById(dot.dataset.target)).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(dot => dot.classList.toggle('active', dot.dataset.target === id));
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (sections[i]) sections[i].scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ==========================================
// NOTIFICATION BANNER
// ==========================================
function showNotification(msg, icon = 'ℹ️', duration = 4000) {
  let banner = document.getElementById('global-notification');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'global-notification';
    banner.className = 'notification-banner';
    banner.innerHTML = `
      <span class="notif-icon"></span>
      <span class="notif-msg"></span>
      <button class="notif-dismiss" aria-label="Dismiss notification">×</button>`;
    document.body.appendChild(banner);
    banner.querySelector('.notif-dismiss').addEventListener('click', () => {
      banner.classList.remove('show');
    });
  }
  banner.querySelector('.notif-icon').textContent = icon;
  banner.querySelector('.notif-msg').textContent = msg;
  banner.classList.add('show');
  clearTimeout(banner._timer);
  banner._timer = setTimeout(() => banner.classList.remove('show'), duration);
}

// Export to global scope
window.showNotification = showNotification;
window.closeModal = closeModal;

// ==========================================
// BOOT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollProgress();
  initScrollAnimations();
  initCounters();
  initHeroCycling();
  initModals();
  initSmoothScroll();
  initDropdowns();
  initTestimonialCarousel('.testimonials-carousel');
  initSectionIndicator();
});
