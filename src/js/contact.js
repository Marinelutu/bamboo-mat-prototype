// Contact page (plan §7): entrance reveals only.
import { reducedMotion } from './core.js';
import { revealLines, fadeUpGroup, initReducedMotionFades } from './fx.js';

export async function init() {
  await document.fonts.ready;

  if (reducedMotion) {
    initReducedMotionFades('.contact-info h1, .contact-block, .contact-ctas');
    return;
  }

  revealLines(document.querySelector('.contact-info h1'));
  fadeUpGroup(
    document.querySelectorAll('.contact-block, .contact-ctas'),
    '.contact-blocks',
    { y: 22 },
  );
}
