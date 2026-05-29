import { initCustomSelects } from '../lib/custom-select.js';
import { canUseRichMotion } from '../lib/perf.js';

export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('mousedown', (e) => {
    const ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
}

export function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.magnetic-btn:not(.floating-cta)').forEach((btn) => {
    const strength = Number.parseFloat(btn.dataset.strength || '0.22');

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

export function initTiltCards() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!canUseRichMotion()) return;

  const cards = document.querySelectorAll('.service-card, .bento-card, .testimonial-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width;
      const py = y / rect.height;

      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);

      if (card.classList.contains('testimonial-card')) return;
      const rotateX = (0.5 - py) * 4;
      const rotateY = (px - 0.5) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
      card.style.transform = '';
    });
  });
}
export function initFormFeedback() {
  document.querySelector('.cta-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-primary span');
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = 'Enviado! ✓';
    btn.parentElement?.classList.add('is-sent');
    window.setTimeout(() => {
      btn.textContent = original;
      btn.parentElement?.classList.remove('is-sent');
    }, 3000);
  });
}

export function initDiagnosticForm() {
  const form = document.querySelector('.diagnostico-form');
  if (!form) return;

  initCustomSelects(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const result = form.querySelector('.diagnostico-result');
    const data = new FormData(form);
    const segmento = data.get('segmento');
    const regime = data.get('regime');
    const equipe = data.get('equipe');

    if (!segmento || !regime || !equipe) {
      result.textContent = 'Preencha os campos para gerar uma leitura inicial.';
      result.classList.add('is-visible');
      return;
    }

    const regimeMsg = regime === 'Não sei'
      ? 'O primeiro ponto é identificar o regime correto e possíveis riscos fiscais.'
      : `Para empresas no ${regime}, vale revisar apuração, obrigações e oportunidades tributárias.`;

    result.textContent = `${segmento} com ${equipe} funcionários: ${regimeMsg} A WMS pode montar um plano de rotina contábil e fiscal sob medida.`;
    result.classList.add('is-visible');
  });
}

export function initBadgeRotator() {
  const textEl = document.querySelector('.badge-text');
  if (!textEl) return;

  const phrases = [
    'CRC • Fiscal • DP • Estratégia',
    'Especialistas em contabilidade',
    'Atendimento consultivo',
    'Conformidade e crescimento',
  ];

  let idx = 0;

  // Começa após as animações de entrada do hero (~2s)
  setTimeout(() => {
    setInterval(() => {
      textEl.classList.add('is-fading');
      setTimeout(() => {
        idx = (idx + 1) % phrases.length;
        textEl.textContent = phrases[idx];
        textEl.classList.remove('is-fading');
      }, 370);
    }, 3500);
  }, 2200);
}

export function initMobileNav() {
  const nav = document.getElementById('nav');
  const toggle = nav?.querySelector('.nav-toggle');
  const backdrop = nav?.querySelector('.nav-backdrop');
  const links = nav?.querySelectorAll('.nav-link');
  if (!nav || !toggle) return;

  const mq = window.matchMedia('(max-width: 768px)');

  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const open = () => {
    if (!mq.matches) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  toggle.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) close();
    else open();
  });

  backdrop?.addEventListener('click', close);
  links?.forEach((link) => link.addEventListener('click', close));

  mq.addEventListener('change', (e) => {
    if (!e.matches) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
