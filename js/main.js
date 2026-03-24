/* ══════════════════════════════════════════════
   TU CASA CON LAURA — main.js
   - Nav hamburger
   - Scroll-reveal (IntersectionObserver)
   - Lazy loading de imágenes
   - Lightbox (galería)
   ══════════════════════════════════════════════ */

/* ══════════════════════════
   NAV HAMBURGER
   ══════════════════════════ */
(function () {
  const burger = document.getElementById('nav-burger');
  const mobile = document.getElementById('nav-mobile');
  if (!burger || !mobile) return;

  burger.addEventListener('click', () => {
    const isOpen = mobile.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Cerrar al hacer click en un link
  mobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('open');
      burger.classList.remove('open');
    });
  });
})();

/* ══════════════════════════
   SCROLL-REVEAL
   Activa la clase .is-visible cuando el elemento
   entra al 12% del viewport
   ══════════════════════════ */
(function () {
  // Agrega data-reveal automáticamente a secciones clave
  // si el HTML no los tiene todavía
  function autoTag() {
    const selectors = [
      '.spec-card',
      '.post-card',
      '.article-card',
      '.gallery-item',
      '.vcard',
      '.contact-row',
      '.about-copy p',
      '.about-badges',
      '.social-pills',
      '.intro-body',
      '.intro-label',
      '.stat-num',
      '.contact-strip',
      '.footer-grid > div',
      '.sidebar-card',
      '.featured-post',
      '.vid-cta-block',
      '.vid-intro-text',
    ];

    selectors.forEach((sel, si) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (!el.hasAttribute('data-reveal')) {
          el.setAttribute('data-reveal', 'up');
          // Escalonado: máximo 5 delays
          const delay = Math.min(i + 1, 5);
          el.setAttribute('data-reveal-delay', delay);
        }
      });
    });

    // Elementos individuales con dirección específica
    const leftEl = document.querySelectorAll('.about-photo-wrap, .hero-left');
    leftEl.forEach(el => {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'left');
    });

    const rightEl = document.querySelectorAll('.about-wrap > div:last-child, .contact-strip-right');
    rightEl.forEach(el => {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'right');
    });
  }

  function initObserver() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Solo anima una vez
          }
        });
      },
      {
        threshold: 0.1,   // 10% del elemento visible dispara la animación
        rootMargin: '0px 0px -40px 0px', // Un poco antes del borde inferior
      }
    );

    els.forEach(el => observer.observe(el));
  }

  // Si el navegador no soporta IntersectionObserver, mostrar todo
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    return;
  }

  autoTag();
  initObserver();
})();

/* ══════════════════════════
   LAZY LOADING DE IMÁGENES
   Usa native loading="lazy" + clases para skeleton
   ══════════════════════════ */
(function () {
  // Agrega loading="lazy" a todas las imágenes no críticas
  // (las del hero NO se hacen lazy — deben cargar de inmediato)
  const skipClasses = ['hero-photo', 'nav-logo-img', 'footer-logo-img'];

  document.querySelectorAll('img').forEach(img => {
    const isSkip = skipClasses.some(cls => img.classList.contains(cls));
    if (isSkip) return;

    // Native lazy loading
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');

    // Skeleton shimmer hasta que cargue
    img.classList.add('lazy');
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
    }
  });
})();

/* ══════════════════════════
   LIGHTBOX (galería de fotos)
   ══════════════════════════ */
(function () {
  const lb       = document.getElementById('lightbox');
  const lbOverlay = document.getElementById('lb-overlay');
  const lbImg    = document.getElementById('lb-img');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');
  if (!lb) return;

  let images  = [];
  let current = 0;

  function open(idx) {
    current = idx;
    lbImg.src = images[current];
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  function prev() { current = (current - 1 + images.length) % images.length; lbImg.src = images[current]; }
  function next() { current = (current + 1) % images.length; lbImg.src = images[current]; }

  // Recoger imágenes de la galería
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    const img = item.querySelector('img');
    if (!img) return;
    images.push(img.src);
    item.addEventListener('click', () => open(i));
  });

  if (lbClose)   lbClose.addEventListener('click', close);
  if (lbOverlay) lbOverlay.addEventListener('click', close);
  if (lbPrev)    lbPrev.addEventListener('click', prev);
  if (lbNext)    lbNext.addEventListener('click', next);

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
})();

/* ══════════════════════════
   PARALLAX SUTIL EN HERO
   La foto del hero se desplaza levemente al hacer scroll
   ══════════════════════════ */
(function () {
  const heroPhoto = document.querySelector('.hero-photo');
  if (!heroPhoto) return;

  // Solo en desktop (no en móvil para mejor rendimiento)
  const mq = window.matchMedia('(min-width: 860px)');
  if (!mq.matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Desplazamiento máximo: 60px hacia abajo
        const offset = Math.min(scrollY * 0.25, 60);
        heroPhoto.style.transform = `translateY(${offset}px) translateZ(0)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();