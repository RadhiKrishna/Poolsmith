/* ═══════════════════════════════════════════
   POOLSMITH — js/footer.js
   Shared footer loader for ALL pages.

   HOW TO USE — add ONE line before </body>:
     <script src="js/footer.js"></script>

   The script:
     1. Fetches footer.html (one network request, cached by browser)
     2. Injects it before </body>  (or into #footer-placeholder if present)
     3. Sets the current year automatically
     4. Highlights active nav link in footer (matches current page)
     5. Initialises the WhatsApp FAB with page-scroll show/hide
═══════════════════════════════════════════ */
'use strict';

(function () {

  /* ── CONFIG ─────────────────────────────── */
  var scriptUrl   = document.currentScript && document.currentScript.src;
  var FOOTER_URL  = scriptUrl ? new URL('../footer.html', scriptUrl).href : 'footer.html';
  var WA_NUMBER   = '971555726164';  /* WhatsApp number without + */
  var SHOW_AFTER  = 300;             /* px scrolled before FAB appears */

  /* ── RESOLVE CORRECT PATH ────────────────
     Pages in sub-folders need '../footer.html'.
     Detect depth by counting path segments.
  ─────────────────────────────────────────── */
  /* ── LOAD FOOTER ─────────────────────────── */
  function loadFooter () {
    fetch(FOOTER_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('footer.html not found (' + res.status + ')');
        return res.text();
      })
      .then(function (html) {
        injectFooter(html);
      })
      .catch(function (err) {
        console.warn('[Poolsmith footer.js]', err.message);
      });
  }


  /* ── INJECT HTML ─────────────────────────── */
  function injectFooter (html) {
    var placeholder = document.getElementById('footer-placeholder');

    if (placeholder) {
      /* Replace dedicated placeholder div */
      placeholder.outerHTML = html;
    } else {
      /* Append before </body> */
      document.body.insertAdjacentHTML('beforeend', html);
    }

    onFooterReady();
  }


  /* ── POST-INJECT SETUP ───────────────────── */
  function onFooterReady () {
    setYear();
    highlightActiveLink();
    initWAButton();
  }


  /* ── AUTO YEAR ───────────────────────────── */
  function setYear () {
    var yearEls = document.querySelectorAll('.footer-year');
    var year    = new Date().getFullYear();
    yearEls.forEach(function (el) { el.textContent = year; });
  }


  /* ── HIGHLIGHT ACTIVE FOOTER NAV LINK ───── */
  function highlightActiveLink () {
    var currentFile = window.location.pathname.split('/').pop() || 'index.html';

    var links = document.querySelectorAll('footer .f-col a[href]');
    links.forEach(function (link) {
      var href = link.getAttribute('href').split('/').pop();
      if (href === currentFile) {
        link.style.color = 'var(--cyan, #00b4d8)';
        link.style.fontWeight = '500';
      }
    });
  }


  /* ── WHATSAPP FAB SCROLL BEHAVIOUR ──────── */
  function initWAButton () {
    var btn = document.querySelector('.wa-float');
    if (!btn) return;

    /* Update href just in case it was hardcoded */
    btn.setAttribute('href', 'https://wa.me/' + WA_NUMBER);

    /* Start hidden, fade in after SHOW_AFTER px */
    btn.style.opacity    = '0';
    btn.style.transform  = 'scale(0.7) translateY(10px)';
    btn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    btn.style.pointerEvents = 'none';

    var visible = false;

    function onScroll () {
      var scrolled = window.pageYOffset || document.documentElement.scrollTop;

      if (scrolled > SHOW_AFTER && !visible) {
        visible = true;
        btn.style.opacity       = '1';
        btn.style.transform     = 'scale(1) translateY(0)';
        btn.style.pointerEvents = 'auto';
      } else if (scrolled <= SHOW_AFTER && visible) {
        visible = false;
        btn.style.opacity       = '0';
        btn.style.transform     = 'scale(0.7) translateY(10px)';
        btn.style.pointerEvents = 'none';
      }
    }

    /* Throttle scroll listener for performance */
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    /* Run once in case page is already scrolled */
    onScroll();
  }


  /* ── KICK OFF ────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
    loadFooter();
  }

})();
