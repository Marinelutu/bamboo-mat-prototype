// Makisu page transitions (plan §2): internal link clicks roll the slats in
// right-to-left, then navigate; the next page rolls them out. The MPA feels
// like one continuous space.
import { reducedMotion, gsap } from './core.js';
import { buildSlats, rollIn, rollOut } from './slats.js';
import { markRevealed } from './reveal.js';

const html = document.documentElement;

function isInternalNavigation(anchor) {
  if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return false;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  // Same-page hash links scroll, they don't navigate.
  if (url.pathname === window.location.pathname && url.hash) return false;
  return true;
}

/** @param {boolean} revealOwned true when the preloader already owns the reveal */
export function initTransitions(revealOwned) {
  const arriving = html.classList.contains('is-arriving');
  try {
    sessionStorage.removeItem('bm:leaving');
  } catch {
    /* ignore */
  }

  if (reducedMotion) {
    html.classList.remove('is-arriving');
    if (!revealOwned) markRevealed();
    return;
  }

  const layer = document.querySelector('[data-slats-layer]');

  // Arrival: slats start covering the page, then roll away.
  if (arriving && !revealOwned) {
    const slats = buildSlats(layer);
    layer.classList.add('is-active');
    gsap.set(slats, { scaleX: 1, transformOrigin: 'left center' });
    html.classList.remove('is-arriving');
    rollOut(slats, { duration: 0.5 }).then(() => {
      layer.classList.remove('is-active');
      layer.innerHTML = '';
      markRevealed();
    });
  } else if (!revealOwned) {
    markRevealed();
  }

  // Departure: intercept internal clicks, roll slats in, then navigate.
  let leaving = false;
  document.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href]');
    if (!isInternalNavigation(anchor)) return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;

    const slats = buildSlats(layer);
    layer.classList.add('is-active');
    rollIn(slats, { duration: 0.5 }).then(() => {
      try {
        sessionStorage.setItem('bm:leaving', '1');
      } catch {
        /* ignore */
      }
      window.location.href = anchor.href;
    });
  });

  // Restored from bfcache with slats still covering: clean up.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      leaving = false;
      layer.classList.remove('is-active');
      layer.innerHTML = '';
    }
  });
}
