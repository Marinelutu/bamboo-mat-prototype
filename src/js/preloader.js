// Makisu preloader (plan §2): full-height slats cover the screen, the logo
// fades in, then the slats roll away left-to-right. First visit per session
// only; skippable; ≤ 1.6s total.
import { gsap, reducedMotion } from './core.js';
import { buildSlats, rollOut } from './slats.js';
import { markRevealed } from './reveal.js';

const html = document.documentElement;

/** Returns true when the preloader owns the reveal for this load. */
export function initPreloader() {
  const firstVisit = html.classList.contains('is-first-visit');

  try {
    sessionStorage.setItem('bm:visited', '1');
  } catch {
    /* private mode — the preloader will simply replay next load */
  }

  if (!firstVisit) return false;

  // Reduced motion: no animation, straight to content (plan §1).
  if (reducedMotion) {
    html.classList.remove('is-first-visit');
    markRevealed();
    return true;
  }

  const layer = document.querySelector('[data-slats-layer]');
  const slats = buildSlats(layer);
  layer.classList.add('is-active');
  layer.insertAdjacentHTML(
    'beforeend',
    `<img class="preloader-brand" src="/assets/img/bamboo_logo.svg" alt="" />
     <button type="button" class="preloader-skip mono">Skip</button>`,
  );
  const brand = layer.querySelector('.preloader-brand');
  const skip = layer.querySelector('.preloader-skip');

  // Slats take over from the CSS paint cover before it drops.
  gsap.set(slats, { scaleX: 1 });
  html.classList.remove('is-first-visit');

  const tl = gsap.timeline({
    onComplete: () => {
      layer.classList.remove('is-active');
      layer.innerHTML = '';
      markRevealed();
    },
  });

  tl.fromTo(brand, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' })
    .to(brand, { autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, '+=0.35')
    .to(skip, { autoAlpha: 0, duration: 0.15 }, '<')
    .add(rollOut(slats, { duration: 0.55 }), '-=0.05');

  skip.addEventListener('click', () => tl.progress(1), { once: true });

  return true;
}
