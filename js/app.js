/* ============================================================
   POOL CLEANERS DUBAI — app.js
   ============================================================ */

/* ── SCROLL REVEAL ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── BACK TO TOP ─────────────────────────────────────────── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 400);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── SEARCH ──────────────────────────────────────────────── */
const searchInput = document.getElementById('searchInput');
const searchBtn   = document.getElementById('searchBtn');
const noResults   = document.getElementById('noResults');
const allCards    = Array.from(document.querySelectorAll('.article-card'));

function doSearch() {
  const q = searchInput.value.trim().toLowerCase();
  let found = 0;
  allCards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const match = !q || text.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) found++;
  });
  noResults.classList.toggle('show', found === 0 && q.length > 0);
}
searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
searchInput.addEventListener('input', () => { if (!searchInput.value) doSearch(); });

/* ── TAG FILTER ──────────────────────────────────────────── */
document.querySelectorAll('.tag-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const tag = this.dataset.tag;
    let found = 0;
    allCards.forEach(card => {
      const tags = card.dataset.tags || '';
      const show = tag === 'all' || tags.includes(tag);
      card.style.display = show ? '' : 'none';
      if (show) found++;
    });
    noResults.classList.toggle('show', found === 0);
    searchInput.value = '';
  });
});

/* ── CATEGORY FILTER ─────────────────────────────────────── */
document.querySelectorAll('.cat-item').forEach(item => {
  item.addEventListener('click', function () {
    const cat = this.dataset.cat;
    let found = 0;
    allCards.forEach(card => {
      const show = cat === 'all' || (card.dataset.cat || '').toLowerCase() === cat.toLowerCase();
      card.style.display = show ? '' : 'none';
      if (show) found++;
    });
    noResults.classList.toggle('show', found === 0);
    searchInput.value = '';
    document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.tag-btn[data-tag="all"]').classList.add('active');
  });
});

/* ── NEWSLETTER ──────────────────────────────────────────── */
document.getElementById('nlForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button');
  const orig = btn.textContent;
  btn.textContent = '✓ Subscribed!';
  btn.style.background = '#10b981';
  this.querySelector('input').value = '';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
});

/* ── SCROLL TO ARTICLE ───────────────────────────────────── */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── SHARE BUTTONS ───────────────────────────────────────── */
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const type = this.dataset.share;
    const url  = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter:  `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
      whatsapp: `https://api.whatsapp.com/send?text=${title}%20${url}`,
    };
    if (urls[type]) window.open(urls[type], '_blank', 'width=600,height=400');
  });
});