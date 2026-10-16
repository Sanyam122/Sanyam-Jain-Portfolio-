type RevealElement = HTMLElement & {
  _init?: boolean;
  _plan?: number;
  _lag?: number;
  _gap?: number;
  _o?: number;
};

/** Set to false to keep the browser's native wheel scrolling. */
const SMOOTH_WHEEL = true;

const $ = (s: string, r: Document | Element = document): Element | null =>
  r.querySelector(s);

const $$ = (s: string, r: Document | Element = document): Element[] =>
  Array.from(r.querySelectorAll(s));

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type IslandState = 'top' | 'compact' | 'expanded';

/** Document-space top of an element, using layout offsets (unaffected by transforms). */
function docTop(el: HTMLElement) {
  let y = 0;
  for (
    let n: HTMLElement | null = el;
    n;
    n = n.offsetParent as HTMLElement | null
  )
    y += n.offsetTop;
  return y;
}

let initialized = false;

export function initMotion(): () => void {
  if (initialized) return () => {};
  initialized = true;

  const root = document.documentElement;
  root.classList.add('js');

  const hasIO = 'IntersectionObserver' in window;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce) root.classList.add('no-motion');

  /* ---------- Shared plumbing ---------- */
  const cleanups: (() => void)[] = [];
  const addCleanup = (fn: () => void) => cleanups.push(fn);

  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
    return id;
  };
  addCleanup(() => {
    timers.forEach((id) => clearTimeout(id));
    timers.clear();
  });

  let glide = 0; // rAF id of the active anchor glide (0 = idle)
  let stopWheel: () => void = () => {}; // halts wheel smoothing (set below)
  let syncPill: () => void = () => {}; // re-places the nav pill (set below)

  /* One scroll/resize listener, one rAF per frame, shared by every scroll-driven effect */
  const scrollSubs: Array<(y: number) => void> = [];
  let hubQueued = false;
  const hubFlush = () => {
    hubQueued = false;
    const y = scrollY;
    for (const fn of scrollSubs) fn(y);
  };
  const hubRequest = () => {
    if (!hubQueued) {
      hubQueued = true;
      requestAnimationFrame(hubFlush);
    }
  };
  const onScrollFrame = (fn: (y: number) => void) => {
    scrollSubs.push(fn);
  };
  addEventListener('scroll', hubRequest, { passive: true });
  addEventListener('resize', hubRequest);
  addCleanup(() => {
    removeEventListener('scroll', hubRequest);
    removeEventListener('resize', hubRequest);
    scrollSubs.length = 0;
  });

  /* ---------- Entrance gate: wait for the font so nothing reflows mid-animation ---------- */
  const fontGate =
    document.fonts && document.fonts.load
      ? Promise.race([
          Promise.all([
            document.fonts.load('500 1em Inter'),
            document.fonts.load('600 1em Inter'),
          ]).catch(() => {}),
          new Promise<void>((r) => setTimeout(r, 700)),
        ])
      : Promise.resolve();
  const ready = fontGate.then(
    () => new Promise<void>((r) => requestAnimationFrame(() => r()))
  );

  /* ---------- Reveal engine ---------- */
  const domOrder = (a: Node, b: Node) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

  const io = hasIO
    ? new IntersectionObserver(
        (entries, obs) => {
          const batch = entries
            .filter((e) => e.isIntersecting)
            .map((e) => e.target as RevealElement)
            .sort(domOrder);
          let n = 0;
          batch.forEach((el) => {
            const delay = Math.round(
              el._init
                ? (el._plan ?? 0)
                : (el._lag ?? 0) + n++ * (el._gap ?? 0)
            );
            el.style.setProperty('--d', delay + 'ms');
            el.classList.add('in');
            obs.unobserve(el);
            later(() => el.classList.add('done'), delay + 1900);
          });
        },
        // threshold 0 so very tall blocks can never get stuck invisible
        { threshold: 0, rootMargin: '0px 0px -8% 0px' }
      )
    : null;

  const queue = (el: Element) => {
    ready.then(() => {
      if (!io) {
        el.classList.add('in', 'done');
        return;
      }
      const r = el.getBoundingClientRect();
      (el as RevealElement)._init =
        scrollY < 40 && r.top < innerHeight && r.bottom > 0;
      io.observe(el);
    });
  };

  function reveal(
    targets: Element | Element[] | null | undefined,
    {
      base = 0,
      step = 90,
      lag = 0,
      y,
      s,
      blur = false,
    }: {
      base?: number;
      step?: number;
      lag?: number;
      y?: string;
      s?: string;
      blur?: boolean;
    } = {}
  ) {
    const list: Element[] = !targets
      ? []
      : Array.isArray(targets)
        ? targets
        : [targets];
    list.forEach((el, i) => {
      el.classList.add('reveal');
      const elStyle = el as HTMLElement;
      if (y !== undefined) elStyle.style.setProperty('--y', y);
      if (s !== undefined) elStyle.style.setProperty('--s', s);
      if (blur) el.setAttribute('data-blur', '');
      const revealEl = el as RevealElement;
      revealEl._plan = base + i * step;
      revealEl._lag = lag;
      revealEl._gap = step;
      queue(el);
    });
  }

  function splitWords(
    el: Element | null | undefined,
    {
      base = 0,
      step = 55,
      lag = 0,
      gap = 100,
    }: {
      base?: number;
      step?: number;
      lag?: number;
      gap?: number;
    } = {}
  ) {
    if (!el) return;
    const nodes = Array.from(el.childNodes);
    el.setAttribute(
      'aria-label',
      nodes
        .map((n) => (n.nodeName === 'BR' ? ' ' : n.textContent))
        .join('')
        .trim()
        .replace(/\s+/g, ' ')
    );
    el.setAttribute('data-split', '');
    el.textContent = '';
    let i = 0;
    let needSpace = false;
    nodes.forEach((node) => {
      if (node.nodeName === 'BR') {
        el.appendChild(document.createElement('br'));
        needSpace = false;
        return;
      }
      node.textContent
        ?.split(/\s+/)
        .filter(Boolean)
        .forEach((word) => {
          if (needSpace) el.appendChild(document.createTextNode(' '));
          const w = document.createElement('span');
          w.className = 'w';
          w.setAttribute('aria-hidden', 'true');
          const inner = document.createElement('span');
          inner.className = 'wi';
          inner.style.setProperty('--i', String(i++));
          inner.textContent = word;
          w.appendChild(inner);
          el.appendChild(w);
          needSpace = true;
        });
    });
    (el as HTMLElement).style.setProperty('--step', step + 'ms');
    const revealEl = el as RevealElement;
    revealEl._plan = base;
    revealEl._lag = lag;
    revealEl._gap = gap;
    queue(el);
  }

  /* Scroll-scrubbed words: progress is eased toward its target every frame,
     so quick flicks of the wheel never make the text strobe. */
  function scrubWords(el: Element | null) {
    if (!el) return;
    const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const parts = text.split(' ');
    const words = parts.map((word, i) => {
      const s = document.createElement('span');
      s.className = 'sw';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = word;
      el.appendChild(s);
      if (i < parts.length - 1) el.appendChild(document.createTextNode(' '));
      return s;
    });
    const tail = 5;
    const n = words.length;
    let target = 0;
    let current = 0;
    let raf = 0;

    const paint = (p: number) => {
      words.forEach((w, i) => {
        const v = clamp((p * (n + tail) - i) / tail, 0, 1);
        const o = Number((0.18 + 0.82 * v * v * (3 - 2 * v)).toFixed(2));
        const we = w as RevealElement;
        if (we._o !== o) {
          we._o = o;
          w.style.opacity = String(o);
        }
      });
    };
    const measure = () => {
      const r = el.getBoundingClientRect();
      return clamp(
        (innerHeight * 0.88 - r.top) / (r.height + innerHeight * 0.28),
        0,
        1
      );
    };
    const run = () => {
      current = lerp(current, target, 0.14);
      if (Math.abs(target - current) < 0.0008) {
        current = target;
        raf = 0;
      } else {
        raf = requestAnimationFrame(run);
      }
      paint(current);
    };
    onScrollFrame(() => {
      target = measure();
      if (!raf) raf = requestAnimationFrame(run);
    });
    addCleanup(() => cancelAnimationFrame(raf));
    target = current = measure();
    paint(current);
  }

  if (!reduce) {
    try {
      /* ---------- Header + hero: one orchestrated entrance ---------- */
      reveal($('header'), { y: '-20px', s: '.96' });
      const heroLeft = $('#hero > div:first-child');
      splitWords(heroLeft ? $('h1', heroLeft) : null, { base: 260, step: 80 });
      reveal(heroLeft?.querySelector('.space-y-8 > div'), {
        base: 140,
        y: '16px',
        blur: true,
      });
      reveal(heroLeft?.querySelector('.space-y-8 > p'), {
        base: 800,
        lag: 150,
        y: '20px',
        blur: true,
      });
      reveal(heroLeft?.querySelector(':scope > .pt-8'), {
        base: 940,
        lag: 250,
        y: '20px',
      });
      reveal($$('#hero > div:last-child .grid > div'), {
        base: 440,
        step: 130,
        y: '48px',
        s: '.96',
      });
      reveal($$('#hero .icon-btn'), {
        base: 1200,
        lag: 500,
        step: 80,
        y: '0px',
        s: '.5',
      });

      /* ---------- Mission ---------- */
      const about = $('#about');
      reveal(about, { y: '40px', s: '.98' });
      scrubWords(about ? $('h2', about) : null);
      reveal($$('#about > div:last-child > span'), {
        step: 80,
        lag: 200,
        y: '16px',
        blur: true,
      });

      /* ---------- Services ---------- */
      splitWords($('#services h2'), { step: 60 });
      reveal($('#services > div:first-child > p'), {
        lag: 260,
        y: '16px',
        blur: true,
      });
      reveal($$('#services > div:last-child > div'), {
        step: 110,
        y: '40px',
        s: '.975',
      });

      /* ---------- Work ---------- */
      splitWords($('#work h2'), { step: 60 });
      reveal($('#work > div:first-child > div'), {
        lag: 260,
        y: '16px',
      });
      reveal($('#work > div:last-child > div:first-child'), {
        y: '48px',
        s: '.975',
      });
      reveal($$('#work > div:last-child > div:last-child > div'), {
        step: 130,
        y: '48px',
        s: '.975',
      });

      /* ---------- Contact + footer ---------- */
      reveal($('#contact'), { y: '32px', s: '.98' });
      splitWords($('#contact h2'), { step: 40, lag: 120 });
      reveal($('#contact h2 + p'), {
        lag: 380,
        y: '16px',
        blur: true,
      });
      reveal($$('#contact-form > *'), {
        base: 300,
        lag: 480,
        step: 110,
        y: '24px',
      });
      reveal($('footer'), { y: '16px' });

      /* ---------- Hover behaviour hooks ---------- */
      $$(
        '#services > div:last-child > div, #work > div:last-child > div:last-child > div, #work > div:last-child > div:first-child'
      ).forEach((c) => c.classList.add('card-lift'));
      $$('#hero .reveal').forEach((c) => {
        if (c.querySelector('.media-img')) c.classList.add('zoom-host');
      });
    } catch {
      console.warn('Motion setup failed; showing content without animation.');
      root.classList.add('no-motion');
    }
  }

  /* =====================================================================
     DYNAMIC ISLAND NAVBAR
     top       → wide, light glass pill resting at the top of the page
     compact   → contracts to a dark island hugging its content (scrolling down)
     expanded  → springs open again (scrolling up, hover, or keyboard focus)
     ===================================================================== */
  const header = $('header') as HTMLElement | null;
  if (header) {
    /* The island floats (position: fixed) so it is always centred on the viewport.
       To keep the page structure identical, a spacer takes over exactly the room
       the header used to occupy in the flow. */
    const hcs = getComputedStyle(header);
    const wasOut = hcs.position === 'fixed' || hcs.position === 'absolute';
    const hTop = wasOut ? header.offsetTop : docTop(header);
    let spacer: HTMLElement | null = null;
    if (!wasOut) {
      const next = header.nextElementSibling as HTMLElement | null;
      let h = next ? docTop(next) - hTop : header.offsetHeight;
      const pcs = header.parentElement ? getComputedStyle(header.parentElement) : null;
      if (pcs && /flex|grid/.test(pcs.display)) h -= parseFloat(pcs.rowGap) || 0;
      spacer = document.createElement('div');
      spacer.className = 'island-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      spacer.style.height = Math.max(0, h) + 'px';
      spacer.style.marginTop = hcs.marginTop;
      header.before(spacer);
    }
    header.style.setProperty('--island-top', Math.max(14, hTop) + 'px');
    header.style.setProperty('--sy', scrollY + 'px');
    header.classList.add('island');
    const hero = $('#hero') as HTMLElement | null;
    let state: IslandState = 'top';
    let hover = false;
    let dirUp = false;
    let lastY = scrollY;
    let acc = 0;
    let leaveTimer = 0;
    let trackUntil = 0;
    let trackRaf = 0;

    /* Keep the nav pill glued to its link for the whole width spring,
       not just once the island has finished moving. */
    const trackPill = (ms: number) => {
      trackUntil = performance.now() + ms;
      if (trackRaf) return;
      const step = () => {
        syncPill();
        trackRaf =
          performance.now() < trackUntil ? requestAnimationFrame(step) : 0;
      };
      trackRaf = requestAnimationFrame(step);
    };
    addCleanup(() => cancelAnimationFrame(trackRaf));

    const decide = (y: number): IslandState => {
      if (y < 80) return 'top';
      if (hover || header.matches(':focus-within')) return 'expanded';
      return dirUp ? 'expanded' : 'compact';
    };
    const apply = (y = scrollY) => {
      const next = decide(y);
      if (next === state && header.dataset.island === next) return;
      state = next;
      header.dataset.island = next;
      trackPill(1100);
    };

    /* Measure what the island needs to wrap its content, so the compact
       width is exact at any font size or language. */
    const measure = () => {
      // top-state width follows the hero grid so both share the same edges
      if (hero) header.style.setProperty('--island-hero', hero.offsetWidth + 'px');
      header.classList.add('is-measuring', 'no-trans');
      const hr = header.getBoundingClientRect();
      // rects are scaled while the entrance animation runs; undo that so the width is exact
      const k = hr.width / (header.offsetWidth || 1) || 1;
      let right = 0;
      header.querySelectorAll('*').forEach((n) => {
        const r = (n as HTMLElement).getBoundingClientRect();
        if (r.width || r.height) right = Math.max(right, r.right);
      });
      const padR = parseFloat(getComputedStyle(header).paddingRight) || 0;
      header.classList.remove('is-measuring');
      void header.offsetWidth; // flush while transitions are still off
      requestAnimationFrame(() => header.classList.remove('no-trans'));
      if (right > hr.left)
        header.style.setProperty(
          '--island-compact',
          Math.ceil((right - hr.left) / k + padR + 14) + 'px'
        );
    };
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    addEventListener('resize', measure);
    addCleanup(() => removeEventListener('resize', measure));

    header.dataset.island = state;
    apply();

    onScrollFrame((y) => {
      const d = y - lastY;
      lastY = y;
      acc = Math.sign(d) === Math.sign(acc) ? acc + d : d;
      if (glide) dirUp = false;
      else if (acc > 24) dirUp = false;
      else if (acc < -24) dirUp = true;

      const max = Math.max(1, root.scrollHeight - innerHeight);
      header.style.setProperty('--p', clamp(y / max, 0, 1).toFixed(3));
      header.style.setProperty('--sy', y + 'px');
      apply(y);
    });

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(leaveTimer);
      hover = true;
      apply();
    };
    const onLeave = () => {
      clearTimeout(leaveTimer);
      // short grace period so skimming past the edge doesn't flutter the island
      leaveTimer = window.setTimeout(() => {
        hover = false;
        apply();
      }, 360);
    };
    const onFocusChange = () => requestAnimationFrame(() => apply());
    header.addEventListener('pointerenter', onEnter);
    header.addEventListener('pointerleave', onLeave);
    header.addEventListener('focusin', onFocusChange);
    header.addEventListener('focusout', onFocusChange);
    addCleanup(() => {
      clearTimeout(leaveTimer);
      header.removeEventListener('pointerenter', onEnter);
      header.removeEventListener('pointerleave', onLeave);
      header.removeEventListener('focusin', onFocusChange);
      header.removeEventListener('focusout', onFocusChange);
      header.classList.remove('island');
      delete header.dataset.island;
      spacer?.remove();
    });

    /* ---------- Sliding nav pill: follows hover, rests on the active section ---------- */
    const navLinks = $$('.nav-link') as HTMLElement[];
    const host = navLinks[0]?.parentElement ?? null;
    if (host) {
      host.classList.add('nav-pill-host');
      const pill = document.createElement('span');
      pill.className = 'nav-pill';
      pill.setAttribute('aria-hidden', 'true');
      host.prepend(pill);

      let hovered: HTMLElement | null = null;
      let armed = false;
      const place = (el: HTMLElement | null) => {
        if (!el) {
          pill.style.opacity = '0';
          return;
        }
        const padX = 12;
        const padY = 6;
        pill.style.setProperty('--x', el.offsetLeft - padX + 'px');
        pill.style.setProperty('--y', el.offsetTop - padY + 'px');
        pill.style.setProperty('--pw', el.offsetWidth + padX * 2 + 'px');
        pill.style.setProperty('--ph', el.offsetHeight + padY * 2 + 'px');
        pill.style.opacity = '1';
        if (!armed) {
          // first placement snaps into position, every later one glides
          armed = true;
          requestAnimationFrame(() =>
            requestAnimationFrame(() => pill.classList.add('is-ready'))
          );
        }
      };
      syncPill = () =>
        place(
          hovered ?? (navLinks.find((l) => l.classList.contains('active')) ?? null)
        );

      navLinks.forEach((l) => {
        const enter = (e: Event) => {
          if ((e as PointerEvent).pointerType === 'touch') return;
          hovered = l;
          syncPill();
        };
        const leave = () => {
          hovered = null;
          syncPill();
        };
        l.addEventListener('pointerenter', enter);
        l.addEventListener('focus', enter);
        l.addEventListener('blur', leave);
        addCleanup(() => {
          l.removeEventListener('pointerenter', enter);
          l.removeEventListener('focus', enter);
          l.removeEventListener('blur', leave);
        });
      });
      const hostLeave = () => {
        hovered = null;
        syncPill();
      };
      host.addEventListener('pointerleave', hostLeave);
      addCleanup(() => {
        host.removeEventListener('pointerleave', hostLeave);
        pill.remove();
        host.classList.remove('nav-pill-host');
        syncPill = () => {};
      });
      ready.then(syncPill);
    }
  }

  /* ---------- Hero media parallax (translate property, so it never fights hover scale) ---------- */
  if (!reduce) {
    const media = $$('#hero .media-img') as HTMLElement[];
    if (media.length) {
      onScrollFrame((y) => {
        if (y > innerHeight * 1.3) return;
        const py = clamp(y * 0.07, 0, 72);
        media.forEach((m, i) => {
          m.style.translate =
            '0 ' + (py * (i % 2 ? 1.25 : 0.85)).toFixed(1) + 'px';
        });
      });
    }
  }

  /* ---------- Marquee: eases to a stop on hover and back up to speed ---------- */
  (() => {
    const track = $('.animate-marquee') as HTMLElement | null;
    const wrap = track?.closest('.marquee-wrap') as Element | null;
    if (!track || !wrap || reduce) return;
    track.classList.add('is-js');
    let x = 0;
    let mult = 1;
    let goal = 1;
    let loop = 0;
    let last = 0;
    let raf = 0;
    const measure = () => {
      loop = track.offsetWidth / 2;
    };
    measure();
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(measure);
      ro.observe(track);
      addCleanup(() => ro.disconnect());
    } else {
      addEventListener('resize', measure);
      addCleanup(() => removeEventListener('resize', measure));
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      mult += (goal - mult) * (1 - Math.exp(-dt * 3.8));
      if (loop > 0) {
        x -= (loop / 26) * mult * dt;
        if (x <= -loop) x += loop;
        track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onPointerEnter = (e: Event) => {
      if ((e as PointerEvent).pointerType === 'mouse') goal = 0;
    };
    const onPointerLeave = () => {
      goal = 1;
    };
    if (hasIO) {
      const obs = new IntersectionObserver(([e]) =>
        e.isIntersecting ? start() : stop()
      );
      obs.observe(wrap);
      addCleanup(() => obs.disconnect());
    } else {
      start();
    }
    wrap.addEventListener('pointerenter', onPointerEnter);
    wrap.addEventListener('pointerleave', onPointerLeave);
    addCleanup(() => {
      stop();
      wrap.removeEventListener('pointerenter', onPointerEnter);
      wrap.removeEventListener('pointerleave', onPointerLeave);
    });
  })();

  /* ---------- Magnetic buttons: lerped, so they glide in and settle back softly ---------- */
  if (finePointer && !reduce) {
    $$('.btn:not(.btn-wide)').forEach((b) => {
      const pull = 0.22;
      const max = 9;
      const button = b as HTMLElement;
      let tx = 0;
      let ty = 0;
      let x = 0;
      let y = 0;
      let raf = 0;
      const frame = () => {
        x = lerp(x, tx, 0.16);
        y = lerp(y, ty, 0.16);
        const settled = Math.abs(x - tx) < 0.05 && Math.abs(y - ty) < 0.05;
        if (settled) {
          x = tx;
          y = ty;
          raf = 0;
        } else {
          raf = requestAnimationFrame(frame);
        }
        if (x === 0 && y === 0) button.style.removeProperty('translate');
        else
          button.style.setProperty(
            'translate',
            x.toFixed(2) + 'px ' + y.toFixed(2) + 'px'
          );
      };
      const kick = () => {
        if (!raf) raf = requestAnimationFrame(frame);
      };
      const onMove = (e: Event) => {
        const pe = e as PointerEvent;
        if (pe.pointerType !== 'mouse') return;
        const r = button.getBoundingClientRect();
        tx = clamp((pe.clientX - (r.left + r.width / 2)) * pull, -max, max);
        ty = clamp((pe.clientY - (r.top + r.height / 2)) * pull, -max, max);
        kick();
      };
      const onLeave = () => {
        tx = 0;
        ty = 0;
        kick();
      };
      button.addEventListener('pointermove', onMove);
      button.addEventListener('pointerleave', onLeave);
      addCleanup(() => {
        cancelAnimationFrame(raf);
        button.removeEventListener('pointermove', onMove);
        button.removeEventListener('pointerleave', onLeave);
        button.style.removeProperty('translate');
      });
    });
  }

  /* ---------- Card spotlight: a soft light that follows the cursor ---------- */
  if (finePointer && !reduce) {
    $$('.card-lift').forEach((c) => {
      const card = c as HTMLElement;
      const onMove = (e: Event) => {
        const pe = e as PointerEvent;
        if (pe.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (pe.clientX - r.left).toFixed(0) + 'px');
        card.style.setProperty('--my', (pe.clientY - r.top).toFixed(0) + 'px');
      };
      card.addEventListener('pointermove', onMove);
      addCleanup(() => card.removeEventListener('pointermove', onMove));
    });
  }

  /* ---------- Inertial wheel scrolling (mouse wheels only; trackpads stay native) ---------- */
  if (SMOOTH_WHEEL && finePointer && !reduce) {
    let target = scrollY;
    let cur = scrollY;
    let raf = 0;
    let active = false;
    const maxScroll = () => Math.max(0, root.scrollHeight - innerHeight);

    const insideScrollable = (start: EventTarget | null) => {
      for (
        let n = start as HTMLElement | null;
        n && n !== document.body;
        n = n.parentElement
      ) {
        const oy = getComputedStyle(n).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && n.scrollHeight > n.clientHeight + 1)
          return true;
      }
      return false;
    };

    const loop = () => {
      cur = lerp(cur, target, 0.1);
      const done = Math.abs(target - cur) < 0.5;
      if (done) cur = target;
      scrollTo({ top: cur, behavior: 'instant' });
      if (done) {
        raf = 0;
        active = false;
      } else {
        raf = requestAnimationFrame(loop);
      }
    };

    stopWheel = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      active = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || e.deltaX !== 0) return;
      // Only notched mouse wheels qualify; precision trackpads already feel smooth
      const notched =
        e.deltaMode === 1 ||
        (Math.abs(e.deltaY) >= 50 && Number.isInteger(e.deltaY));
      if (!notched || insideScrollable(e.target)) return;
      e.preventDefault();
      if (!active) {
        target = cur = scrollY;
        active = true;
      }
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      target = clamp(target + dy, 0, maxScroll());
      if (!raf) raf = requestAnimationFrame(loop);
    };

    addEventListener('wheel', onWheel, { passive: false });
    addCleanup(() => {
      removeEventListener('wheel', onWheel);
      stopWheel();
      stopWheel = () => {};
    });
  }

  /* ---------- Eased anchor scrolling ---------- */
  const cancelGlide = () => {
    if (glide) {
      cancelAnimationFrame(glide);
      glide = 0;
    }
  };
  ['wheel', 'touchstart', 'keydown'].forEach((ev) =>
    addEventListener(ev, cancelGlide, { passive: true })
  );
  addCleanup(() => {
    ['wheel', 'touchstart', 'keydown'].forEach((ev) =>
      removeEventListener(ev, cancelGlide)
    );
    cancelGlide();
  });

  function glideTo(y: number, onDone?: () => void) {
    cancelGlide();
    stopWheel();
    const from = scrollY;
    const to = clamp(y, 0, Math.max(0, root.scrollHeight - innerHeight));
    const dist = to - from;
    if (Math.abs(dist) < 2) {
      onDone?.();
      return;
    }
    const dur = clamp(Math.sqrt(Math.abs(dist)) * 40, 750, 1500);
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = clamp((now - t0) / dur, 0, 1);
      scrollTo({ top: from + dist * easeInOutCubic(t), behavior: 'instant' });
      if (t < 1) {
        glide = requestAnimationFrame(frame);
      } else {
        glide = 0;
        onDone?.();
      }
    };
    glide = requestAnimationFrame(frame);
  }

  const onClick = (e: MouseEvent) => {
    if (
      reduce ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    const targetEl = e.target as Element | null;
    const a = targetEl?.closest?.('a[href^="#"]') ?? null;
    if (!a) return;
    const id = a.getAttribute('href')?.slice(1) ?? '';
    const target = id && id !== 'top' ? document.getElementById(id) : null;
    if (id && id !== 'top' && !target) return;
    e.preventDefault();
    const margin = target
      ? parseFloat(getComputedStyle(target).scrollMarginTop || '0') || 0
      : 0;
    glideTo(target ? docTop(target) - margin : 0, () => {
      if (!target) return;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
    try {
      history.pushState(null, '', '#' + id);
    } catch {
      /* file:// or sandboxed */
    }
  };

  document.addEventListener('click', onClick);
  addCleanup(() => document.removeEventListener('click', onClick));

  /* ---------- Active nav link ---------- */
  const links = $$('.nav-link');
  if (hasIO && links.length) {
    const byId = new Map(
      links.map((a) => [a.getAttribute('href')?.slice(1) ?? '', a])
    );
    const setActive = (active: Element | null) => {
      links.forEach((l) => {
        const on = l === active;
        l.classList.toggle('active', on);
        if (on) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
      syncPill();
    };
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(byId.get(e.target.id) ?? null);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    byId.forEach((_, id) => {
      const s = document.getElementById(id);
      if (s) so.observe(s);
    });
    onScrollFrame((y) => {
      if (y < 200) setActive(null);
    });
    addCleanup(() => so.disconnect());
  }

  /* ---------- Image fallback (hotlinked images can fail) ---------- */
  const placeholder = (label: string) =>
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><defs>' +
        '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E1F2F5"/>' +
        '<stop offset="1" stop-color="#C4C2F7"/></linearGradient></defs>' +
        '<rect width="640" height="400" fill="url(#g)"/>' +
        '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ' +
        'font-family="Inter,Arial,sans-serif" font-size="32" font-weight="600" letter-spacing="4" fill="#2F9FB3">' +
        label.toUpperCase() +
        '</text></svg>'
    );

  $$('img').forEach((img) => {
    const image = img as HTMLImageElement;
    const fix = () => {
      if (image.dataset.fallback) return;
      image.dataset.fallback = '1';
      image.src = placeholder(image.dataset.label || image.alt || 'Preview');
    };
    image.addEventListener('error', fix);
    addCleanup(() => image.removeEventListener('error', fix));
    if (image.complete && image.naturalWidth === 0 && image.getAttribute('src'))
      fix();
  });

  /* ---------- Contact form ---------- */
  const form = $('#contact-form');
  if (form) {
    const btn = $('#submit-btn') as HTMLButtonElement | null;
    const label = $('#submit-label') as HTMLSpanElement | null;
    const status = $('#form-status') as HTMLParagraphElement | null;
    const CONFIG = {
      contactEmail: 'jainsanyam441@gmail.com',
      formEndpoint: '',
    };

    const idle = label?.textContent ?? '';

    const replay = (el: Element, cls: string) => {
      el.classList.remove(cls);
      void (el as HTMLElement).offsetWidth;
      el.classList.add(cls);
    };

    const setStatus = (msg: string, ok: boolean) => {
      if (!status) return;
      status.textContent = msg;
      status.className =
        'mt-3 text-center text-[14px] ' +
        (ok ? 'text-[#2F9FB3]' : 'text-[#D14343]');
      replay(status, 'pop');
    };

    const setBusy = (busy: boolean) => {
      if (btn) btn.disabled = busy;
      if (label) {
        label.innerHTML = busy
          ? '<span class="spinner"></span><span>Sending…</span>'
          : idle;
        label.classList.toggle('flex', busy);
        label.classList.toggle('items-center', busy);
        label.classList.toggle('justify-center', busy);
        label.classList.toggle('gap-2', busy);
        replay(label, 'swap');
      }
    };

    const onSubmit = async (e: Event) => {
      e.preventDefault();
      if (btn?.disabled) return;
      if (!(form as HTMLFormElement).reportValidity()) return;
      const gotcha = (form as HTMLFormElement).elements.namedItem(
        '_gotcha'
      ) as HTMLInputElement | null;
      if (gotcha && gotcha.value) return;

      const nameInput = (form as HTMLFormElement).elements.namedItem(
        'name'
      ) as HTMLInputElement;
      const emailInput = (form as HTMLFormElement).elements.namedItem(
        'email'
      ) as HTMLInputElement;
      const messageInput = (form as HTMLFormElement).elements.namedItem(
        'message'
      ) as HTMLTextAreaElement;
      const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
      };

      if (CONFIG.formEndpoint) {
        setBusy(true);
        try {
          const res = await fetch(CONFIG.formEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error('Request failed');
          (form as HTMLFormElement).reset();
          setStatus(
            'Message sent. Thanks, ' + data.name.split(' ')[0] + "! I'll reply soon.",
            true
          );
        } catch {
          setStatus(
            "Couldn't send your message. Please try again or email me directly.",
            false
          );
        } finally {
          setBusy(false);
        }
      } else {
        const subject = encodeURIComponent('Portfolio inquiry from ' + data.name);
        const body = encodeURIComponent(
          data.message + '\n\n— ' + data.name + ' (' + data.email + ')'
        );
        setStatus('Opening your email app…', true);
        window.location.href =
          'mailto:' + CONFIG.contactEmail + '?subject=' + subject + '&body=' + body;
      }
    };

    form.addEventListener('submit', onSubmit);
    addCleanup(() => form.removeEventListener('submit', onSubmit));
  }

  hubRequest();

  return () => {
    cleanups.forEach((fn) => fn());
    if (io) io.disconnect();
    root.classList.remove('js', 'no-motion');
    initialized = false;
  };
}