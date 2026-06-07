/**
 * Pool Cleaners Dubai — blog.js
 * Handles: tag filter, search, newsletter, back-to-top, card animations
 * NOTE: Mobile menu & sticky navbar scroll are handled by navbar.js
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Tag / Category Filter ── */
  const tags  = document.querySelectorAll('.tag');
  const cards = document.querySelectorAll('.post-card');

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      const filter = tag.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          // Re-trigger entrance animation
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });

      // No-results message
      const visible  = [...cards].filter(c => !c.classList.contains('hidden'));
      const existing = document.getElementById('noResults');
      if (visible.length === 0) {
        if (!existing) {
          const msg = document.createElement('p');
          msg.id = 'noResults';
          msg.style.cssText = 'color:var(--muted);font-size:.95rem;padding:1rem 0;';
          msg.textContent = 'No articles found for this category.';
          document.getElementById('blogFeed').appendChild(msg);
        }
      } else {
        existing?.remove();
      }
    });
  });

  /* ── Search ── */
  const searchInput = document.getElementById('searchInput');
  const searchBtn   = document.getElementById('searchBtn');

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    // Reset active tag to "All"
    tags.forEach(t => t.classList.remove('active'));
    document.querySelector('.tag[data-filter="all"]')?.classList.add('active');

    let matched = 0;
    cards.forEach(card => {
      const title   = card.querySelector('.post-title')?.textContent.toLowerCase()   || '';
      const excerpt = card.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
      const cat     = card.querySelector('.post-cat')?.textContent.toLowerCase()     || '';
      const hit     = !query || title.includes(query) || excerpt.includes(query) || cat.includes(query);
      card.classList.toggle('hidden', !hit);
      if (hit) matched++;
    });

    const existing = document.getElementById('noResults');
    if (matched === 0 && query) {
      if (!existing) {
        const msg = document.createElement('p');
        msg.id = 'noResults';
        msg.style.cssText = 'color:var(--muted);font-size:.95rem;padding:1rem 0;';
        msg.textContent = `No articles found for "${searchInput.value}".`;
        document.getElementById('blogFeed').appendChild(msg);
      }
    } else {
      existing?.remove();
    }
  }

  searchBtn?.addEventListener('click', performSearch);
  searchInput?.addEventListener('keydown', e => { if (e.key === 'Enter') performSearch(); });

  // Clear filter when input is emptied
  searchInput?.addEventListener('input', () => {
    if (searchInput.value === '') {
      cards.forEach(c => c.classList.remove('hidden'));
      document.getElementById('noResults')?.remove();
    }
  });

  /* ── Newsletter Subscribe ── */
  const subscribeBtn = document.getElementById('subscribeBtn');
  const emailInput   = document.getElementById('newsletterEmail');
  const subscribeMsg = document.getElementById('subscribeMsg');

  subscribeBtn?.addEventListener('click', () => {
    const email      = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showMsg('Please enter your email address.', '#e53935');
      return;
    }
    if (!emailRegex.test(email)) {
      showMsg('Please enter a valid email address.', '#e53935');
      return;
    }

    subscribeBtn.disabled     = true;
    subscribeBtn.textContent  = 'Subscribing…';

    setTimeout(() => {
      emailInput.value          = '';
      subscribeBtn.disabled     = false;
      subscribeBtn.textContent  = 'Subscribe';
      showMsg('🎉 You\'re subscribed! Thank you.', 'var(--teal)');
    }, 900);
  });

  function showMsg(text, color) {
    subscribeMsg.textContent = text;
    subscribeMsg.style.color = color;
    clearTimeout(subscribeMsg._timeout);
    subscribeMsg._timeout = setTimeout(() => { subscribeMsg.textContent = ''; }, 4000);
  }

  /* ── Back-to-Top Button ── */
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTopBtn?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Animate cards on scroll (IntersectionObserver) ── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach(card => {
      card.style.animationPlayState = 'paused';
      observer.observe(card);
    });
  }

});