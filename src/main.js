import { applyPerfClass } from './lib/perf.js';
import './styles.css';
import { initCursor, initMagneticButtons, initTiltCards, initFormFeedback, initDiagnosticForm, initMobileNav, initBadgeRotator } from './effects/interactions.js';
import { initHeroLogo } from './lib/hero-logo.js';
import { initTeamGallery } from './lib/team-gallery.js';
import { initSmoothScroll, initLoader, initHeroAnimations, initScrollAnimations } from './effects/scroll.js';
import { initHeroCharReveal } from './lib/char-split.js';
import { initTestimonialSlider } from './lib/testimonial-slider.js';
import { initAmbientGlow } from './lib/ambient-glow.js';
import { initHeroMesh } from './lib/hero-mesh.js';
import { initLocalParallax } from './lib/brand-polish.js';

applyPerfClass();
initSmoothScroll();

initLoader(() => {
  initHeroCharReveal();
  initHeroAnimations();
  initHeroLogo();
  initHeroMesh();
  initAmbientGlow();
  initTeamGallery();
  initTestimonialSlider();
  initScrollAnimations();
  initLocalParallax();
  initBadgeRotator();
  initFormFeedback();
  initDiagnosticForm();
  initMobileNav();

  const runEffects = () => {
    initCursor();
    initMagneticButtons();
    initTiltCards();
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(runEffects, { timeout: 1200 });
  } else {
    setTimeout(runEffects, 150);
  }
});
