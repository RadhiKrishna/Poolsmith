/* ═══════════════════════════════════════════════
   navbar.js
   Fetches navbar.html and injects it into
   #navbar-placeholder, then wires up all
   interactive behaviour.
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  const container = document.getElementById('navbar-placeholder');
  if (!container) return;

  const activePage = container.dataset.page || '';
  const scriptUrl = document.currentScript && document.currentScript.src;
  const navbarUrl = scriptUrl ? new URL('../navbar.html', scriptUrl).href : 'navbar.html';

  fetch(navbarUrl)
    .then(function (res) {
      if (!res.ok) throw new Error('navbar.html failed to load: ' + res.status);
      return res.text();
    })
    .then(function (html) {
      container.innerHTML = html;

      /* ── Active link highlight — desktop ── */
      document
        .querySelectorAll('.nav-links a[data-page]')
        .forEach(function (a) {
          if (a.dataset.page === activePage) {
            a.classList.add('active');
            a.setAttribute('aria-current', 'page');
          }
        });

      /* ── Active link highlight — mobile ── */
      document
        .querySelectorAll('.mobile-nav-list a[data-page]')
        .forEach(function (a) {
          if (a.dataset.page === activePage) {
            a.classList.add('active');
          }
        });

      /* ── Mobile menu elements ── */
      const menuBtn    = document.getElementById('menuBtn');
      const mobileMenu = document.getElementById('mobileMenu');
      const overlay    = document.getElementById('mobileOverlay');
      const closeBtn   = document.getElementById('mobileClose');

      if (!menuBtn || !mobileMenu || !overlay || !closeBtn) {
        console.warn('Navbar: one or more mobile-menu elements not found.');
        return;
      }

      function openMenu() {
        mobileMenu.classList.add('open');
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        menuBtn.classList.add('open');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }

      function closeMenu() {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      menuBtn.addEventListener('click', openMenu);
      closeBtn.addEventListener('click', closeMenu);
      overlay.addEventListener('click', closeMenu);

      /* Close on Escape key */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
          closeMenu();
          menuBtn.focus();
        }
      });

      /* ── Sticky scroll shadow ── */
      const navbar = document.getElementById('navbar');
      if (navbar) {
        function onScroll() {
          navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on load in case page is already scrolled
      }
    })
    .catch(function (err) {
      console.error('Navbar load error:', err);
    });
})();
