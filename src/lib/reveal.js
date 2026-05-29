export function initRevealObserver(selectors = '.reveal-up, .reveal-left, .bento-card, .service-card, .testimonial-card, .section-title, .cta-title, .cta-sub, .cta-form') {
  const nodes = document.querySelectorAll(selectors);
  if (!nodes.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed', 'visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  nodes.forEach((node) => observer.observe(node));
}

export function initSectionObserver(selector, className = 'in-view', threshold = 0.35) {
  const sections = document.querySelectorAll(selector);
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle(className, entry.isIntersecting);
    });
  }, { threshold });

  sections.forEach((section) => observer.observe(section));
}
