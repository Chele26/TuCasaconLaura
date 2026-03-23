document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL SHADOW ── */
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── ACTIVE NAV LINK ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    if (link.getAttribute('href') === currentPage ||
       (currentPage === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── MOBILE HAMBURGER ── */
  const burger = document.getElementById('nav-burger');
  const mobileNav = document.getElementById('nav-mobile');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ── LOGO FALLBACK ── */
  // If PNG logo fails to load, show SVG fallback
  const logoImg = document.getElementById('logo-img');
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      const fallback = document.getElementById('logo-fallback');
      if (fallback) { logoImg.style.display = 'none'; fallback.style.display = 'flex'; }
    });
    // If already broken (cached 404)
    if (!logoImg.complete || logoImg.naturalWidth === 0) {
      logoImg.dispatchEvent(new Event('error'));
    }
  }

  /* ── REVEAL ON SCROLL ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-pop');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));

  /* ── HERO REVEALS FIRE IMMEDIATELY ── */
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal, .hero .reveal-left, .hero .reveal-pop, .page-hero .reveal').forEach(el => el.classList.add('visible'));
  }, 60);

});