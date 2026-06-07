/* ═══════════════════════════════════════════
   POOLSMITH — main.js  (v2 — unified)
   Shared across ALL pages.
   Handles: cursor, navbar scroll, mobile menu,
   smooth scroll, stat counters, reveal animations,
   gallery filter, contact form.
═══════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────
     1. CUSTOM CURSOR  (desktop / pointer:fine only)
  ───────────────────────────────────────── */
  var cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    var mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    (function animateCursor() {
      curX += (mouseX - curX) * 0.14;
      curY += (mouseY - curY) * 0.14;
      cursor.style.left = curX + 'px';
      cursor.style.top  = curY + 'px';
      requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, input, select, textarea').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.width      = '32px';
        cursor.style.height     = '32px';
        cursor.style.background = 'transparent';
        cursor.style.border     = '2px solid #00b4d8';
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.width      = '18px';
        cursor.style.height     = '18px';
        cursor.style.background = '#00b4d8';
        cursor.style.border     = 'none';
      });
    });
  }


  /* ─────────────────────────────────────────
     2. NAVBAR SCROLL STATE
  ───────────────────────────────────────── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    var onScroll = function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* run on load (e.g. page refresh mid-scroll) */
  }


  /* ─────────────────────────────────────────
     3. MOBILE MENU
  ───────────────────────────────────────── */
  var menuBtn     = document.getElementById('menuBtn');
  var mobileMenu  = document.getElementById('mobileMenu');
  var mobileClose = document.getElementById('mobileClose');
  var overlay     = document.getElementById('mobileOverlay');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    if (overlay)  overlay.classList.add('open');
    if (menuBtn)  menuBtn.classList.add('open');
    if (menuBtn)  menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (overlay)  overlay.classList.remove('open');
    if (menuBtn)  menuBtn.classList.remove('open');
    if (menuBtn)  menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuBtn)     menuBtn.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (overlay)     overlay.addEventListener('click', closeMenu);

  /* Close when any nav link is tapped */
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* Keyboard: Escape closes menu */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });


  /* ─────────────────────────────────────────
     4. SMOOTH SCROLL for anchor links
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      var top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────
     5. INTERSECTION OBSERVER
     — stat counters
     — reveal-left / reveal-right
  ───────────────────────────────────────── */
  function animateCounter(el) {
    var target   = parseInt(el.dataset.target, 10);
    var suffix   = el.dataset.suffix || '';
    if (isNaN(target)) return;
    var duration = 1800;
    var start    = performance.now();
    (function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    })(performance.now());
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;

      if (el.classList.contains('stat-num') && el.dataset.target) {
        animateCounter(el);
      }
      if (el.classList.contains('reveal-left') || el.classList.contains('reveal-right')) {
        el.classList.add('visible');
      }

      io.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(
    '.stat-num[data-target], .reveal-left, .reveal-right'
  ).forEach(function (el) { io.observe(el); });


  /* ─────────────────────────────────────────
     6. GALLERY FILTER
  ───────────────────────────────────────── */
  var filterBtns = document.querySelectorAll('.gf-btn');
  var galleryItems = document.querySelectorAll('.g-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        /* Update active button */
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.dataset.filter;

        galleryItems.forEach(function (item) {
          var match = filter === 'all' || item.dataset.cat === filter;
          item.style.transition = 'opacity .3s, transform .3s';
          if (match) {
            item.style.opacity   = '1';
            item.style.transform = 'scale(1)';
            item.style.display   = '';
          } else {
            item.style.opacity   = '0';
            item.style.transform = 'scale(0.96)';
            /* hide after fade */
            setTimeout(function () {
              if (!match) item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }


  /* ─────────────────────────────────────────
     7. CONTACT FORM
  ───────────────────────────────────────── */
  var form      = document.getElementById('contactForm');
  var submitBtn = document.getElementById('submitBtn');

  if (form && submitBtn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl  = document.getElementById('cf-name');
      var emailEl = document.getElementById('cf-email');
      var valid   = true;
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (nameEl && !nameEl.value.trim()) {
        nameEl.style.borderColor = '#e74c3c';
        valid = false;
        setTimeout(function () { nameEl.style.borderColor = ''; }, 2500);
      }
      if (emailEl && (!emailEl.value.trim() || !emailRe.test(emailEl.value.trim()))) {
        emailEl.style.borderColor = '#e74c3c';
        valid = false;
        setTimeout(function () { emailEl.style.borderColor = ''; }, 2500);
      }
      if (!valid) return;

      submitBtn.classList.add('sending');
      var btnText = submitBtn.querySelector('span');
      if (btnText) btnText.textContent = 'Sending…';

      /* Simulate send (replace with real API call) */
      setTimeout(function () {
        submitBtn.classList.remove('sending');
        if (btnText) btnText.textContent = '✓ Message Sent!';
        submitBtn.style.background = '#2ecc71';

        setTimeout(function () {
          if (btnText) btnText.textContent = 'Send Inquiry';
          submitBtn.style.background = '';
          form.reset();
        }, 3000);
      }, 1800);
    });

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.style.borderColor = ''; });
    });
  }


  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     8. QUOTE FORM
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  var quoteForm = document.getElementById('quoteForm');
  var quoteSuccess = document.getElementById('formSuccess');

  if (quoteForm && quoteSuccess) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = [
        { id: 'name', err: 'nameErr', msg: 'Please enter your name.' },
        { id: 'email', err: 'emailErr', msg: 'Please enter a valid email address.', email: true },
        { id: 'phone', err: 'phoneErr', msg: 'Please enter your phone number.' },
        { id: 'service', err: 'serviceErr', msg: 'Please select a service.' }
      ];
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var valid = true;

      fields.forEach(function (field) {
        var el = document.getElementById(field.id);
        var err = document.getElementById(field.err);
        if (!el) return;

        var value = el.value.trim();
        var fieldValid = field.email ? emailRe.test(value) : Boolean(value);

        el.classList.toggle('error', !fieldValid);
        if (err) err.textContent = fieldValid ? '' : field.msg;
        if (!fieldValid) valid = false;
      });

      if (!valid) return;

      quoteSuccess.classList.add('visible');
      quoteForm.reset();
    });

    quoteForm.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        el.classList.remove('error');
        var err = document.getElementById(el.id + 'Err');
        if (err) err.textContent = '';
      });
    });
  }

}); /* end DOMContentLoaded */
