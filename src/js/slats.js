// Makisu slat system — the bamboo rolling mat motif (plan §2).
// Shared by the preloader, page transitions and the reserve overlay backdrop.
import { gsap } from './core.js';

export const SLAT_COUNT = 14;

/** Fill a container with vertical slats. Returns the slat elements. */
export function buildSlats(container) {
  container.innerHTML = '';
  const slats = [];
  for (let i = 0; i < SLAT_COUNT; i += 1) {
    const slat = document.createElement('div');
    slat.className = 'slat';
    container.appendChild(slat);
    slats.push(slat);
  }
  return slats;
}

/** Slats roll IN (cover the screen), right-to-left by default. */
export function rollIn(slats, { duration = 0.5, fromRight = true } = {}) {
  gsap.set(slats, { transformOrigin: fromRight ? 'right center' : 'left center' });
  return gsap.fromTo(
    slats,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration,
      ease: 'power3.inOut',
      stagger: { each: 0.04, from: fromRight ? 'end' : 'start' },
    },
  );
}

/** Slats roll OUT (reveal the page), left-to-right by default. */
export function rollOut(slats, { duration = 0.6, fromLeft = true } = {}) {
  gsap.set(slats, { transformOrigin: fromLeft ? 'left center' : 'right center' });
  return gsap.to(slats, {
    scaleX: 0,
    duration,
    ease: 'power3.inOut',
    stagger: { each: 0.04, from: fromLeft ? 'start' : 'end' },
  });
}
