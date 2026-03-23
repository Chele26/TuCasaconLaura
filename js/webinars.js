/* ── webinars.js ── */
// Lazy-loads YouTube iframes only when the user clicks play
// Usage: add data-yt-id="VIDEO_ID" to any .yt-embed element

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.yt-embed').forEach(el => {
    const id = el.dataset.ytId;
    if (!id) return;

    const thumb = el.querySelector('.yt-thumb');
    const btn   = el.querySelector('.yt-play-btn');

    function loadVideo() {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      el.style.paddingBottom = '56.25%';
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      if (thumb) thumb.remove();
      if (btn)   btn.remove();
      el.appendChild(iframe);
    }

    if (btn)   btn.addEventListener('click', loadVideo);
    if (thumb) thumb.addEventListener('click', loadVideo);
  });

});