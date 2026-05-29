export function initTestimonialSlider() {
  const viewport = document.querySelector('.testimonials-viewport');
  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.testimonials-arrow--prev');
  const nextBtn = document.querySelector('.testimonials-arrow--next');
  const dots = document.querySelectorAll('.testimonials-dot');

  if (!viewport || !track) return;

  const cards = [...track.querySelectorAll('.testimonial-card')];
  const total = cards.length;
  if (total < 2) return;

  let current = 0;
  let timer = null;
  let direction = 1;
  let pointerStartX = 0;
  let pointerStartTime = 0;

  const go = (index, animate = true) => {
    current = Math.max(0, Math.min(total - 1, index));

    if (!animate) track.style.transition = 'none';

    // step = largura de um card + gap (todos os cards têm a mesma largura)
    const cardW = cards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
    const step = cardW + gap;
    const center = Math.max(0, (viewport.offsetWidth - cardW) / 2);

    track.style.transform = `translateX(${-(current * step - center)}px)`;

    if (!animate) {
      requestAnimationFrame(() => { track.style.transition = ''; });
    }

    cards.forEach((c, i) => c.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-selected', String(i === current));
    });

    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;
  };

  const autoAdvance = () => {
    const next = current + direction;
    if (next >= total) { direction = -1; go(current - 1); }
    else if (next < 0) { direction = 1; go(current + 1); }
    else { go(next); }
  };

  const startTimer = () => {
    clearInterval(timer);
    timer = setInterval(autoAdvance, 5500);
  };

  const stopTimer = () => clearInterval(timer);

  prevBtn?.addEventListener('click', () => { direction = -1; go(current - 1); startTimer(); });
  nextBtn?.addEventListener('click', () => { direction = 1; go(current + 1); startTimer(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); startTimer(); }));

  viewport.addEventListener('mouseenter', stopTimer);
  viewport.addEventListener('mouseleave', startTimer);
  viewport.addEventListener('focusin', stopTimer);
  viewport.addEventListener('focusout', startTimer);

  track.addEventListener('pointerdown', (e) => {
    pointerStartX = e.clientX;
    pointerStartTime = Date.now();
    track.setPointerCapture(e.pointerId);
  }, { passive: true });

  track.addEventListener('pointerup', (e) => {
    const dx = pointerStartX - e.clientX;
    const dt = Date.now() - pointerStartTime;
    if (Math.abs(dx) > 50 && dt < 500) {
      const target = current + (dx > 0 ? 1 : -1);
      direction = dx > 0 ? 1 : -1;
      go(target);
      startTimer();
    }
  }, { passive: true });

  window.addEventListener('resize', () => requestAnimationFrame(() => go(current, false)), { passive: true });

  go(0, false);
  startTimer();
}
