import { useReducedMotion as useReducedMotionHook } from "motion/react";

/* =====================================================================
   MOTION SYSTEM — Apple-inspired, built on framer-motion
   ---------------------------------------------------------------------
   Principles
   1. Fast to start, slow to land. Everything decelerates; nothing drags.
   2. Springs for things you touch, long curves for things that arrive.
   3. Short timings: UI feedback 80–550 ms, entrances ~800 ms, never 1.5 s+.
   4. Only opacity / transform-family properties animate (GPU friendly).
   5. Respect prefers-reduced-motion; never animate endlessly.
   ===================================================================== */

/* ── Timing scale (seconds) ─────────────────────────────────────────── */
export const duration = {
  instant: 0.08, // press / tap feedback
  fast: 0.15, // hover / focus
  standard: 0.30, // general transitions
  slow: 0.50, // heavier transitions
  entrance: 0.80, // entrance reveals (never above ~1.1 s)
} as const;

/* ── Easing curves (cubic-bezier arrays for framer-motion) ──────────── */
export const ease = {
  standard: [0.28, 0.11, 0.32, 1], // deceleration — Apple-style arrival
  out: [0.22, 1, 0.36, 1], // quick start, gentle landing
  inOut: [0.42, 0, 0.58, 1],
  sheet: [0.32, 0.72, 0, 1], // arrives, then settles
  spring: [0.34, 1.5, 0.64, 1], // gentle pop for touch feedback
} as const;

/* ── Stagger timing (seconds) ───────────────────────────────────────── */
export const stagger = {
  tight: 0.04, // small groups (chips, tags)
  standard: 0.08, // lists, cards, grid items
  loose: 0.12, // spacious sections
} as const;

/* ── Scroll reveal configuration ────────────────────────────────────── */
export const scroll = {
  threshold: 0.12, // fraction visible before revealing
  rootMargin: "0px 0px -12% 0px", // trigger slightly before viewport entry
  once: true, // animate once, never repeat on re-entry
} as const;

/* ── Entrance variants ──────────────────────────────────────────────── */
export const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.entrance, ease: ease.sheet },
    },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.entrance, ease: ease.sheet },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: duration.entrance, ease: ease.standard },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: duration.entrance, ease: ease.sheet },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger.standard,
        delayChildren: 0.1,
        ease: ease.standard,
      },
    },
  },
  staggerContainerTight: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger.tight,
        delayChildren: 0.05,
        ease: ease.standard,
      },
    },
  },
} as const;

/* ── Interaction configs (whileHover / whileTap) ────────────────────── */
export const hover = {
  lift: { y: -6 },
  scale: { scale: 1.03 },
  image: { scale: 1.04 },
  pop: { scale: 1.08, y: -2 },
} as const;

export const tap = {
  press: { scale: 0.965 },
  card: { scale: 0.994 },
  icon: { scale: 0.92 },
} as const;

/* ── Hooks ──────────────────────────────────────────────────────────── */
export function useReducedMotion(): boolean {
  return Boolean(useReducedMotionHook());
}

/* ── Reveal props helpers ───────────────────────────────────────────── */
/* Scroll reveal: animates once when the element enters the viewport. */
export function scrollReveal(reduced: boolean, delay = 0) {
  if (reduced) return {};
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: {
      margin: scroll.rootMargin,
      amount: scroll.threshold,
      once: scroll.once,
    },
    transition: {
      duration: duration.entrance,
      ease: ease.sheet,
      delay,
    },
  };
}

/* Mount reveal: animates on mount (for above-fold content such as the hero). */
export function mountReveal(reduced: boolean, delay = 0) {
  if (reduced) return {};
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: duration.entrance,
      ease: ease.sheet,
      delay,
    },
  };
}

/* Fade-only wrapper reveal (no transform, so it never compounds with child motion). */
export function fadeIn(reduced: boolean, delay = 0) {
  if (reduced) return {};
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: duration.entrance, ease: ease.standard, delay },
  };
}

/* =====================================================================
   FUNCTIONAL UI (preserved from previous implementation)
   Island navbar, eased anchor scrolling, active nav pill, scroll hub.
   These are interaction/UX features, not decorative motion.
   ===================================================================== */

const $ = (s: string, r: Document | Element = document): Element | null =>
  r.querySelector(s);

const $$ = (s: string, r: Document | Element = document): Element[] =>
  Array.from(r.querySelectorAll(s));

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

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
  /* Correct reduced-motion detection: only honor an explicit "reduce" preference. */
  const reduce = Boolean(
    matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  try {
    root.classList.add("js");
    if (reduce) root.classList.add("no-motion");
  } catch {
    root.classList.add("no-motion");
    return () => {};
  }

  const cleanups: (() => void)[] = [];
  const addCleanup = (fn: () => void) => cleanups.push(fn);

  /* One scroll/resize listener, one rAF per frame, shared by scroll-driven effects */
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
    hubRequest(); // prime once
  };
  addEventListener("scroll", hubRequest, { passive: true });
  addEventListener("resize", hubRequest, { passive: true });
  addCleanup(() => {
    removeEventListener("scroll", hubRequest);
    removeEventListener("resize", hubRequest);
    scrollSubs.length = 0;
    hubQueued = false;
  });

  /* ---------- Wait for fonts before measuring the island ---------- */
  const fontGate =
    document.fonts && document.fonts.load
      ? Promise.race([
          Promise.all([
            document.fonts.load("500 1em Inter"),
            document.fonts.load("600 1em Inter"),
            document.fonts.load("400 1em Plus Jakarta Sans"),
          ]).catch(() => {}),
          new Promise<void>((r) => setTimeout(r, 700)),
        ])
      : Promise.resolve();
  const ready = fontGate.then(
    () => new Promise<void>((r) => requestAnimationFrame(() => r())),
  );

  /* ---------- Eased anchor scrolling ---------- */
  let glide = 0;
  const cancelGlide = () => {
    if (glide) {
      cancelAnimationFrame(glide);
      glide = 0;
    }
  };
  ["wheel", "touchstart", "keydown"].forEach((ev) =>
    addEventListener(ev, cancelGlide, { passive: true }),
  );
  addCleanup(() => {
    ["wheel", "touchstart", "keydown"].forEach((ev) =>
      removeEventListener(ev, cancelGlide),
    );
    cancelGlide();
  });

  function easeInOutQuart(t: number) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  function glideTo(y: number, onDone?: () => void) {
    cancelGlide();
    const from = scrollY;
    const to = clamp(y, 0, Math.max(0, root.scrollHeight - innerHeight));
    const dist = to - from;
    if (Math.abs(dist) < 2) {
      onDone?.();
      return;
    }
    const dur = clamp(Math.abs(dist) * 0.45 + 550, 750, 1300);
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = clamp((now - t0) / dur, 0, 1);
      scrollTo({ top: from + dist * easeInOutQuart(t), behavior: "instant" });
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
    const id = a.getAttribute("href")?.slice(1) ?? "";
    const target = id && id !== "top" ? document.getElementById(id) : null;
    if (id && id !== "top" && !target) return;
    e.preventDefault();
    const margin = target
      ? parseFloat(getComputedStyle(target).scrollMarginTop || "0") || 0
      : 0;
    glideTo(target ? docTop(target) - margin : 0, () => {
      if (!target) return;
      if (!target.hasAttribute("tabindex"))
        target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
    try {
      history.pushState(null, "", "#" + id);
    } catch {
      /* file:// or sandboxed */
    }
  };

  document.addEventListener("click", onClick);
  addCleanup(() => document.removeEventListener("click", onClick));

  /* ---------- Active nav link + pill ---------- */
  const links = $$(".nav-link");
  let syncPill: () => void = () => {};
  if (typeof IntersectionObserver !== "undefined" && links.length) {
    const byId = new Map(
      links.map((a) => [a.getAttribute("href")?.slice(1) ?? "", a]),
    );
    const setActive = (active: Element | null) => {
      links.forEach((l) => {
        const on = l === active;
        l.classList.toggle("active", on);
        if (on) l.setAttribute("aria-current", "true");
        else l.removeAttribute("aria-current");
      });
      syncPill();
    };
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(byId.get(e.target.id) ?? null);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
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

  /* ---------- Dynamic island navbar ---------- */
  const header = $("header") as HTMLElement | null;
  if (header) {
    const hcs = getComputedStyle(header);
    const wasOut = hcs.position === "fixed" || hcs.position === "absolute";
    const hTop = wasOut ? header.offsetTop : docTop(header);
    let spacer: HTMLElement | null = null;
    if (!wasOut) {
      const next = header.nextElementSibling as HTMLElement | null;
      let h = next ? docTop(next) - hTop : header.offsetHeight;
      const pcs = header.parentElement
        ? getComputedStyle(header.parentElement)
        : null;
      if (pcs && /flex|grid/.test(pcs.display))
        h -= parseFloat(pcs.rowGap) || 0;
      spacer = document.createElement("div");
      spacer.className = "island-spacer";
      spacer.setAttribute("aria-hidden", "true");
      spacer.style.height = Math.max(0, h) + "px";
      spacer.style.marginTop = hcs.marginTop;
      header.before(spacer);
    }
    header.style.setProperty("--island-top", Math.max(14, hTop) + "px");
    header.style.setProperty("--sy", scrollY + "px");
    header.classList.add("island");
    const hero = $("#hero") as HTMLElement | null;
    let state = "top";
    let hover = false;
    let dirUp = false;
    let lastY = scrollY;
    let acc = 0;
    let leaveTimer = 0;
    let trackUntil = 0;
    let trackRaf = 0;

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

    const decide = (y: number) => {
      if (y < 80) return "top";
      if (hover || header.matches(":focus-within")) return "expanded";
      return dirUp ? "expanded" : "compact";
    };
    const apply = (y = scrollY) => {
      const next = decide(y);
      if (next === state && header.dataset.island === next) return;
      state = next;
      header.dataset.island = next;
      trackPill(1800);
    };

    const measure = () => {
      if (hero)
        header.style.setProperty("--island-hero", hero.offsetWidth + "px");
      header.classList.add("is-measuring", "no-trans");
      const hr = header.getBoundingClientRect();
      const k = hr.width / (header.offsetWidth || 1) || 1;
      let right = 0;
      header.querySelectorAll("*").forEach((n) => {
        const r = (n as HTMLElement).getBoundingClientRect();
        if (r.width || r.height) right = Math.max(right, r.right);
      });
      const padR = parseFloat(getComputedStyle(header).paddingRight) || 0;
      header.classList.remove("is-measuring");
      void header.offsetWidth;
      requestAnimationFrame(() => header.classList.remove("no-trans"));
      if (right > hr.left)
        header.style.setProperty(
          "--island-compact",
          Math.ceil((right - hr.left) / k + padR + 14) + "px",
        );
    };
    measure();
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(measure);
    addEventListener("resize", measure, { passive: true });
    addCleanup(() => removeEventListener("resize", measure));

    header.dataset.island = state;
    apply();

    onScrollFrame((y) => {
      const d = y - lastY;
      lastY = y;
      acc = Math.sign(d) === Math.sign(acc) ? acc + d : d;
      if (glide) dirUp = false;
      else if (acc > 40) dirUp = false;
      else if (acc < -48) dirUp = true;

      const max = Math.max(1, root.scrollHeight - innerHeight);
      header.style.setProperty("--p", clamp(y / max, 0, 1).toFixed(3));
      header.style.setProperty("--sy", y + "px");
      apply(y);
    });

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      clearTimeout(leaveTimer);
      hover = true;
      apply();
    };
    const onLeave = () => {
      clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => {
        hover = false;
        apply();
      }, 600);
    };
    const onFocusChange = () => requestAnimationFrame(() => apply());
    header.addEventListener("pointerenter", onEnter);
    header.addEventListener("pointerleave", onLeave);
    header.addEventListener("focusin", onFocusChange);
    header.addEventListener("focusout", onFocusChange);
    addCleanup(() => {
      clearTimeout(leaveTimer);
      header.removeEventListener("pointerenter", onEnter);
      header.removeEventListener("pointerleave", onLeave);
      header.removeEventListener("focusin", onFocusChange);
      header.removeEventListener("focusout", onFocusChange);
      header.classList.remove("island");
      delete header.dataset.island;
      spacer?.remove();
    });

    /* Sliding nav pill */
    const navLinks = $$(".nav-link") as HTMLElement[];
    const host = navLinks[0]?.parentElement ?? null;
    if (host) {
      host.classList.add("nav-pill-host");
      const pill = document.createElement("span");
      pill.className = "nav-pill";
      pill.setAttribute("aria-hidden", "true");
      host.prepend(pill);

      let hovered: HTMLElement | null = null;
      let armed = false;
      const place = (el: HTMLElement | null) => {
        if (!el) {
          pill.style.opacity = "0";
          return;
        }
        const padX = 12;
        const padY = 6;
        pill.style.setProperty("--x", el.offsetLeft - padX + "px");
        pill.style.setProperty("--y", el.offsetTop - padY + "px");
        pill.style.setProperty("--pw", el.offsetWidth + padX * 2 + "px");
        pill.style.setProperty("--ph", el.offsetHeight + padY * 2 + "px");
        pill.style.opacity = "1";
        if (!armed) {
          armed = true;
          requestAnimationFrame(() =>
            requestAnimationFrame(() => pill.classList.add("is-ready")),
          );
        }
      };
      syncPill = () =>
        place(
          hovered ??
            navLinks.find((l) => l.classList.contains("active")) ??
            null,
        );

      navLinks.forEach((l) => {
        const enter = (e: Event) => {
          if ((e as PointerEvent).pointerType === "touch") return;
          hovered = l;
          syncPill();
        };
        const leave = () => {
          hovered = null;
          syncPill();
        };
        l.addEventListener("pointerenter", enter);
        l.addEventListener("focus", enter);
        l.addEventListener("blur", leave);
        addCleanup(() => {
          l.removeEventListener("pointerenter", enter);
          l.removeEventListener("focus", enter);
          l.removeEventListener("blur", leave);
        });
      });
      const hostLeave = () => {
        hovered = null;
        syncPill();
      };
      host.addEventListener("pointerleave", hostLeave);
      addCleanup(() => {
        host.removeEventListener("pointerleave", hostLeave);
        pill.remove();
        host.classList.remove("nav-pill-host");
        syncPill = () => {};
      });
      ready.then(syncPill);
    }
  }

  hubRequest();

  return () => {
    cleanups.forEach((fn) => fn());
    root.classList.remove("js", "no-motion");
    initialized = false;
  };
}
