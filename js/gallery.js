/* ── gallery.js ── */

document.addEventListener('DOMContentLoaded', () => {

  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Build lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div id="lb-overlay"></div>
    <div id="lb-box">
      <button id="lb-close" aria-label="Close">&#x2715;</button>
      <button id="lb-prev" aria-label="Previous">&#8592;</button>
      <img id="lb-img" src="" alt="">
      <p id="lb-caption"></p>
      <button id="lb-next" aria-label="Next">&#8594;</button>
    </div>
  `;
  document.body.appendChild(lb);

  const lbEl    = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbCap   = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbPrev  = document.getElementById('lb-prev');
  const lbNext  = document.getElementById('lb-next');
  const lbOver  = document.getElementById('lb-overlay');

  let current = 0;
  const images = Array.from(items).map(el => ({
    src:     el.dataset.full  || el.querySelector('img')?.src || '',
    caption: el.dataset.caption || ''
  }));

  function open(i) {
    current = i;
    lbImg.src = images[i].src;
    lbCap.textContent = images[i].caption;
    lbEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lbEl.classList.remove('open');
    document.body.style.overflow = '';
  }
  function prev() { open((current - 1 + images.length) % images.length); }
  function next() { open((current + 1) % images.length); }

  items.forEach((el, i) => el.addEventListener('click', () => open(i)));
  lbClose.addEventListener('click', close);
  lbOver.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  document.addEventListener('keydown', e => {
    if (!lbEl.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

});