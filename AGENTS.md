# Bamboo Mat prototype — agent notes

- Read `bamboo-mat-prototype-plan.md` before changing anything; it is the source of truth for design tokens, copy, prices and the acceptance checklist.
- Stack: Vite multi-page app, vanilla JS/HTML/CSS, GSAP (ScrollTrigger, SplitText), Lenis. No framework, no backend.
- `--aji` gold is scarce by design: reserve CTAs, one italic word per headline, active states. If gold appears more than ~3 times per viewport, remove one.
- The makisu slat motif is only allowed in three places: preloader, page transitions, section tick-dividers.
- Animate only `transform`/`opacity`; every motion feature needs a `prefers-reduced-motion` fallback.
- All copy and prices are real (from the live site) — never replace with lorem ipsum or invented prices.
