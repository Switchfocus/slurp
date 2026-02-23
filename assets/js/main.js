/* =============================================
   SLURP — Main JS (Light, Food-Forward)
   ============================================= */

(function () {
  'use strict';

  /* ── Lenis smooth scroll ── */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ── Custom cursor ── */
  const cursor = document.getElementById('cursor');
  if (cursor) {
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

  /* ── Nav: gains background after first scroll ── */
  const nav = document.querySelector('.nav');
  ScrollTrigger.create({
    start: 'top -80px',
    onEnter:     () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  /* ── Mobile nav ── */
  const burger  = document.querySelector('.nav-burger');
  const overlay = document.querySelector('.nav-overlay');
  if (burger && overlay) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      overlay.classList.toggle('open', open);
      if (open) { lenis.stop(); } else { lenis.start(); }
    });
    overlay.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        overlay.classList.remove('open');
        lenis.start();
      })
    );
  }

  /* ── Hero load animations ── */
  const heroWordmark = document.querySelector('.hero-wordmark');
  const heroRule     = document.querySelector('.hero-rule');
  const heroSub      = document.querySelector('.hero-sub');
  const heroLoc      = document.querySelector('.hero-loc');
  const heroCta      = document.querySelector('.hero-cta');
  const scrollCue    = document.querySelector('.scroll-cue');

  if (heroWordmark) {
    /* Rule starts scaled to 0 */
    gsap.set(heroRule, { scaleX: 0 });

    const tl = gsap.timeline({ delay: 0.25 });
    tl.from(heroWordmark, { y: 30, opacity: 0, duration: 1.1, ease: 'power2.out' })
      .to(heroRule,       { scaleX: 1, duration: 0.9, ease: 'power2.out' }, '-=0.5')
      .from([heroSub, heroLoc], { y: 14, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, '-=0.4')
      .from(heroCta,      { y: 10, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3');

    if (scrollCue) {
      tl.from(scrollCue, { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.2');
    }
  }

  /* ── Hero photo: imperceptible slow zoom (micro-interaction #3) ── */
  const heroPhotoImg = document.querySelector('.hero-photo img');
  if (heroPhotoImg) {
    gsap.to(heroPhotoImg, {
      scale: 1.06, duration: 10, ease: 'none',
    });
  }

  /* ── Hero photo: parallax (micro-interaction #8) ── */
  const heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto) {
    gsap.to(heroPhotoImg, {
      yPercent: -12, ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top', end: 'bottom top', scrub: true,
      },
    });
  }

  /* ── Scroll cue fades when hero leaves ── */
  if (scrollCue) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'bottom 80%',
      onEnter: () => gsap.to(scrollCue, { opacity: 0, duration: 0.4 }),
    });
  }

  /* ── Intro + Craft: rules + text fade in (micro-interaction #9) ── */
  document.querySelectorAll('.intro, .craft').forEach((el) => {
    const rules = el.querySelectorAll('.intro-rule');
    const text  = el.querySelector('.intro-text');
    if (rules.length && text) {
      gsap.from([rules[0], text, rules[1]], {
        y: 24, opacity: 0, duration: 1, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }
  });

  /* ── Dishes: clip-path reveal + parallax + hover (micro-interactions #4, #5, #8) ── */
  document.querySelectorAll('.dish').forEach((dish) => {
    const photoWrap = dish.querySelector('.dish-photo-wrap');
    const img       = dish.querySelector('.dish-photo-wrap img');
    const name      = dish.querySelector('.dish-name');
    const arrow     = dish.querySelector('.dish-arrow');

    /* Clip-path reveal on scroll */
    if (photoWrap) {
      gsap.from(photoWrap, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.2, ease: 'power3.inOut',
        scrollTrigger: { trigger: dish, start: 'top 75%' },
      });
    }

    /* Text fade-in */
    gsap.from(dish.querySelector('.dish-info'), {
      y: 20, opacity: 0, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: dish, start: 'top 75%' },
    });

    /* Parallax on image */
    if (img) {
      gsap.to(img, {
        yPercent: -8, ease: 'none',
        scrollTrigger: {
          trigger: dish,
          start: 'top bottom', end: 'bottom top', scrub: true,
        },
      });
    }

    /* Hover interactions */
    dish.addEventListener('mouseenter', () => {
      if (img)   gsap.to(img,   { scale: 1.04, duration: 0.7, ease: 'power2.out' });
      if (name)  gsap.to(name,  { x: 5,        duration: 0.4, ease: 'power2.out' });
      if (arrow) gsap.to(arrow, { opacity: 1, x: 0, duration: 0.3 });
    });

    dish.addEventListener('mouseleave', () => {
      if (img)   gsap.to(img,   { scale: 1, duration: 0.7, ease: 'power2.out' });
      if (name)  gsap.to(name,  { x: 0,     duration: 0.4, ease: 'power2.out' });
      if (arrow) gsap.to(arrow, { opacity: 0, x: -5, duration: 0.3 });
    });
  });

  /* ── Menu teaser: stagger in ── */
  const menuTeaser = document.querySelector('.menu-teaser');
  if (menuTeaser) {
    gsap.from(menuTeaser.querySelector('.menu-teaser-head'), {
      y: 20, opacity: 0, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: menuTeaser, start: 'top 80%' },
    });

    gsap.from(menuTeaser.querySelectorAll('.teaser-item'), {
      y: 16, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out',
      scrollTrigger: { trigger: menuTeaser, start: 'top 75%' },
    });

    gsap.from(menuTeaser.querySelector('.menu-teaser-cta'), {
      y: 12, opacity: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: menuTeaser, start: 'top 65%' },
    });
  }

  /* ── Find Us: fade in ── */
  const findUs = document.querySelector('.find-us');
  if (findUs) {
    gsap.from(findUs.querySelector('.find-us-city'), {
      y: 40, opacity: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: findUs, start: 'top 75%' },
    });

    gsap.from(findUs.querySelector('.find-us-details'), {
      y: 20, opacity: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: findUs, start: 'top 70%' },
    });

    gsap.from(findUs.querySelector('.map-wrap'), {
      y: 20, opacity: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: findUs, start: 'top 60%' },
    });
  }

})();
