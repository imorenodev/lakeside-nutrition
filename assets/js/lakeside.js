/* Lakeside Nutrition — re-skinned homepage interactions.
   Hero slider, mobile nav, sticky category scroll-spy, scroll reveal.
   Progressive enhancement: everything works (statically) without JS. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ---- Lucide icons ---- */
  function drawIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  ready(function () {
    drawIcons();
    // Lucide may load after DOMContentLoaded (async CDN). Retry briefly.
    var tries = 0;
    var iconTimer = setInterval(function () {
      tries++;
      if (window.lucide) { drawIcons(); clearInterval(iconTimer); }
      if (tries > 20) clearInterval(iconTimer);
    }, 200);

    setupMobileNav();
    setupHero();
    setupScrollSpy();
    setupReveal();
  });

  /* ---------- Mobile nav ---------- */
  function setupMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    function setIcon(open) {
      toggle.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '" class="icon"></i>';
      drawIcons();
    }
    function open() {
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      setIcon(true);
    }
    function close() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      setIcon(false);
    }
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('open')) close(); else open();
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) close();
    });
  }

  /* ---------- Hero slider ---------- */
  function setupHero() {
    var slides = [
      { eyebrow: 'Protein shakes · $11.95', title: 'Tastes like dessert,\nfuels like breakfast', text: '35–50g of clean protein blended into nostalgic, dessert-style shakes. Zero sugar guilt.', image: 'assets/images/ChunkyMonkeyShake.jpg', tone: '#1E90C6' },
      { eyebrow: 'Energy teas · $9.95', title: 'Liquid sunshine,\nzero crash', text: 'Electrolytes, B12, and 180mg of clean caffeine. Like sipping golden hour on the lake.', image: 'assets/images/PinkLightning.jpg', tone: '#F0468B' },
      { eyebrow: 'Bowls & oats · $10.95', title: 'Protein-packed\nmornings', text: 'Greek yogurt, cottage cheese, and overnight oat bowls layered with real fruit and crunch.', image: 'assets/images/StrawberryShortcakeYogurt.jpg', tone: '#7CC242' }
    ];
    var el = {
      eyebrow: document.querySelector('[data-hero="eyebrow"]'),
      title: document.querySelector('[data-hero="title"]'),
      text: document.querySelector('[data-hero="text"]'),
      image: document.querySelector('[data-hero="image"]'),
      blob: document.querySelector('[data-hero="blob"]'),
      dots: document.querySelectorAll('[data-hero="dots"] button')
    };
    if (!el.title || !el.dots.length) return;

    var i = 0;
    var timer = null;

    function show(n) {
      i = (n + slides.length) % slides.length;
      var s = slides[i];
      el.eyebrow.textContent = s.eyebrow;
      el.title.textContent = s.title;
      el.text.textContent = s.text;
      if (el.image) {
        el.image.style.opacity = reduceMotion ? '1' : '0';
        var pre = new Image();
        pre.onload = function () { el.image.src = s.image; el.image.style.opacity = '1'; };
        pre.src = s.image;
      }
      if (el.blob) el.blob.style.background = s.tone;
      el.dots.forEach(function (d, k) {
        d.classList.toggle('active', k === i);
        d.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
    }
    function start() {
      if (reduceMotion) return;
      stop();
      timer = setInterval(function () { show(i + 1); }, 5500);
    }
    function stop() { if (timer) clearInterval(timer); }

    if (el.image) el.image.style.transition = 'opacity .45s ease';
    el.dots.forEach(function (d, k) {
      d.setAttribute('role', 'tab');
      d.addEventListener('click', function () { show(k); start(); });
    });
    var hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
    }
    show(0);
    start();
  }

  /* ---------- Sticky category scroll-spy ---------- */
  function setupScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.menu-nav a'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var active = map[entry.target.id];
          if (active) {
            active.classList.add('active');
            // keep the active chip visible in the horizontal scroller
            active.scrollIntoView({ block: 'nearest', inline: 'center' });
          }
        }
      });
    }, { rootMargin: '-140px 0px -65% 0px', threshold: 0 });

    Object.keys(map).forEach(function (id) {
      obs.observe(document.getElementById(id));
    });
  }

  /* ---------- Scroll reveal (added via JS so no-JS shows everything) ---------- */
  function setupReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll('.product-card, .nutrition-item, .testimonial, .promo-card');
    if (!targets.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (t) {
      t.classList.add('reveal');
      obs.observe(t);
    });
  }
})();
