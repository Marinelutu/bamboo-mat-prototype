// Entry point for every page (plan §1):
// Lenis init → preloader → nav → page transitions → reserve overlay → page module.
import './core.js';
import { mountShell, initStickyPill, initMagnetic } from './shell.js';
import { initPreloader } from './preloader.js';
import { initTransitions } from './transitions.js';
import { initNav } from './nav.js';
import { initReserve } from './reserve.js';

mountShell();
const revealOwned = initPreloader();
initTransitions(revealOwned);
initNav();
initReserve();
initStickyPill();
initMagnetic();

// Page-specific modules, loaded on demand (filled in as pages are built).
const pageModules = {
  home: () => import('./home.js'),
};

pageModules[document.body.dataset.page]?.().then((mod) => mod.init?.());
