import { getPerfTier } from './perf.js';

export function initHeroCharReveal() {
  if (getPerfTier() === 'minimal') return;

  const words = document.querySelectorAll('.hero-title .word');
  if (!words.length) return;

  let globalIndex = 0;

  words.forEach((word) => {
    const text = word.textContent;
    const isHighlight = word.classList.contains('highlight');

    word.setAttribute('aria-label', text);
    word.textContent = '';

    if (isHighlight) word.classList.add('chars-active');

    [...text].forEach((char) => {
      const span = document.createElement('span');
      span.setAttribute('aria-hidden', 'true');

      if (char === ' ') {
        span.className = 'char char-space';
        span.textContent = ' ';
      } else {
        span.className = 'char';
        span.textContent = char;
        span.style.setProperty('--char-i', String(globalIndex++));
      }

      word.appendChild(span);
    });
  });

  // Desativa animação de linha — chars assumem o reveal
  document.querySelectorAll('.hero-title .title-line').forEach((line) => {
    line.style.opacity = '1';
    line.style.transform = 'none';
    line.style.animation = 'none';
  });
}
