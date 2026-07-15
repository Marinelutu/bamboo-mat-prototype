// Experiences page (plan §5): parallax blocks + reveals.
import { reducedMotion } from './core.js';
import { revealLines, parallaxImg, fadeUpGroup, initReducedMotionFades } from './fx.js';

export async function init() {
  await document.fonts.ready;

  if (reducedMotion) {
    initReducedMotionFades('.page-hero h1, .xp-copy, .invite-inner');
    return;
  }

  revealLines(document.querySelector('.page-hero h1'));

  document.querySelectorAll('.xp-block').forEach((block) => {
    parallaxImg(block.querySelector('.img-mask'));
    revealLines(block.querySelector('h2'), { trigger: block });
    fadeUpGroup(
      block.querySelectorAll('.eyebrow, .measure, .xp-details, .xp-list li, .btn'),
      block,
      { y: 22 },
    );
  });

  revealLines(document.querySelector('.invite h2'), { trigger: '.invite' });
  fadeUpGroup(document.querySelectorAll('.invite-details, .invite .btn'), '.invite');
}
