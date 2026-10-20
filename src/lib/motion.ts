type RevealElement = HTMLElement & {
  _init?: boolean;
  _plan?: number;
  _lag?: number;
  _gap?: number;
  _o?: number;
  _done?: boolean;
};

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
  const reduce =
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    matchMedia("(prefers-reduced-motion: no-preference)").matches === false;

  /* ---------- Safety net: never leave content hidden if JS fails ---------- */
  try {
    root.classList.add("js");
    if (reduce) root.classList.add("no-motion");
  } catch {
    root.classList.add("no-motion");
    return () => {};
  }

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

  let glide = 0;
  let syncPill: () => void = () => {};

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

  /* ---------- Wait for fonts before animating ---------- */
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

  /* ---------- Reveal engine ---------- */
  const domOrder = (a: Node, b: Node) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

  const io =
    typeof IntersectionObserver !== "undefined"
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
                  : (el._lag ?? 0) + n++ * (el._gap ?? 0),
              );
              el.style.setProperty("--d", delay + "ms");
              el.classList.add("in");
              obs.unobserve(el);
              later(() => {
                if (el._done) return;
                el._done = true;
                el.classList.add("done");
                el.style.removeProperty("will-change");
                el.style.removeProperty("--d");
              }, delay + 900);
            });
          },
          { threshold: 0.10, rootMargin: "0px 0px -6% 0px" },
        )
      : null;

  const queue = (el: Element) => {
    ready.then(() => {
      if (!io) {
        el.classList.add("in", "done");
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
    } = {},
  ) {
    const list: Element[] = !targets
      ? []
      : Array.isArray(targets)
        ? targets
        : [targets];
    list.forEach((el, i) => {
      if ((el as RevealElement)._done) return;
      el.classList.add("reveal");
      const elStyle = el as HTMLElement;
      if (y !== undefined) elStyle.style.setProperty("--y", y);
      if (s !== undefined) elStyle.style.setProperty("--s", s);
      if (blur) el.setAttribute("data-blur", "");
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
      step = 45,
      lag = 0,
      gap = 100,
    }: {
      base?: number;
      step?: number;
      lag?: number;
      gap?: number;
    } = {},
  ) {
    if (!el) return;
    const nodes = Array.from(el.childNodes);
    el.setAttribute(
      "aria-label",
      nodes
        .map((n) => (n.nodeName === "BR" ? " " : n.textContent))
        .join("")
        .trim()
        .replace(/\s+/g, " "),
    );
    el.setAttribute("data-split", "");
    el.textContent = "";
    let i = 0;
    let needSpace = false;
    nodes.forEach((node) => {
      if (node.nodeName === "BR") {
        el.appendChild(document.createElement("br"));
        needSpace = false;
        return;
      }
      node.textContent
        ?.split(/\s+/)
        .filter(Boolean)
        .forEach((word) => {
          if (needSpace) el.appendChild(document.createTextNode(" "));
          const w = document.createElement("span");
          w.className = "w";
          w.setAttribute("aria-hidden", "true");
          const inner = document.createElement("span");
          inner.className = "wi";
          inner.style.setProperty("--i", String(i++));
          inner.textContent = word;
          w.appendChild(inner);
          el.appendChild(w);
          needSpace = true;
        });
    });
    (el as HTMLElement).style.setProperty("--step", step + "ms");
    const revealEl = el as RevealElement;
    revealEl._plan = base;
    revealEl._lag = lag;
    revealEl._gap = gap;
    queue(el);
  }

  /* Scroll-scrubbed text: rAF loop damps displayed progress toward target, sleeps when caught up. */
  function scrubWords(el: Element | null) {
    if (!el || reduce) return;
    const text = (el.textContent ?? "").trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", text);
    el.textContent = "";
    const parts = text.split(" ");
    const words = parts.map((word, i) => {
      const s = document.createElement("span");
      s.className = "sw";
      s.setAttribute("aria-hidden", "true");
      s.textContent = word;
      el.appendChild(s);
      if (i < parts.length - 1) el.appendChild(document.createTextNode(" "));
      return s;
    });
    const tail = 6;
    const n = words.length;
    let target = 0;
    let cur = 0;
    let raf = 0;
    let active = false;

    const updateTarget = () => {
      const r = el.getBoundingClientRect();
      const p = clamp(
        (innerHeight * 0.86 - r.top) / (r.height + innerHeight * 0.3),
        0,
        1,
      );
      target = p;
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      // exponential damping toward target
      cur += (target - cur) * (1 - Math.exp(-0.18));
      const spread = clamp(cur * (n + tail), 0, n + tail);
      let any = false;
      words.forEach((w, i) => {
        const v = clamp((spread - i) / tail, 0, 1);
        const o = Number((0.25 + 0.75 * v).toFixed(2));
        const we = w as RevealElement;
        if (we._o !== o) {
          we._o = o;
          w.style.opacity = String(o);
        }
        if (o < 1 || o > 0.25) any = true;
      });
      if (Math.abs(target - cur) < 0.002 && !any) {
        active = false;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    onScrollFrame(updateTarget);
    updateTarget();
    addCleanup(() => {
      if (raf) cancelAnimationFrame(raf);
    });
  }

  /* ---------- Auto-choreography for every remaining element ---------- */
  const isDescendantOf = (el: Element, selector: string) =>
    el.closest(selector) !== null;

  function typeOf(el: Element): "text" | "card" | "media" | "pop" | "line" | "field" | null {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO") return "media";
    if (el.matches("hr")) return "line";
    if (el.matches("input, textarea, select, label")) return "field";
    if (el.matches("button, .btn, .icon-btn, [role='button'], .badge, .avatar")) return "pop";
    if (el.matches("svg, [class*='icon'], .status-dot")) return "pop";
    // links: button-like links pop, regular links rise as text
    if (el.matches("a")) return el.matches(".btn, .icon-btn") ? "pop" : "text";
    // rounded blocks / cards / visible container blocks with styling
    if (
      el.matches(
        "[class*='rounded'], [class*='card'], .bg-white, [class*='gradient-card']",
      ) &&
      !el.matches("h1, h2, h3, h4, h5, h6, p, li, button")
    )
      return "card";
    if (el.matches("h1, h2, h3, h4, h5, h6, p, span, li")) return "text";
    return null;
  }

  function autoAnimate() {
    const candidates = $$(
      "h1, h2, h3, h4, h5, h6, p, span, li, a, button, img, video, svg, input, textarea, select, label, hr, .badge, .avatar, [class*='rounded'], .bg-white, [class*='gradient-card'], .card, [class*='card']",
    );
    const seen = new Set<Element>();
    const ordered = candidates.filter((el) => {
      if (seen.has(el)) return false;
      seen.add(el);
      // skip hidden / a11y
      if (el.hasAttribute("aria-hidden") && el.getAttribute("aria-hidden") === "true")
        return false;
      if (el.closest("[aria-hidden='true']")) return false;
      if (el.matches(".sr-only")) return false;
      if (getComputedStyle(el).display === "none") return false;
      // skip anchor wrappers that contain block content (they move with children)
      if (el.matches("a") && el.children.length > 0) return false;
      // descendants of buttons/headings/paragraphs/list items move with parent
      if (
        isDescendantOf(el, "button, .btn") ||
        isDescendantOf(el, "h1, h2, h3, h4, h5, h6") ||
        isDescendantOf(el, "p") ||
        isDescendantOf(el, "li")
      )
        return false;
      // descendants of an already-revealed card/container move with it
      if (isDescendantOf(el, ".reveal, .card-lift")) return false;
      // already has an entrance
      if (el.classList.contains("reveal")) return false;
      const t = typeOf(el);
      if (!t) return false;
      return true;
    });

    // DOM order
    ordered.sort(domOrder);

    let idx = 0;
    ordered.forEach((el) => {
      const t = typeOf(el);
      if (!t) return;
      const base = 120 + idx * 28;
      idx++;
      const typeCls = { text: "text-rise", card: "card-rise", media: "media-unveil", pop: "pop-spring", line: "line-draw", field: "field-rise" }[t as "text" | "card" | "media" | "pop" | "line" | "field"];
      if (typeCls) el.classList.add(typeCls);
      el.setAttribute("data-type", t);
      switch (t) {
        case "text":
          reveal(el, { base, y: "14px", blur: true });
          break;
        case "card":
          reveal(el, { base, y: "20px", s: ".97" });
          el.classList.add("card-lift");
          break;
        case "media":
          reveal(el, { base, y: "24px", s: ".96" });
          el.classList.add("media-img");
          break;
        case "pop":
          reveal(el, { base, s: ".94", y: "6px" });
          break;
        case "line":
          reveal(el, { base, y: "0", s: "1" });
          el.classList.add("line-draw");
          break;
        case "field":
          reveal(el, { base, y: "10px", blur: false });
          break;
      }
    });
  }

  /* ---------- Count-up numbers (tabular-nums, once on first view, skip years) ---------- */
  function countUpNumbers() {
    if (reduce) return;
    const NUM_RE = /^[-+]?\d[\d,]*(\.\d+)?(%|x|\+|M|K|B)?$/;
    const YEAR_RE = /^(19|20)\d{2}$/;
    const nodes = $$(
      "h1, h2, h3, h4, h5, h6, p, span, li, div, section",
    ).filter((el) => {
      const t = (el.textContent ?? "").trim();
      if (!NUM_RE.test(t)) return false;
      if (YEAR_RE.test(t)) return false;
      // skip descendants already counted
      if (el.closest("[data-counted]")) return false;
      return true;
    });
    nodes.forEach((el) => {
      const ioNum = io;
      if (!ioNum) return;
      const obs = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          if (!e.isIntersecting) return;
          obs.disconnect();
          const text = (el.textContent ?? "").trim();
          const m = text.match(/([-+]?\d[\d,]*)(\.\d+)?(%|x|\+|M|K|B)?/);
          if (!m) return;
          const raw = m[1].replace(/,/g, "");
          const num = parseFloat(raw);
          if (!Number.isFinite(num)) return;
          const suffix = m[3] ?? "";
          const decimals = m[2] ?? "";
          el.setAttribute("data-counted", "1");
          (el as HTMLElement).style.setProperty("font-variant-numeric", "tabular-nums");
          const start = 0;
          const dur = 900;
          const t0 = performance.now();
          const step = (now: number) => {
            const k = clamp((now - t0) / dur, 0, 1);
            const eased = 1 - Math.pow(1 - k, 3); // ease-out cubic
            const val = start + (num - start) * eased;
            el.textContent = val.toLocaleString(undefined, {
              minimumFractionDigits: decimals ? decimals.length - 1 : 0,
              maximumFractionDigits: decimals ? decimals.length - 1 : 0,
            }) + suffix;
            if (k < 1) requestAnimationFrame(step);
            else el.textContent = text; // restore exact original
          };
          requestAnimationFrame(step);
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );
      obs.observe(el);
      addCleanup(() => obs.disconnect());
    });
  }

  /* ---------- Pointer-following light on cards (rAF, feeds CSS vars) ---------- */
  function pointerLight() {
    if (reduce || typeof window === "undefined") return;
    const cards = $$(".card-lift") as HTMLElement[];
    if (!cards.length) return;
    let mx = 0;
    let my = 0;
    let active = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const card = target?.closest(".card-lift");
      if (!card) return;
      const r = card.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      cards.forEach((c) => {
        c.style.setProperty("--lx", String(mx));
        c.style.setProperty("--ly", String(my));
      });
      raf = requestAnimationFrame(tick);
    };

    cards.forEach((c) => {
      c.addEventListener("pointermove", move);
    });
    addCleanup(() => {
      cards.forEach((c) => {
        c.removeEventListener("pointermove", move);
        c.style.removeProperty("--lx");
        c.style.removeProperty("--ly");
      });
      if (raf) cancelAnimationFrame(raf);
    });
  }

  /* ---------- Magnetic buttons via real JS spring ---------- */
  function magneticButtons() {
    if (reduce) return;
    const btns = $$(".btn:not(.btn-wide)");
    const stiffness = 260;
    const damping = 22;
    btns.forEach((button) => {
      const b = button as HTMLElement;
      let tx = 0;
      let ty = 0;
      let vx = 0;
      let vy = 0;
      let raf = 0;
      let active = false;

      const spring = () => {
        const dt = 0.016;
        const ax = -stiffness * tx - damping * vx;
        const ay = -stiffness * ty - damping * vy;
        vx += ax * dt;
        vy += ay * dt;
        tx += vx * dt;
        ty += vy * dt;
        const settled =
          Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01 && Math.abs(tx) < 0.01 && Math.abs(ty) < 0.01;
        b.style.translate = `${tx.toFixed(2)}px ${ty.toFixed(2)}px`;
        if (settled) {
          active = false;
          raf = 0;
          b.style.translate = "";
        } else {
          raf = requestAnimationFrame(spring);
        }
      };

      const onMove = (e: PointerEvent) => {
        const r = b.getBoundingClientRect();
        const dx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 14;
        const dy = ((e.clientY - (r.top + r.height / 2)) / r.height) * 14;
        tx = clamp(dx, -14, 14);
        ty = clamp(dy, -14, 14);
        if (!active) {
          active = true;
          raf = requestAnimationFrame(spring);
        }
      };
      const onLeave = () => {
        tx = 0;
        ty = 0;
        vx = 0;
        vy = 0;
        if (!active) {
          active = true;
          raf = requestAnimationFrame(spring);
        }
      };
      b.addEventListener("pointermove", onMove);
      b.addEventListener("pointerleave", onLeave);
      addCleanup(() => {
        b.removeEventListener("pointermove", onMove);
        b.removeEventListener("pointerleave", onLeave);
        b.style.translate = "";
        if (raf) cancelAnimationFrame(raf);
      });
    });
  }

  /* ---------- Inline links: underline sweep ---------- */
  function inlineLinkSweep() {
    const links = $$("a:not(.nav-link):not(.foot-link):not(.btn)");
    links.forEach((a) => {
      const link = a as HTMLElement;
      if (link.classList.contains("has-sweep")) return;
      link.classList.add("has-sweep");
      link.style.position = link.style.position || "relative";
    });
  }

  /* ---------- Images: gentle zoom on hover (CSS) ---------- */
  /* handled in CSS via .media-img:hover */

  /* ---------- Hero parallax ---------- */
  function heroParallax() {
    const hero = $("#hero");
    if (!hero || reduce) return;
    let cols = $$(".parallax-col", hero);
    if (!cols.length) {
      const direct = Array.from(hero.children) as HTMLElement[];
      direct.forEach((c) => c.classList.add("parallax-col"));
      cols = $$(".parallax-col", hero);
    }
    if (!cols.length) return;
    const run = (y: number) => {
      const r = hero.getBoundingClientRect();
      const p = clamp((innerHeight * 0.5 - (r.top - y)) / (r.height + innerHeight), -1, 1);
      cols.forEach((c, i) => {
        const el = c as HTMLElement;
        const rate = 0.06 + i * 0.04;
        el.style.setProperty("--py", String(p * rate * 60) + "px");
        el.style.setProperty("--po", String(clamp(1 - Math.abs(p) * 0.35, 0.65, 1)));
      });
    };
    onScrollFrame((y) => {
      run(y);
    });
    run(scrollY);
    addCleanup(() => {
      cols.forEach((c) => {
        (c as HTMLElement).style.removeProperty("--py");
        (c as HTMLElement).style.removeProperty("--po");
      });
    });
  }

  /* ---------- Marquee: ease to stop on hover ---------- */
  (() => {
    const track = $(".animate-marquee") as HTMLElement | null;
    const wrap = track?.closest(".marquee-wrap") as Element | null;
    if (!track || !wrap || reduce) return;
    track.classList.add("is-js");
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
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    if (ro) {
      ro.observe(track);
      addCleanup(() => ro.disconnect());
    } else {
      addEventListener("resize", measure, { passive: true });
      addCleanup(() => removeEventListener("resize", measure));
    }
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      mult += (goal - mult) * (1 - Math.exp(-dt * 4.5));
      if (loop > 0) {
        x -= (loop / 22) * mult * dt;
        if (x <= -loop) x += loop;
        track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
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
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const onEnter = (e: Event) => {
      if ((e as PointerEvent).pointerType === "mouse") goal = 0;
    };
    const onLeave = () => {
      goal = 1;
    };
    const obs =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
        : null;
    if (obs) {
      obs.observe(wrap);
      addCleanup(() => obs.disconnect());
    } else {
      start();
    }
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    addCleanup(() => {
      stop();
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
    });
  })();

  /* ---------- Eased anchor scrolling ---------- */
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

  /* ---------- Orchestrate everything ---------- */
  ready.then(() => {
    try {
      if (!reduce) {
        /* Hero: one orchestrated entrance under ~1.5s */
        const heroLeft = $("#hero > div:first-child");
        reveal($("header"), { base: 0, y: "-20px", s: ".985" });
        splitWords(heroLeft ? $("h1", heroLeft) : null, { base: 180, step: 48 });
        reveal(heroLeft?.querySelector(".space-y-8 > div"), {
          base: 100,
          y: "18px",
          blur: true,
        });
        reveal(heroLeft?.querySelector(".space-y-8 > p"), {
          base: 620,
          lag: 120,
          y: "22px",
          blur: true,
        });
        reveal(heroLeft?.querySelector(":scope > .pt-8"), {
          base: 860,
          lag: 200,
          y: "22px",
        });
        reveal($$("#hero > div:last-child .grid > div"), {
          base: 400,
          step: 110,
          y: "44px",
          s: ".96",
        });
        reveal($$("#hero .icon-btn"), {
          base: 1060,
          lag: 350,
          step: 70,
          y: "0px",
          s: ".92",
        });

        /* Mission */
        const about = $("#about");
        reveal(about, { base: 0, y: "40px", s: ".97" });
        scrubWords(about ? $("h2", about) : null);
        reveal($$("#about > div:last-child > span"), {
          base: 100,
          step: 70,
          lag: 150,
          y: "16px",
          blur: true,
        });

        /* Services */
        splitWords($("#services h2"), { base: 0, step: 50 });
        reveal($("#services > div:first-child > p"), {
          base: 150,
          lag: 200,
          y: "18px",
          blur: true,
        });
        reveal($$("#services > div:last-child > div"), {
          base: 300,
          step: 100,
          y: "40px",
          s: ".97",
        });

        /* Work */
        splitWords($("#work h2"), { base: 0, step: 50 });
        reveal($("#work > div:first-child > div"), {
          base: 150,
          lag: 200,
          y: "18px",
        });
        reveal($("#work > div:last-child > div:first-child"), {
          base: 300,
          y: "48px",
          s: ".97",
        });
        reveal($$("#work > div:last-child > div:last-child > div"), {
          base: 300,
          step: 120,
          y: "48px",
          s: ".97",
        });

        /* Contact + footer */
        reveal($("#contact"), { base: 0, y: "36px", s: ".975" });
        splitWords($("#contact h2"), { base: 0, step: 35, lag: 100 });
        reveal($("#contact h2 + p"), {
          base: 200,
          lag: 300,
          y: "16px",
          blur: true,
        });
        reveal($$("#contact-form > *"), {
          base: 280,
          lag: 400,
          step: 90,
          y: "24px",
        });
        reveal($("footer"), { base: 0, y: "18px" });

        /* Hover hooks */
        $$(
          "#services > div:last-child > div, #work > div:last-child > div:last-child > div, #work > div:last-child > div:first-child",
        ).forEach((c) => c.classList.add("card-lift"));
        $$("#hero .reveal").forEach((c) => {
          if (c.querySelector(".media-img")) c.classList.add("zoom-host");
        });

        /* Auto-choreograph everything remaining */
        autoAnimate();

        /* Count-up numbers */
        countUpNumbers();

        /* Pointer-following light on cards */
        pointerLight();

        /* Magnetic buttons */
        magneticButtons();

        /* Inline link sweep */
        inlineLinkSweep();

        /* Hero parallax */
        heroParallax();
      }
    } catch {
      console.warn("Motion setup failed; showing content without animation.");
      root.classList.add("no-motion");
    }
  });

  hubRequest();

  return () => {
    cleanups.forEach((fn) => fn());
    if (io) io.disconnect();
    root.classList.remove("js", "no-motion");
    initialized = false;
  };
}
