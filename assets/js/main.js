/* =============================================
   SLURP v2 — Snap-scroll + GSAP animations
   ============================================= */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     ELEMENTS
  ────────────────────────────────────────── */
  const slides      = Array.from(document.querySelectorAll('.slide'));
  const dots        = Array.from(document.querySelectorAll('.progress-dot'));
  const progressNav = document.querySelector('.progress-nav');
  const mainNav     = document.querySelector('.nav');
  const cursor      = document.getElementById('cursor');

  /* Track which slides have already played their entrance */
  const animated = new Set();


  /* ──────────────────────────────────────────
     CUSTOM CURSOR
  ────────────────────────────────────────── */
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    document.addEventListener('mousemove', (e) => {
      gsap.set(cursor, { x: e.clientX, y: e.clientY });
      cursor.classList.add('visible');
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button')) cursor.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button')) cursor.classList.remove('hover');
    });
  }


  /* ──────────────────────────────────────────
     PROGRESS DOT CLICK → scroll to slide
  ────────────────────────────────────────── */
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });


  /* ──────────────────────────────────────────
     KEYBOARD NAVIGATION (arrow keys)
  ────────────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const current = slides.findIndex((s) => {
      const r = s.getBoundingClientRect();
      return r.top > -window.innerHeight * 0.5 && r.top <= window.innerHeight * 0.5;
    });

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const next = slides[current + 1];
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const prev = slides[current - 1];
      if (prev) prev.scrollIntoView({ behavior: 'smooth' });
    }
  });


  /* ──────────────────────────────────────────
     INTERSECTION OBSERVER — slide tracking
  ────────────────────────────────────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.45) return;

        const slide = entry.target;
        const idx   = slides.indexOf(slide);
        const isDark = slide.classList.contains('slide--dark');

        /* ── Update progress dots ── */
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));

        /* ── Update nav + progress colours for dark slides ── */
        progressNav?.classList.toggle('on-dark', isDark);
        mainNav?.classList.toggle('on-dark', isDark);

        /* ── Nav scrolled state — transparent only on hero ── */
        if (idx === 0) {
          mainNav?.classList.remove('scrolled');
        } else {
          mainNav?.classList.add('scrolled');
        }

        /* ── Entrance animation — once per slide ── */
        if (!animated.has(slide)) {
          animated.add(slide);
          animateSlide(slide);
        }
      });
    },
    { threshold: 0.45 }
  );

  slides.forEach((s) => observer.observe(s));


  /* ──────────────────────────────────────────
     SLIDE ENTRANCE ANIMATIONS
  ────────────────────────────────────────── */
  function animateSlide(slide) {
    const id = slide.id;

    /* Hero fires on load — handled separately below */
    if (id === 'slide-hero') return;

    /* ── 02: Philosophy ── */
    if (id === 'slide-philosophy') {
      const header = slide.querySelector('.philosophy-header');
      const rules  = slide.querySelectorAll('.philosophy-rule');
      const quote  = slide.querySelector('.philosophy-quote');
      const sub    = slide.querySelector('.philosophy-sub');

      gsap.set(rules, { scaleX: 0, transformOrigin: 'left center' });

      gsap.timeline()
        .from(header, { y: 18, opacity: 0, duration: .7, ease: 'power2.out' })
        .to(rules[0], { scaleX: 1, duration: .9, ease: 'power3.out' }, '-=.35')
        .from(quote,  { y: 55, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=.55')
        .to(rules[1], { scaleX: 1, duration: .9, ease: 'power3.out' }, '-=.45')
        .from(sub,    { y: 18, opacity: 0, duration: .8, ease: 'power2.out' }, '-=.35');
      return;
    }

    /* ── 03 & 04: Dish split ── */
    if (id === 'slide-dish-1' || id === 'slide-dish-2') {
      const media  = slide.querySelector('.dish-media');
      const num    = slide.querySelector('.dish-num');
      const rule   = slide.querySelector('.dish-rule');
      const title  = slide.querySelector('.dish-title');
      const desc   = slide.querySelector('.dish-desc');
      const foot   = slide.querySelector('.dish-foot');
      const isInv  = slide.classList.contains('slide--dish-inv');
      const xOff   = isInv ? -30 : 30;

      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

      gsap.timeline()
        .from(media,  { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'power3.inOut' })
        .from(num,    { y: 14, opacity: 0, duration: .55 }, '-=.55')
        .to(rule,     { scaleX: 1, duration: .7, ease: 'power2.out' }, '-=.25')
        .from(title,  { x: xOff * .4, y: 22, opacity: 0, duration: 1, ease: 'power3.out' }, '-=.45')
        .from(desc,   { y: 14, opacity: 0, duration: .7, ease: 'power2.out' }, '-=.3')
        .from(foot,   { y: 12, opacity: 0, duration: .6, ease: 'power2.out' }, '-=.25');
      return;
    }

    /* ── 05: Beef Brisket full-bleed ── */
    if (id === 'slide-dish-3') {
      const bgImg = slide.querySelector('.dish-full-bg img');
      const info  = slide.querySelector('.dish-full-info');
      const num   = info.querySelector('.dish-num');
      const rule  = info.querySelector('.dish-rule');
      const title = info.querySelector('.dish-full-title');
      const desc  = info.querySelector('.dish-full-desc');
      const foot  = info.querySelector('.dish-foot');

      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

      gsap.timeline()
        .from(bgImg,  { scale: 1.07, duration: 1.6, ease: 'power2.out' })
        .from(num,    { y: 18, opacity: 0, duration: .55 }, '-=.7')
        .to(rule,     { scaleX: 1, duration: .7, ease: 'power2.out' }, '-=.25')
        .from(title,  { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out' }, '-=.4')
        .from(desc,   { y: 16, opacity: 0, duration: .8, ease: 'power2.out' }, '-=.35')
        .from(foot,   { y: 12, opacity: 0, duration: .6, ease: 'power2.out' }, '-=.25');
      return;
    }

    /* ── 06: Menu preview ── */
    if (id === 'slide-menu') {
      const heading = slide.querySelector('.menu-heading');
      const items   = slide.querySelectorAll('.menu-item');
      const cta     = slide.querySelector('.menu-cta');

      gsap.timeline()
        .from(heading, { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out' })
        .from(items,   { y: 22, opacity: 0, duration: .55, stagger: .07, ease: 'power2.out' }, '-=.5')
        .from(cta,     { y: 12, opacity: 0, duration: .6, ease: 'power2.out' }, '-=.2');
      return;
    }

    /* ── 07: Find Us ── */
    if (id === 'slide-find-us') {
      const city = slide.querySelector('.find-us-city');
      const grid = slide.querySelector('.find-us-grid');

      gsap.timeline()
        .from(city, { y: 70, opacity: 0, duration: 1.2, ease: 'power3.out' })
        .from(grid, { y: 30, opacity: 0, duration: .95, ease: 'power2.out' }, '-=.55');
    }
  }


  /* ──────────────────────────────────────────
     HERO LOAD ANIMATION
  ────────────────────────────────────────── */
  const heroSlide    = document.getElementById('slide-hero');
  const heroWordmark = document.querySelector('.hero-wordmark');

  if (heroSlide && heroWordmark) {
    const eyebrow  = document.querySelector('.hero-eyebrow');
    const rule     = document.querySelector('.hero-rule');
    const location = document.querySelector('.hero-location');
    const cta      = document.querySelector('.hero-cta');
    const scrollCue = document.querySelector('.scroll-cue');

    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

    gsap.timeline({ delay: 0.3 })
      .from(eyebrow,    { y: 10, opacity: 0, duration: .65 })
      .from(heroWordmark, { y: 70, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=.3')
      .to(rule,         { scaleX: 1, duration: .9, ease: 'power2.out' }, '-=.45')
      .from(location,   { y: 10, opacity: 0, duration: .6 }, '-=.3')
      .from(cta,        { y: 10, opacity: 0, duration: .6 }, '-=.25')
      .from(scrollCue,  { opacity: 0, duration: 1 }, '-=.3');

    /* Subtle background image ken-burns */
    const heroBgImg = document.querySelector('.hero-bg img');
    if (heroBgImg) {
      gsap.to(heroBgImg, { scale: 1.05, duration: 12, ease: 'none' });
    }

    /* Mark hero animated so observer skip it */
    animated.add(heroSlide);
  }


  /* ──────────────────────────────────────────
     MOBILE NAV OVERLAY
  ────────────────────────────────────────── */
  const burger  = document.querySelector('.nav-burger');
  const overlay = document.querySelector('.nav-overlay');

  if (burger && overlay) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      overlay.classList.toggle('open', open);
      /* Freeze scroll while overlay is open */
      document.documentElement.style.overflowY = open ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('open');
        document.documentElement.style.overflowY = '';
      });
    });
  }

})();
