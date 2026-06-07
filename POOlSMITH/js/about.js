/* ═══════════════════════════════════════════
   POOLSMITH — js/about.js  (v2 — clean)
   About-page ONLY scripts.
   Loaded AFTER main.js (which handles cursor,
   navbar scroll, mobile menu, stat counters,
   reveal-left/right, contact form).

   This file adds:
   1. Scroll-triggered .reveal-up via IO  (about uses class-toggle, not keyframes)
   2. Value card staggered fade-in
   3. Hero text entrance stagger
   4. Blockquote slide-in
   5. Cursor teal-bright colour override
═══════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────
     1. REVEAL-UP — scroll-triggered class toggle
     about.css cancels the keyframe animation
     and uses opacity/transform + .visible class.
  ───────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealIO.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { revealIO.observe(el); });

  } else {
    /* Fallback: show everything immediately */
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ─────────────────────────────────────────
     2. REVEAL-LEFT / REVEAL-RIGHT
     main.js IntersectionObserver already handles
     these, but we add a direct-trigger fallback
     for browsers without IO support.
  ───────────────────────────────────────── */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-left, .reveal-right').forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ─────────────────────────────────────────
     3. VALUE CARDS — staggered fade-in
     Pre-hide each card, then animate in with
     a small delay per card index.
  ───────────────────────────────────────── */
  var valCards = document.querySelectorAll('.val-card');

  if ('IntersectionObserver' in window && valCards.length) {
    /* Pre-hide */
    valCards.forEach(function (card) {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(28px)';
      card.style.transition = 'opacity .55s ease, transform .55s ease';
    });

    var cardIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el  = entry.target;
        var idx = Array.prototype.indexOf.call(valCards, el);

        setTimeout(function () {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, idx * 80);

        cardIO.unobserve(el);
      });
    }, { threshold: 0.10 });

    valCards.forEach(function (card) { cardIO.observe(card); });

  } else {
    /* Fallback: show all immediately */
    valCards.forEach(function (card) {
      card.style.opacity   = '1';
      card.style.transform = 'none';
    });
  }


  /* ─────────────────────────────────────────
     4. HERO TEXT ENTRANCE — staggered slide-up
     Runs once on page load (not on scroll).
  ───────────────────────────────────────── */
  var heroChildren = document.querySelectorAll('.hero-text-wrap > *');

  heroChildren.forEach(function (el, i) {
    el.style.opacity        = '0';
    el.style.transform      = 'translateY(20px)';
    el.style.transition     = 'opacity .7s ease, transform .7s ease';
    el.style.transitionDelay = (0.2 + i * 0.13) + 's';
  });

  /* Double rAF ensures transition fires after paint */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroChildren.forEach(function (el) {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });


  /* ─────────────────────────────────────────
     5. BLOCKQUOTE SLIDE-IN
  ───────────────────────────────────────── */
  var quote = document.querySelector('.blockquote-wrap');
  if (quote && 'IntersectionObserver' in window) {
    quote.style.opacity    = '0';
    quote.style.transform  = 'translateX(-24px)';
    quote.style.transition = 'opacity .85s ease, transform .85s ease';

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateX(0)';
      });
    }, { threshold: 0.2 }).observe(quote);
  }


  /* ─────────────────────────────────────────
     6. CURSOR COLOUR OVERRIDE
     main.js sets cursor to cyan (#00b4d8).
     About page uses the same cyan accent as the global cursor.
  ───────────────────────────────────────── */
  var cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    cursor.style.background = '#00b4d8';

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
     7. STAT COUNTERS WITH SUFFIX
     main.js animates counters but reads
     data-suffix only if already present.
     This ensures suffix (%, +) is appended.
  ───────────────────────────────────────── */
  var statEls = document.querySelectorAll('.stat-num[data-target]');

  if ('IntersectionObserver' in window && statEls.length) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el      = entry.target;
        var target  = parseInt(el.dataset.target, 10);
        var suffix  = el.dataset.suffix || '';
        if (isNaN(target)) return;

        var duration = 1600;
        var t0 = performance.now();

        (function tick(now) {
          var progress = Math.min((now - t0) / duration, 1);
          var ease     = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target) + suffix;
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target + suffix;
          }
        })(performance.now());

        statIO.unobserve(el);
      });
    }, { threshold: 0.5 });

    statEls.forEach(function (el) {
      el.textContent = '0';
      statIO.observe(el);
    });
  }

}); /* end DOMContentLoaded */
