const PX_PER_SEC = 42;
const MINI_SPEED_FACTOR = 1.35;

function cloneLoop(track, selector) {
  const items = [...track.querySelectorAll(selector)];
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    if (clone.tagName === 'ARTICLE') {
      clone.removeAttribute('data-index');
    }
    clone.querySelectorAll('img').forEach((img) => {
      img.alt = '';
    });
    track.appendChild(clone);
  });
}

function bindDuration(track, speed = PX_PER_SEC) {
  const sync = () => {
    const loopWidth = track.scrollWidth / 2;
    if (loopWidth <= 0) return;
    track.style.setProperty('--equipe-duration', `${loopWidth / speed}s`);
  };

  track.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', sync, { once: true });
  });

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(sync);
    observer.observe(track);
  }

  window.addEventListener('load', sync, { once: true });
  window.addEventListener('resize', sync, { passive: true });
  requestAnimationFrame(() => requestAnimationFrame(sync));
}

export function initTeamGallery() {
  const section = document.querySelector('.equipe-section');
  const showcase = section?.querySelector('.equipe-showcase');
  const track = section?.querySelector('.equipe-track--main');
  const cityTrack = section?.querySelector('.equipe-track--cidade');
  if (!section || !showcase || !track) return;

  const originals = [...track.querySelectorAll('.equipe-slide')];
  if (originals.length < 2) return;

  cloneLoop(track, '.equipe-slide');
  bindDuration(track);

  if (cityTrack) {
    cloneLoop(cityTrack, '.equipe-mini-frame');
    bindDuration(cityTrack, PX_PER_SEC * MINI_SPEED_FACTOR);
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      section.classList.toggle('in-view', entry.isIntersecting);
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );

  observer.observe(section);
}
