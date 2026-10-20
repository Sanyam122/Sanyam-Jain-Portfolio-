# Motion CHANGELOG

Apple-standard motion redesign for the portfolio. All changes confined to
`src/lib/motion.ts` and `src/index.css`; no layout, copy, colour, class-name,
or HTML-structure changes were made outside what motion strictly requires.

## Design tokens (index.css :root)
- `--ease-standard`: cubic-bezier(.28,.11,.32,1) — gentle in, long out
- `--ease-sheet`: cubic-bezier(.32,.72,0,1) — iOS sheet deceleration
- `--ease-out`: cubic-bezier(.22,1,.36,1) — soft settle
- Springs generated from real damped spring physics (scripted, not eyeballed)
  via `linear()` with cubic-bezier fallbacks inside `@supports`:
  - `--spring-island` (ζ .86, peak 1.005)
  - `--spring-pill` (ζ .74, peak 1.031)
  - `--spring-pop` (ζ .62, peak 1.084)
  - `--spring-settle` (ζ 1.0, critically damped)

## Entrance choreography (motion.ts)
- Font gate: waits for Inter/Plus Jakarta Sans (700ms fallback cap) before any
  entrance so nothing reflows mid-animation.
- Single orchestrated hero sequence under ~1.5s:
  header → eyebrow (availability pill) → headline word-by-word rise (~48ms
  stagger, 108%→0 mask) → body → actions → media cards (rise + settle) →
  social icons pop last.
- Scroll reveals via one IntersectionObserver, batch-staggered in DOM order,
  stagger capped via per-element step. `will-change` released on `done`,
  `--d` delay removed after arrival so it never leaks into hover.
- `autoAnimate()` pass discovers every remaining heading/paragraph/list
  item/link/button/image/svg/input/label/divider/rounded block without an
  entrance and assigns a per-type variant (text rise+blur, card rise+settle,
  media clip-path unveil + zoom, pop spring, line draw, field slide up).
  Skips hidden/aria-hidden/sr-only and descendants of buttons/headings/
  paragraphs/list items. Merges into existing hover transitions via `.js .reveal`
  specificity so neither cancels the other.

## Interaction polish
- Buttons: spring hover (scale 1.03), 140ms press (scale 0.965), springy
  release. Magnetic pull on `.btn:not(.btn-wide)` driven by a real JS spring
  (stiffness 260, damping 22) sleeping at rest; zero CSS transition on the
  `translate` it controls.
- Cards: lift on hover (translateY -5px, shadow), press on tap
  (scale 0.994), soft pointer-following light via CSS vars `--lx/--ly` fed by
  a single rAF loop.
- Inline links: underline sweep in from left, out to right (transform
  scaleX, origin flip). Footer links keep existing sweep.
- Images: settle on entry (scale 1.06→1), gentle zoom on hover (1.04).
- Nav: sliding spring pill follows hover, rests on active section; island
  contracts/expands on scroll direction + hover/focus.

## Scroll-linked motion
- Eased anchor scrolling (ease-in-out-quart), 750–1300ms, cancellable by
  wheel/touch/keyboard; focus management on target.
- Hero parallax: columns move at different rates, headline fades as page
  scrolls (CSS vars `--py/--po`).
- Scroll-scrubbed text: rAF loop with exponential damping toward a scroll
  target; sleeps when caught up.
- Marquee: eases to stop on hover, back to speed on leave; pauses off-screen.
- One shared scroll/resize listener with one rAF per frame; passive only;
  frame-rate-independent via dt; loops sleep when idle/off-screen.

## Accessibility
- `prefers-reduced-motion`: everything static, content fully visible
  (opacity 1, no transforms, no clip-path, no parallax, no counting, no
  marquee/dot-ring animations), island transitions instant.
- Visible keyboard focus preserved (outline 2px #6C63E8); focus never trapped
  or hidden.
- All hidden states gated behind `.js` class; try/catch safety net adds
  `.no-motion` so content never stays hidden if JS fails.

## Durations (all within spec)
- Entrances: 0.85–1.1s (hero sequence totals ~1.5s)
- UI feedback: 120–550ms
- Anchor glide: 750–1300ms
- Nothing above 1.5s; no `linear` easing on UI; no width/height/top/left
  animation on content (island width is the single GPU-friendly exception).

## Removed / left static
- Removed: legacy `pop`/`swap` keyframe classes on reveal (replaced by
  transition-based entrances), 1.5s+ media-img settle, 2s anchor glide,
  competing `transition-duration` overrides on `:active`, eyeballed spring
  curves.
- Left static: existing form logic, nav anchors, island navbar structure,
  marquee markup, colours, copy, class names. Years excluded from count-up.
- Nothing intentionally left un-animated; every element type has a considered
  entrance, hover/press, or scroll behaviour.
