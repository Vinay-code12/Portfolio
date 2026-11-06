import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* =========================================================
   Mobile menu
   ========================================================= */
const menuBtn = document.querySelector(".opt");
const menu = document.querySelector(".item");

if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
    // open hone ke baad "[ Close ]", band hone ke baad "[ Menu ]"
    menuBtn.textContent = menu.classList.contains("active") ? "[ Close ]" : "[ Menu ]";
  });
}

/* =========================================================
   GSAP animations
   ========================================================= */
(() => {
  const loader = document.querySelector(".loader");
  const removeLoader = () => loader && loader.remove();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // If the user prefers less motion, show the plain page instead of animating.
  if (reduceMotion) {
    removeLoader();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const q = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const menuOpen = () => !!(menu && menu.classList.contains("active"));

  /* ---------- Split text into words / chars (keeps <b> and <br>) ---------- */
  function split(el, chars = true) {
    if (!el) return [];
    if (el._split) return el._split;
    const pieces = [];

    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            const word = document.createElement("span");
            word.className = "w";
            if (chars) {
              Array.from(part).forEach((ch) => {
                const c = document.createElement("span");
                c.className = "c";
                c.textContent = ch;
                word.appendChild(c);
                pieces.push(c);
              });
            } else {
              const inner = document.createElement("span");
              inner.className = "wi";
              inner.textContent = part;
              word.appendChild(inner);
              pieces.push(inner);
            }
            frag.appendChild(word);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
          walk(child);
        }
      });
    };

    if (chars) el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    walk(el);
    if (chars) qa(".w", el).forEach((w) => w.setAttribute("aria-hidden", "true"));
    el._split = pieces;
    return pieces;
  }

  /* ---------- Smooth scrolling (Lenis) ---------- */
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const lockScroll = (locked) => {
    if (lenis) locked ? lenis.stop() : lenis.start();
    document.documentElement.style.overflow = locked ? "hidden" : "";
  };

  // Smooth scroll for in-page links (#about, #work, #contact ...)
  qa('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = id.length > 1 ? q(id) : null;
      if (!target) return;
      e.preventDefault();
      if (menuOpen()) menuBtn.click();
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.4 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- Hero intro ---------- */
  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    const h1 = q(".hero h1");
    if (h1) {
      h1.classList.add("mask");
      tl.from(split(h1), { yPercent: 120, duration: 1.3, stagger: 0.035 }, 0);
    }

    const img = q(".hero img");
    if (img) {
      tl.fromTo(
        img,
        { clipPath: "inset(100% 0% 0% 0% round 20px)", scale: 1.2 },
        { clipPath: "inset(0% 0% 0% 0% round 20px)", scale: 1, duration: 1.6, ease: "expo.out", clearProps: "clipPath" },
        0.1
      );
    }

    const h4 = q(".hero h4");
    if (h4) tl.from(split(h4), { opacity: 0, y: 20, duration: 0.8, stagger: 0.03 }, 0.5);

    const p = q(".hero p");
    if (p) {
      p.classList.add("mask");
      tl.from(split(p, false), { yPercent: 110, duration: 1, stagger: 0.02 }, 0.6);
    }

    const navItems = qa("nav > *");
    if (navItems.length) tl.from(navItems, { y: -30, opacity: 0, duration: 1, stagger: 0.08 }, 0.3);

    const herofoot = q(".herofoot");
    if (herofoot) tl.from(herofoot, { y: 30, opacity: 0, duration: 1 }, 0.9);

    return tl;
  }

  /* ---------- Preloader → hero ---------- */
  if (loader) {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    lockScroll(true);

    // Shorter count on repeat visits in the same tab session
    let seen = false;
    try {
      seen = sessionStorage.getItem("vk-intro") === "1";
      sessionStorage.setItem("vk-intro", "1");
    } catch (err) {
      /* storage blocked: just play the full intro */
    }
    const countDur = seen ? 0.7 : 1.8;

    const count = q(".loader__count", loader);
    const progress = { v: 0 };

    gsap
      .timeline()
      .to(progress, {
        v: 100,
        duration: countDur,
        ease: "power2.inOut",
        onUpdate: () => (count.textContent = Math.round(progress.v)),
      })
      .to(".loader__bar", { scaleX: 1, duration: countDur, ease: "power2.inOut" }, 0)
      .to(".loader__inner", { yPercent: -40, opacity: 0, duration: 0.6, ease: "power3.in" })
      .to(
        loader,
        {
          yPercent: -100,
          duration: 1.1,
          ease: "expo.inOut",
          onComplete: () => {
            removeLoader();
            lockScroll(false);
            ScrollTrigger.refresh();
          },
        },
        "-=0.15"
      )
      .add(heroIntro(), "-=0.6");
  } else {
    heroIntro();
  }

  /* ---------- Nav: solid background + hide on scroll down ---------- */
  const nav = q("nav");
  if (nav) {
    let hidden = false;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        nav.classList.toggle("nav--solid", y > 40);
        const hide = self.direction === 1 && y > 400 && !menuOpen();
        if (hide !== hidden) {
          hidden = hide;
          gsap.to(nav, { yPercent: hide ? -120 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        }
      },
    });
  }

  /* ---------- Scroll progress bar ---------- */
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  /* ---------- Hero parallax ---------- */
  if (q(".hero")) {
    const heroScroll = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
    gsap.to(".hero img", { yPercent: -15, ease: "none", scrollTrigger: heroScroll });
    gsap.to(".hero h1", { xPercent: -8, ease: "none", scrollTrigger: { ...heroScroll } });
  }

  const heroArrow = q(".herofoot .arow");
  if (heroArrow) gsap.to(heroArrow, { x: 8, duration: 0.8, ease: "sine.inOut", repeat: -1, yoyo: true });

  /* ---------- Big section headings (ABOUT ME / RECENT WORKS / RESUME) ---------- */
  qa(".about h1, .recent h1").forEach((el) => {
    el.classList.add("mask");
    gsap.from(split(el), {
      yPercent: 110,
      rotate: 8,
      opacity: 0,
      stagger: 0.04,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", end: "top 40%", scrub: 1 },
    });
  });

  /* ---------- About section ---------- */
  const p1 = q(".about1 .p1");
  if (p1) {
    gsap.fromTo(
      split(p1, false),
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: p1, start: "top 85%", end: "bottom 50%", scrub: true },
      }
    );
  }

  const aboutImg = q(".about1 img");
  if (aboutImg) {
    gsap.from(aboutImg, {
      y: 120,
      rotate: -6,
      opacity: 0,
      duration: 1.4,
      ease: "power3.out",
      scrollTrigger: { trigger: aboutImg, start: "top 90%" },
    });
  }

  qa(".about1 h6, .about1 .p2, .about1 .bt").forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  qa(".about1 hr").forEach((el) => {
    gsap.from(el, {
      scaleX: 0,
      transformOrigin: "0% 50%",
      duration: 1.4,
      ease: "power3.inOut",
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });

  const p2 = q(".about1 .p2");
  if (p2) {
    gsap.fromTo(
      p2,
      { backgroundPosition: "50% 0%" },
      {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: { trigger: p2, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  }

  /* ---------- Project cards ---------- */
  const cards = qa(".pcard");

  cards.forEach((card) => {
    const title = q(".pcard__title", card);
    if (title) title.classList.add("mask");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: card, start: "top 78%" },
    });

    tl.from(q(".pcard__media", card), { y: 80, opacity: 0, duration: 1.2 }, 0)
      .from(q(".pcard__meta", card), { y: 30, opacity: 0, duration: 0.8 }, 0.1)
      .from(split(title), { yPercent: 110, duration: 1, stagger: 0.03, ease: "power4.out" }, 0.15)
      .from(q(".pcard__desc", card), { y: 30, opacity: 0, duration: 0.9 }, 0.3)
      .from(qa(".pcard__stack li", card), { y: 16, opacity: 0, duration: 0.5, stagger: 0.05 }, 0.4)
      .from(q(".pcard__link", card), { yPercent: 60, opacity: 0, duration: 0.8 }, 0.55);
  });

  // Desktop: cards pin and stack on top of each other while scrolling
  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (min-height: 600px)", () => {
    const last = cards[cards.length - 1];
    cards.forEach((card, i) => {
      if (card === last) return;
      const next = cards[i + 1];

      ScrollTrigger.create({
        trigger: card,
        start: "top 10%",
        endTrigger: last,
        end: "top 10%",
        pin: true,
        pinSpacing: false,
      });

      const stackScroll = { trigger: next, start: "top bottom", end: "top 10%", scrub: true };
      gsap.to(card, { scale: 0.9, ease: "none", scrollTrigger: stackScroll });
      gsap.to(q(".pcard__shade", card), { opacity: 0.6, ease: "none", scrollTrigger: { ...stackScroll } });
    });
  });

  // 3D tilt on the browser mockup
  if (finePointer) {
    qa(".pcard__media").forEach((media) => {
      const frame = q(".browser", media);
      if (!frame) return;
      gsap.set(frame, { transformPerspective: 1200 });
      const rx = gsap.quickTo(frame, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(frame, "rotationY", { duration: 0.6, ease: "power3.out" });
      media.addEventListener("pointermove", (e) => {
        const r = media.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
      });
      media.addEventListener("pointerleave", () => {
        rx(0);
        ry(0);
      });
    });
  }

  /* ---------- GitHub CTA ---------- */
  const workfoot = q(".workfoot");
  if (workfoot) {
    gsap
      .timeline({ scrollTrigger: { trigger: workfoot, start: "top 80%" }, defaults: { ease: "power3.out" } })
      .from(q(".workfoot__label", workfoot), { y: 30, opacity: 0, duration: 0.8 })
      .from(q(".workfoot__link", workfoot), { yPercent: 60, opacity: 0, duration: 1.1 }, 0.1);
  }

  /* ---------- Skills marquee (speeds up with scroll velocity) ---------- */
  const track = q(".marquee__track");
  if (track && track.firstElementChild) {
    const clone = track.firstElementChild.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);

    const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const boost = gsap.utils.clamp(1, 5, Math.abs(self.getVelocity()) / 250);
        gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.2 });
      },
    });
  }

  /* ---------- Connect section ---------- */
  const connect = q(".connect");
  if (connect) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: connect, start: "top 75%" },
      defaults: { ease: "power4.out" },
    });
    const h2 = q("h2", connect);
    const h1 = q("h1", connect);
    if (h2) {
      h2.classList.add("mask");
      tl.from(split(h2), { yPercent: 110, duration: 0.8, stagger: 0.02 }, 0);
    }
    if (h1) {
      h1.classList.add("mask");
      tl.from(split(h1), { yPercent: 110, duration: 1.1, stagger: 0.025 }, 0.15);
    }
    tl.from(qa("input", connect), { y: 40, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.4);
    const submit = q(".bttn", connect);
    if (submit) tl.from(submit, { yPercent: 60, opacity: 0, duration: 0.9 }, 0.7);
  }

  /* ---------- Resume page ---------- */
  const resumeItems = qa("#ll, .riiight > *");
  if (resumeItems.length) {
    gsap.from(resumeItems, {
      y: 60,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ".main", start: "top 75%" },
    });
  }

  /* ---------- Footer ---------- */
  const footer = q(".footer");
  if (footer) {
    gsap.from(qa(".hh, .footer > h1, .pp a, .left li, .pp2", footer), {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.07,
      ease: "power3.out",
      scrollTrigger: { trigger: footer, start: "top 80%" },
    });

    const bigName = q(".hi h1", footer);
    if (bigName) {
      bigName.classList.add("mask");
      gsap.from(split(bigName), {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.04,
        ease: "power4.out",
        scrollTrigger: { trigger: bigName, start: "top 92%" },
      });
    }
  }

  /* ---------- Custom cursor + magnetic buttons (mouse only) ---------- */
  if (finePointer) {
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.innerHTML = "<span>View</span>";
    document.body.appendChild(cursor);
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
    const cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });
    let shown = false;

    window.addEventListener(
      "pointermove",
      (e) => {
        cx(e.clientX);
        cy(e.clientY);
        if (!shown) {
          shown = true;
          gsap.to(cursor, { opacity: 1, duration: 0.3 });
        }
      },
      { passive: true }
    );

    document.documentElement.addEventListener("pointerleave", () => {
      shown = false;
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
    });

    document.addEventListener("pointerover", (e) => {
      const t = e.target;
      const onMedia = !!t.closest(".pcard__media");
      cursor.classList.toggle("is-view", onMedia);
      cursor.classList.toggle("is-link", !onMedia && !!t.closest("a, button, input, .opt"));
    });

    qa("[data-magnetic]").forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.3;
      const mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const my = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * strength);
        my((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener("pointerleave", () => {
        mx(0);
        my(0);
      });
    });
  }

  // Re-measure trigger positions once web fonts have loaded
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
