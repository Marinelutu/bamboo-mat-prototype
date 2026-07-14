// Entry point for every page: core → shell → page module (plan §1).
import './core.js';

// Global shell (nav, footer, preloader, transitions, reserve overlay)
// mounts here in build-order step 3. Until then, release the paint cover.
document.documentElement.classList.remove('is-first-visit', 'is-arriving');
try {
  sessionStorage.setItem('bm:visited', '1');
} catch {
  /* private mode — preloader will simply replay */
}

// Page-specific modules, loaded on demand (filled in as pages are built).
const pageModules = {};

const page = document.body.dataset.page;
pageModules[page]?.().then((mod) => mod.init?.());
