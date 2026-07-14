# BAMBOO MAT — Website Prototype Implementation Plan

> Brief for Claude Code. Build a front-end-only prototype of a fully redesigned website for
> Bamboo Mat, a Nikkei (Peruvian–Japanese) restaurant in Stratford, East London.
> Goal: a cinematic, premium, motion-rich site that makes the current site
> (https://bamboo-mat.co.uk — dated Elementor build) look obsolete in a client pitch.
> No backend, no CMS, no real booking. Every interactive element should *feel* real.

---

## 1. Project setup & stack

- **Vite** multi-page app (vanilla JS + HTML + CSS). No framework — fastest path to buttery custom animation.
- **GSAP** (npm `gsap`) with **ScrollTrigger** and **SplitText** plugins (GSAP and all its plugins are free as of 2025).
- **Lenis** (npm `lenis`) for smooth scrolling, wired into ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` and a `gsap.ticker` loop.
- Google Fonts loaded in `<head>` with `preconnect`.
- Vite config: multi-page inputs for `index.html`, `menu.html`, `experiences.html`, `about.html`, `gallery.html`, `contact.html`.

```
project/
├─ index.html            (Home)
├─ menu.html
├─ experiences.html
├─ about.html
├─ gallery.html
├─ contact.html
├─ src/
│  ├─ styles/            base.css, tokens.css, components.css, pages/*.css
│  ├─ js/                main.js, preloader.js, nav.js, transitions.js,
│  │                     reserve.js, home.js, menu.js, gallery.js, data/menu-data.js
├─ public/assets/img/    (downloaded photos, see §8)
└─ vite.config.js
```

Every page imports `main.js`, which runs: Lenis init → preloader (first visit per session only, use `sessionStorage`) → nav → page transitions → reserve overlay → page-specific module.

**Respect `prefers-reduced-motion`:** if set, skip preloader animation, disable Lenis, replace all scroll animations with simple opacity fades.

---

## 2. Design system (tokens.css)

### Concept
"**Neon Nikkei, candle-lit.**" Not a generic black site — a *dim dining room* with warm shadows,
where colour comes from the food itself: the gold of ají amarillo, the green of bamboo and shiso,
the cream of leche de tigre. Editorial restraint like a fine-dining site (Khufu's-style typography),
sensory warmth like Ballena, appetite like Burrito Madre's food grids.

### Colors
```css
:root {
  --sumi:        #171814;  /* warm charcoal, page background — NOT pure black */
  --nori:        #1F221B;  /* raised surfaces, cards, alt sections */
  --tigersmilk:  #EFEAD9;  /* warm cream — primary text on dark */
  --tigersmilk-60: rgba(239,234,217,.6);  /* secondary text */
  --bamboo:      #8FA974;  /* leaf green — structural accents, labels, hover states.
                              IMPORTANT: sample the exact green from the real logo
                              (public/assets/img/bamboo_logo.svg) and adjust to match. */
  --aji:         #E4A339;  /* ají amarillo gold — the ONLY CTA/appetite color.
                              Reserve buttons, prices on hover, italic highlights. */
  --line:        rgba(239,234,217,.14); /* hairlines, slat dividers */
}
```
Rule: `--aji` is scarce. Reserve buttons, one italic word per headline max, active states. If gold appears more than ~3 times per viewport, remove one.

### Typography (Google Fonts)
- **Display:** `Instrument Serif` (400 + 400 italic). All big headlines. Italic is reserved for the one emphasised word per headline (Khufu's pattern): `WHERE <em>TOKYO</em> MEETS <em>LIMA</em>`.
- **Body/UI:** `Instrument Sans` (400/500/600).
- **Labels/eyebrows:** `Space Mono` (400), uppercase, letter-spacing .14em, 11–12px. Used for chapter markers (`01 — THE CUISINE`), prices, nav links, dietary tags.

Type scale (fluid with `clamp`):
```css
--display-xl: clamp(3rem, 9vw, 8.5rem);   /* hero */
--display-lg: clamp(2.4rem, 6vw, 5.5rem); /* section heads */
--display-md: clamp(1.8rem, 3.5vw, 3rem);
--body: clamp(1rem, 1.1vw, 1.125rem);
--mono-label: 0.72rem;
```
Line-height for display: 0.95–1.05. Body: 1.6. Max body column width: 34em.

### Signature element — the Makisu (bamboo rolling mat)
The one memorable device, drawn from the restaurant's own name. A "makisu" motif of **thin vertical slats** appears in exactly three places:
1. **Preloader:** the screen is covered by ~14 full-height vertical slats (`--nori` with 1px `--line` gaps). Logo fades in centered, then the slats "roll away" — each slat scales `scaleX: 1 → 0` (transform-origin left), staggered 0.04s left-to-right with `power3.inOut`, revealing the hero underneath. Total ≤ 1.6s. "Skip" text button bottom-right.
2. **Page transitions:** intercept internal `<a>` clicks → slats roll IN (right-to-left, 0.5s) → `window.location` → on next page load slats roll OUT. Feels like a seamless SPA.
3. **Section dividers:** a subtle horizontal strip of short vertical ticks (like the edge of a rolled mat) between major sections instead of plain `<hr>`.
Do not use the slat pattern anywhere else.

### Core components
- **Nav (all pages):** fixed top, transparent over hero → gains `--sumi` background + bottom hairline after 80px scroll (add class via ScrollTrigger). Left: logo (SVG, ~110px). Center (desktop): mono links — MENU / EXPERIENCES / ABOUT / GALLERY / CONTACT. Right: `RESERVE` button (outlined, `--aji` text; fills gold with `--sumi` text on hover, 200ms). Mobile: logo + RESERVE + burger; burger opens full-screen `--nori` overlay with display-size links stacked, staggered fade-up, plus address + Instagram at bottom.
- **Reserve overlay (reserve.js, all pages):** clicking any RESERVE opens a full-screen overlay (slats roll in, panel fades): a mock booking flow — step pills for Party size (1–8+), Date (next 14 days, horizontal scroll chips), Time (12:00–21:30 slots). Selecting all three enables "Confirm booking" → success state: big Instrument Serif "See you at the mat." + summary line + "This is a design prototype — bookings via Design My Night" in mono small print. Purely front-end state.
- **Magnetic buttons:** Reserve buttons get a subtle magnetic hover (translate toward cursor within 8px, spring back). Desktop only.
- **Sticky reserve pill:** after scrolling past the hero, a small floating `RESERVE` pill fades in bottom-right (hidden when footer in view). All pages.
- **Footer (all pages):** `--nori`. Left: logo + "Nikkei dining in East London — Est. 2022". Middle: mono link columns (Pages / Visit). Right: address block — 21-24 Victory Parade, East Village, London E20 1FS · bamboomatuk@gmail.com · Instagram @_bamboomatstratford. Bottom hairline row: © 2026 Bamboo Mat · a makisu tick-strip divider above.

---

## 3. Home page (index.html) — section by section

Chaptered, cinematic scroll. Each chapter opens with a mono eyebrow (`01 — THE CUISINE` style). The numbering encodes the narrative sequence of the visit: arrive → taste → choose → meet the chefs → see the room → book.

### 3.1 Hero
- Full-viewport (100svh). Background: `hero.jpg` (pick the strongest interior/dish photo, see §8) with a slow Ken Burns (scale 1.08 → 1 over 12s on load) + a dark gradient overlay (`--sumi` 65% at edges, 25% center) + a very subtle CSS film-grain overlay (tiling noise PNG or SVG turbulence at ~4% opacity).
- Headline (Instrument Serif, --display-xl, split over 3 lines, Ballena-style with the logo inline):
  `WHERE *TOKYO*` / `[small logo mark]` / `MEETS *LIMA*` — italic words in `--aji`.
- Under it, mono line: `NIKKEI DINING · STRATFORD, LONDON · EST. 2022`.
- One CTA: RESERVE A TABLE (gold outline button) + ghost secondary "Explore the menu".
- On load (after preloader): SplitText the headline into lines, masked rise (yPercent 110 → 0, stagger 0.12, power4.out), then mono line + CTAs fade.
- Bottom center: `SCROLL` mono label with a 1px vertical line that pulses.
- Hero content parallaxes up slightly and fades as you scroll away (ScrollTrigger scrub).

### 3.2 The Quote (credibility moment)
- Full-width, `--sumi`, generous vertical padding (~45vh feel).
- Giant Instrument Serif italic, centered: “Plates of Peruvian joy.”
- SplitText into words; each word fades from `--tigersmilk-60` → `--tigersmilk` scrubbed to scroll (Khufu's-style progressive text reveal).
- Below, mono: `GRACE DENT — THE GUARDIAN`.

### 3.3 Chapter 01 — The Cuisine (trio, Khufu's pattern)
Three alternating rows (image 55% / text 45%, alternating sides):
1. **Cured in citrus** — Ceviche & Tiradito. Copy: “Seabass in passion-fruit tiger’s milk. Yellowtail under yuzu-truffle soy. The Peruvian coast, cut with a Japanese knife.” Link: View the raw bar →
2. **Rolled by hand** — Sushi & Maki. Copy: “From classic nigiri to the Bamboo Maki — crisp nobashi shrimp, bluefin tuna, acevichado sauce. Precision from Tokyo, fire from Lima.” Link: View the sushi →
3. **Kissed by fire** — Anticucho & the grill. Copy: “Anticucho glaze, charred octopus, A4 wagyu finished aburi-style. A nod to Peruvian streets, where fire meets flavour.” Link: View the grill →
- Images: parallax inside a masked container (image 115% height, `y` scrubbed ±8%), subtle `scale 1.05 → 1` as they enter. Headlines: masked line rise on enter. Each links to the matching `menu.html` anchor.

### 3.4 Chapter 02 — Signature dishes (horizontal scroll, appetite section)
- Pinned section (ScrollTrigger `pin: true`, horizontal `x` scrub) that scrolls a track of 6 large dish cards sideways; ~300vh scroll distance. On mobile: unpinned, native horizontal swipe with scroll-snap.
- Cards (~70vh tall, 4:5): photo, dark gradient bottom, then mono price top-right, Instrument Serif dish name, one-line description.
  Use real dishes: Seabass Ceviche £12.50 · Bamboo Maki £22 · Chicken Anticucho £17 · Grilled Octopus £22.50 · Nikkei Nigiri Set £18 · Rib-eye Steak £35.
- Card hover: photo scales 1.06, price turns `--aji`.
- Section header before the pin: `02 — SIGNATURE DISHES` + “The plates that made our name.” End card: solid `--nori` card, “The full story is on the menu.” + button → menu.html.

### 3.5 Chapter 03 — Experiences (Ballena card grid)
- Eyebrow `03 — MORE THAN DINNER`. 4 tall cards (2×2 on tablet, 4-up desktop, stacked mobile), each a photo with hover zoom + gradient + Instrument Serif title + one mono line + arrow:
  1. Bottomless Brunch — “Every Saturday & Sunday”
  2. Steak & Sushi Sundays — “A ritual, every Sunday”
  3. The Terrace — “A leafy oasis in East Village”
  4. Tasting Menus — “Three voyages, from £36”
- All link to `experiences.html` anchors. Cards enter with staggered fade-up.

### 3.6 Chapter 04 — The people
- Two-column: left, large portrait/kitchen photo (parallax); right, eyebrow `04 — WHO WE ARE`, headline “From *Chotto Matte* and *Sushisamba* to a corner of East Village.”
- Copy: “Chef-owner Denis Gobjila and partner Victor Rosca left London’s biggest Nikkei houses to build their own. Since 2022, Bamboo Mat has been one of the trailblazers of the Nikkei movement in East London.” Link → about.html.

### 3.7 Through the lens (gallery strip)
- Mono eyebrow `05 — THE ROOM`. A horizontal marquee-style strip of 8–10 gallery images at two heights (staggered top offsets), auto-drifting slowly left (CSS/GSAP infinite), pausing on hover; drag optional. Click → gallery.html.

### 3.8 Final invitation
- Near-full-viewport closer on `--nori`. Centered Instrument Serif --display-lg: “Your table is waiting, between *two worlds*.”
- Under: mono block — TUE–SUN · 21-24 VICTORY PARADE, EAST VILLAGE E20 1FS · 3 MIN FROM WESTFIELD STRATFORD. Big gold RESERVE A TABLE.
- Background: very faint oversized logo mark or bamboo texture at 3% opacity.

---

## 4. Menu page (menu.html)

- **Header:** compact hero (~55vh), background dish photo + overlay. Eyebrow `THE MENU`, headline “Two coastlines, *one table*.” Below, their existing origin quote in italic serif, small: “Far from home, Japanese hands met Peruvian soil… From this quiet alchemy, Nikkei cuisine was born.”
- **Tasting menus first:** three cards side by side (stack mobile) — The Nikkei Voyage £64pp · Essence of Nikkei £55pp · Vegetarian Tasting £36pp — each with 3–4 highlight lines and “+ wine pairing” mono note. Gold hairline top border on hover.
- **Sticky category nav:** horizontal mono chip bar that sticks under the main nav: Starters / Mains / Maki / Nigiri & Sashimi / Desserts / Cocktails. Active chip underlined in `--aji` via IntersectionObserver; click = smooth-scroll.
- **Menu sections:** two-column list rows (name + dietary tags [VG]/[GF] in mono … dotted leader … price). Row hover: name shifts 6px right, price turns gold. Rows fade-up in small staggers per section. Data lives in `src/js/data/menu-data.js` and is rendered by `menu.js`.
- Populate with the REAL menu (subset OK, keep prices exact):
  - Starters: Cancha £4 · Miso Soup £4.50 · Edamame £5 · Padron Pepper £6.50 · Artichoke Tostada £6.50 · Gambas Frites £9.50 · Veg Ceviche £9.50 · Seabass Ceviche £12.50 · Tuna Tartar £14.50 · Hamachi Tiradito £14.50 · Ceviche Deluxe £17
  - Mains: Grilled Sweet Potato £12 · Chicken Teriyaki £14 · Salmon Teriyaki £17 · Chicken Anticucho £17 · Ox Cheek £20 · Grilled Octopus £22.50 · Lamb Chops £23 · Rib-eye Steak £35
  - Maki: Veg Maki £9 · Mango Maki £10 · Salmon Avocado £11 · Dragon Maki £13 · California £13 · Philadelphia £14.50 · Spicy Tuna £16.50 · Hamachi Hot £16.50 · Vulcano £17 · Unagi £18 · Bamboo Maki £22
  - Nigiri & Sashimi (2pc/3pc): Seabass £5.50/£5.50 · Eel £6/£6.70 · Salmon £6.50/£7.50 · Bluefin Tuna £7/£8.50 · Yellowtail £7/£8.50 · Scallop £8/£9.60 · Salmon Aburi £7.80 · A4 Wagyu £11 · Nikkei Nigiri Set £18 · Sashimi Platter for 2 £21
  - Desserts: Mochi Ice Cream £7 · Tonka Bean Crème Brûlée £8.50 · Yuzu Cheesecake £8.60 · Chocolate Fondant £10
  - Signature cocktails: Pisco Sour £12.50 · Nikkei Punch £12.50 · Spicy Sakura £12.50 · Peruvian Paloma £13 · Japanese Highball £14 · Yuzu Blossom £15 (+ note “full wine, sake & bar list available in-house”)
- Footer note (mono, small): dietary key + “A discretionary 12.5% service charge will be added to bills.”

---

## 5. Experiences page (experiences.html)

Compact hero (~50vh): “Ways to *gather*.” Then four full-width alternating blocks, each with an `id` anchor, parallax image one side, content the other:

1. **`#brunch` Bottomless Brunch** — “Every Saturday & Sunday. A fiesta of Nikkei plates and free-flowing drinks in the heart of East Village.” Mono details: SAT & SUN · 90 MINUTES · BOOKING ESSENTIAL. CTA: Reserve brunch.
2. **`#steak-sushi` Steak & Sushi Sundays** — “Every Sunday: the best of both fires — Japanese precision, Peruvian char.” CTA: Book a Sunday.
3. **`#terrace` The Terrace** — “A leafy oasis minutes from Westfield Stratford. Sharing platters, cocktails, and long summer evenings al fresco.” Mono: SUMMER SEASON · WEATHER PERMITTING.
4. **`#tasting` Tasting Menus** — three-row mini list: The Nikkei Voyage £64pp / Essence of Nikkei £55pp / Vegetarian £36pp, each with a one-line description + wine pairing price. CTA: Reserve a tasting.

Between blocks: makisu tick-strip dividers. Closer: small final-invitation band reused from home.

## 6. About page (about.html)

- Hero (~60vh): kitchen/room photo, headline “A short story about *two coastlines*.”
- Scrollytelling column (narrow, centered) in 3 beats, each a masked text reveal:
  1. “In the late 1800s, Japanese migrants landed on Peru’s coast. They cooked with memory and curiosity — the sea’s freshness, the fire of ají, the brightness of lime. Nikkei cuisine was born.”
  2. “A century later in London, chef Denis Gobjila (Chotto Matte) and Victor Rosca (Sushisamba, Lucky Cat) left the city’s biggest Nikkei houses to stamp their own mark.”
  3. “In 2022, Bamboo Mat opened in East London. Grace Dent called it ‘plates of Peruvian joy’. We’ve been rolling ever since.”
- Founders row: two portrait cards (use interior/team shots as placeholders, label clearly) — DENIS GOBJILA · CHEF-OWNER / VICTOR ROSCA · CO-FOUNDER, with one-line bios.
- Press band: `AS SEEN IN` mono label + a gentle marquee of text wordmarks (The Guardian · Time Out · Hot Dinners — text only, no logos). Then Grace Dent pull-quote repeated large.
- Closer: Reserve band.

## 7. Gallery & Contact pages

**gallery.html** — Header: “Through *the lens*.” Masonry grid (CSS columns, 3/2/1 responsive) of ~20 curated photos. Images lazy-load, fade-up on enter, hover scale 1.04 inside masked container. Click → simple lightbox (fixed overlay, image centered, prev/next arrows, ESC/click-out closes; build tiny, no library).

**contact.html** — Split layout. Left: eyebrow `FIND US`, headline “A three-minute walk from *Westfield*.”, then mono info blocks:
ADDRESS 21-24 Victory Parade, East Village, London E20 1FS · EMAIL bamboomatuk@gmail.com · HOURS Tue–Fri 12:00–22:00 / Sat 11:00–22:30 / Sun 11:00–21:30 (placeholder — mark “confirm with venue”) · INSTAGRAM @_bamboomatstratford. Buttons: GET DIRECTIONS (Google Maps link to the address) + RESERVE.
Right: full-height Google Maps iframe embed (grayscale via CSS filter to match palette, remove filter on hover).

---

## 8. Assets — real photos (owner’s own imagery)

All photography is on the current site with a predictable pattern. Download locally (do NOT hotlink) into `public/assets/img/`:

```bash
mkdir -p public/assets/img
# logo
curl -L -o public/assets/img/bamboo_logo.svg "https://bamboo-mat.co.uk/wp-content/uploads/2023/07/bamboo_logo.svg"
# hero candidates (large originals)
curl -L -o public/assets/img/hero-1.jpg "https://bamboo-mat.co.uk/wp-content/uploads/2023/07/220522-RusneDrazPhotos-1-scaled.jpg"
curl -L -o public/assets/img/hero-2.jpg "https://bamboo-mat.co.uk/wp-content/uploads/2023/07/220522-RusneDrazPhotos-9-scaled.jpg"
# gallery set: pattern is 270924-BambooMat-RusneDraz-{N}-scaled.jpg for N=1..99 (N=13 is "13-1")
for N in 1 2 3 4 5 6 7 8 9 10 11 12 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30; do
  curl -L -o "public/assets/img/g-$N.jpg" "https://bamboo-mat.co.uk/wp-content/uploads/2025/03/270924-BambooMat-RusneDraz-$N-scaled.jpg"
done
```
After downloading, VIEW the images and curate: pick the most atmospheric interior for the hero, the best food close-ups for dish cards and the cuisine trio, people/room shots for about/experiences. If any URL 404s, skip it. If more are needed, continue N up to 99. Add descriptive `alt` text to every image.

There is no video asset. Simulate motion with Ken Burns + grain on the hero. Leave a code comment: `<!-- Swap for ambient video loop when client provides footage -->`.

---

## 9. Build order

1. Scaffold Vite MPA, tokens.css, base.css, fonts.
2. Download + curate assets (§8).
3. Global shell: nav, footer, preloader, page transitions, reserve overlay, sticky pill.
4. Home page top-to-bottom (most effort — this is the pitch centerpiece).
5. Menu page (+ data file). 6. Experiences. 7. About. 8. Gallery + Contact.
9. Mobile pass at 390px, 768px, 1440px. 10. Polish pass (see checklist), `npm run build` must succeed.

## 10. Acceptance checklist ("wow" QA)

- [ ] Preloader slat roll-away feels smooth, ≤1.6s, skippable, only once per session.
- [ ] Every internal navigation uses the makisu transition — the site feels like one continuous space.
- [ ] Hero headline masked-rise on load; no layout shift; fonts preloaded.
- [ ] Grace Dent quote word-by-word scrub works and reads clearly at every scroll speed.
- [ ] Horizontal dish section pins/scrubs on desktop, swipes natively on mobile.
- [ ] Reserve overlay completes to the success state; feels like a real product.
- [ ] All images are local, compressed (max ~250KB each; resize to sensible widths), lazy-loaded below the fold.
- [ ] 60fps scroll on a mid laptop: animate ONLY transform/opacity, `will-change` used sparingly.
- [ ] `prefers-reduced-motion` path works (no pins, no smooth scroll, simple fades).
- [ ] Keyboard: nav, chips, lightbox and reserve overlay all focusable; visible focus ring (2px `--aji` offset outline); overlays trap focus and close on ESC.
- [ ] Real content everywhere — no lorem ipsum, prices match §4 exactly.
- [ ] Footer prototype note: “Design prototype — not the live Bamboo Mat website.”

## 11. Out of scope

No CMS, no real booking integration, no newsletter backend (fake success state is fine), no blog/press pages (nav can omit them), no multi-language, no cookie banner.
