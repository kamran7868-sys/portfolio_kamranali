/* ============================================================
   Kamran Ali — Portfolio interactions
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Page load entrance loader ---------- */
  const loader = document.getElementById('loader');
  function hideLoader() {
    document.body.classList.add('loaded');
    if (loader) setTimeout(() => loader.remove(), 700);
  }
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 1600); /* fail-safe */

  /* ---------- Theme toggle (dark / light) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = savedTheme || (prefersDark ? 'dark' : 'light');

  themeToggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
  });

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Header shadow + back-to-top visibility ---------- */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    backToTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Scrollspy (active nav link) ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) =>
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)
          );
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => spy.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Typewriter effect ---------- */
  const typedEl = document.getElementById('typed');
  const roles = [
    'Full Stack Web Developer',
    'ERP Software Developer',
    'WordPress Developer',
    'SEO Specialist',
    'AI-Powered Web Developer'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = roles[roleIndex];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 70);
    } else {
      typedEl.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, 36);
    }
  }
  type();

  /* ---------- Project filtering ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- Testimonials carousel ---------- */
  const tScroller = document.getElementById('tTrack');
  const tPrev = document.getElementById('tPrev');
  const tNext = document.getElementById('tNext');
  const tDotsEl = document.getElementById('tDots');

  let tIndex = 0;
  let tPerView = 2;
  let tAutoTimer = null;

  function tCardStep() {
    const first = tScroller.firstElementChild;
    const gap = parseFloat(getComputedStyle(tScroller).columnGap) || 24;
    return first.getBoundingClientRect().width + gap;
  }

  function tMaxIndex() {
    return Math.max(0, tScroller.children.length - tPerView);
  }

  function tGo(i) {
    tIndex = Math.min(Math.max(0, i), tMaxIndex());
    tScroller.scrollTo({ left: tIndex * tCardStep(), behavior: 'smooth' });
  }

  function tUpdate() {
    const max = tMaxIndex();
    tPrev.disabled = tIndex <= 0;
    tNext.disabled = tIndex >= max;
    tDotsEl.querySelectorAll('.t-dot').forEach((d, i) => {
      d.classList.toggle('active', i === tIndex);
    });
  }

  function tBuildDots() {
    tDotsEl.innerHTML = '';
    for (let i = 0; i <= tMaxIndex(); i++) {
      const dot = document.createElement('button');
      dot.className = 't-dot' + (i === tIndex ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => tGo(i));
      tDotsEl.appendChild(dot);
    }
    tUpdate();
  }

  function tStartAuto() {
    if (tAutoTimer || prefersReducedMotion) return;
    tAutoTimer = setInterval(() => tGo(tIndex >= tMaxIndex() ? 0 : tIndex + 1), 6000);
  }
  function tStopAuto() { clearInterval(tAutoTimer); tAutoTimer = null; }

  tPrev.addEventListener('click', () => tGo(tIndex - 1));
  tNext.addEventListener('click', () => tGo(tIndex + 1));

  let tScrolling = false;
  tScroller.addEventListener(
    'scroll',
    () => {
      if (tScrolling) return;
      tScrolling = true;
      requestAnimationFrame(() => {
        tIndex = Math.round(tScroller.scrollLeft / tCardStep());
        tUpdate();
        tScrolling = false;
      });
    },
    { passive: true }
  );

  function tResize() {
    tPerView = window.innerWidth <= 640 ? 1 : 2;
    tIndex = Math.min(tIndex, tMaxIndex());
    tBuildDots();
    tScroller.scrollTo({ left: tIndex * tCardStep() });
  }
  window.addEventListener('resize', tResize);

  [tScroller, tPrev, tNext, tDotsEl].forEach((el) => {
    el.addEventListener('mouseenter', tStopAuto);
    el.addEventListener('mouseleave', tStartAuto);
  });

  tBuildDots();
  tStartAuto();

  /* ---------- Custom cursor (desktop only) ---------- */
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!prefersReducedMotion && hasFinePointer) initCursor();

  function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      document.documentElement.classList.add('has-cursor');
      dot.style.transform = 'translate(' + (mx - 4) + 'px,' + (my - 4) + 'px)';
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + (rx - 19) + 'px,' + (ry - 19) + 'px)';
      requestAnimationFrame(loop);
    })();

    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .filter-btn, .t-dot');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => { ring.classList.add('grow'); dot.classList.add('grow'); });
      el.addEventListener('mouseleave', () => { ring.classList.remove('grow'); dot.classList.remove('grow'); });
    });
  }

  /* ---------- Contact form (floating labels + validation) ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  const fields = [
    { input: form.name, msg: 'Please enter your name.' },
    { input: form.email, msg: 'Please enter a valid email address.' },
    { input: form.subject, msg: 'Please add a subject.' },
    { input: form.message, msg: 'Please write a message.' }
  ];

  fields.forEach((f) => {
    f.wrap = f.input.closest('.field');
    const msg = document.createElement('span');
    msg.className = 'field-msg';
    f.wrap.appendChild(msg);
  });

  function validate() {
    let ok = true;
    fields.forEach((f) => {
      const value = f.input.value.trim();
      let err = false;
      if (!value) err = true;
      else if (f.input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) err = true;
      f.wrap.classList.toggle('invalid', err);
      if (err) ok = false;
    });
    return ok;
  }

  fields.forEach((f) => {
    f.input.addEventListener('input', () => {
      if (f.wrap.classList.contains('invalid')) validate();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstInvalid = form.querySelector('.invalid input, .invalid textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const body =
      'Name: ' + form.name.value.trim() +
      '\nEmail: ' + form.email.value.trim() +
      '\n\n' + form.message.value.trim();

    window.location.href =
      'mailto:kamranali533017@gmail.com' +
      '?subject=' + encodeURIComponent(form.subject.value.trim()) +
      '&body=' + encodeURIComponent(body);

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.classList.add('sent');
    submitBtn.textContent = 'Opening your email app…';
    if (note) {
      note.textContent = 'Opening your email app — check your email client to finish sending.';
      note.classList.add('success');
    }
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();