// About page (plan §6): scrollytelling beats, founders, press marquee,
// repeated pull-quote.
import { gsap, reducedMotion } from './core.js';
import { revealLines, fadeUpGroup, wordScrub, initReducedMotionFades } from './fx.js';

export async function init() {
  await document.fonts.ready;

  if (reducedMotion) {
    initReducedMotionFades('.page-hero h1, .story-beat, .founder-card, .press-quote, .invite-inner');
    return;
  }

  revealLines(document.querySelector('.page-hero h1'));

  // Three beats, each a masked text reveal
  document.querySelectorAll('.story-beat').forEach((beat) => revealLines(beat));

  fadeUpGroup(document.querySelectorAll('.founder-card'), '.founders-grid');

  // Gentle infinite press marquee, duplicated for a seamless loop
  const track = document.querySelector('[data-press-track]');
  track.innerHTML += track.innerHTML + track.innerHTML;
  gsap.to(track, { xPercent: -33.333, duration: 22, ease: 'none', repeat: -1 });

  wordScrub(document.querySelector('.press-quote .quote-text'));
  gsap.from(['.press-quote cite', '.press-links'], {
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.12,
    scrollTrigger: { trigger: '.press-quote cite', start: 'top 88%', once: true },
  });

  revealLines(document.querySelector('.invite h2'), { trigger: '.invite' });
  fadeUpGroup(document.querySelectorAll('.invite-details, .invite .btn'), '.invite');
}
