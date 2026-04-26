/* ═══════════════════════════════════════════════════════
   Priyam Thakar — Portfolio JS
   Particles · Custom cursor · Scroll reveal · Counters
   ═══════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ── Loader ─────────────────────────────────────── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1200);
  });
  document.body.style.overflow = 'hidden';

  /* ── Year ────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Nav scroll ─────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    lastScroll = y;
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── Custom Cursor ──────────────────────────────── */
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');

  if (cursor && cursorDot && window.matchMedia('(hover: hover)').matches) {
    let cx = -100, cy = -100;
    let dx = -100, dy = -100;

    document.addEventListener('mousemove', e => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.classList.add('visible');
      cursorDot.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
      cursorDot.classList.remove('visible');
    });

    // smooth follow
    function updateCursor() {
      dx += (cx - dx) * 0.12;
      dy += (cy - dy) * 0.12;
      cursor.style.left = dx + 'px';
      cursor.style.top = dy + 'px';
      cursorDot.style.left = cx + 'px';
      cursorDot.style.top = cy + 'px';
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // hover states
    const hoverTargets = 'a, button, .project-card, .research-card, .social, .email-cta, .btn';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ── Particles ──────────────────────────────────── */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];
    const PARTICLE_COUNT = 60;
    const CONNECTION_DIST = 140;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 92, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 92, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ── Scroll Reveal ──────────────────────────────── */
  // Tag elements for reveal
  const revealSelectors = [
    '.section-head',
    '.about-col',
    '.about-card',
    '.research-card',
    '.project-card',
    '.now-item',
    '.contact-inner',
  ];

  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Stat Counter ───────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1600;
          const start = performance.now();

          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out expo
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(el => counterObserver.observe(el));

  /* ── Tilt Effect (research cards) ───────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * -4;
        const ry = ((x - cx) / cx) * 4;
        card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── Smooth anchor scroll ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Active nav link highlight ──────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.25, rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72}px 0px -40% 0px` }
  );

  sections.forEach(s => sectionObserver.observe(s));

})();
