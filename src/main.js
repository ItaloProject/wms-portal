import { applyPerfClass } from './lib/perf.js';
import './styles.css';
import { initCursor, initMagneticButtons, initTiltCards, initFormFeedback, initDiagnosticForm } from './effects/interactions.js';
import { initHeroLogo } from './lib/hero-logo.js';
import { initTeamGallery } from './lib/team-gallery.js';
import { initSmoothScroll, initLoader, initHeroAnimations, initScrollAnimations } from './effects/scroll.js';

applyPerfClass();
initSmoothScroll();

initLoader(() => {
  initHeroAnimations();
  initHeroLogo();
  initTeamGallery();
  initScrollAnimations();
  initFormFeedback();
  initDiagnosticForm();
  initCursor();
  initMagneticButtons();
  initTiltCards();
});
