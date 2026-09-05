/* ============================================================
   MAIN.JS — Premium Interactive Engine v2
   Particle System · Scroll-Linked Parallax · 3D Tilt · etc.
   ============================================================ */

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  // 1. PARTICLE SYSTEM (Canvas)
  // ──────────────────────────────────────────────
  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: -1000, y: -1000 };
      this.resize();
      this.init();
      this.bindEvents();
      this.animate();
    }

    resize() {
      this.width = this.canvas.width = this.canvas.offsetWidth;
      this.height = this.canvas.height = this.canvas.offsetHeight;
    }

    init() {
      const count = Math.min(Math.floor((this.width * this.height) / 12000), 120);
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() > 0.5 ? 260 : 220,
        });
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
        this.init();
      });
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
      });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;

        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 2;
          p.y += (dy / dist) * force * 2;
        }

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
        this.ctx.fill();

        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `hsla(260, 60%, 60%, ${0.12 * (1 - d / 100)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  // ──────────────────────────────────────────────
  // 2. 3D TILT EFFECT
  // ──────────────────────────────────────────────
  class TiltEffect {
    constructor(elements) {
      this.elements = elements;
      this.isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (!this.isMobile) this.bind();
    }

    bind() {
      this.elements.forEach((el) => {
        el.addEventListener('mousemove', (e) => this.onMove(e, el));
        el.addEventListener('mouseleave', (e) => this.onLeave(e, el));
      });
    }

    onMove(e, el) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.transition = 'transform 0.1s ease-out';

      const glare = el.querySelector('.card-glare');
      if (glare) {
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
        glare.style.background = `linear-gradient(${angle + 180}deg, rgba(167,139,250,0.12) 0%, transparent 60%)`;
        glare.style.opacity = '1';
      }
    }

    onLeave(e, el) {
      el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      const glare = el.querySelector('.card-glare');
      if (glare) glare.style.opacity = '0';
    }
  }

  // ──────────────────────────────────────────────
  // 3. SCROLL-LINKED PARALLAX ENGINE (Enhanced)
  // ──────────────────────────────────────────────
  class ParallaxEngine {
    constructor() {
      this.isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (this.isMobile) return;

      this.layers = document.querySelectorAll('[data-parallax]');
      this.scrollElements = document.querySelectorAll('[data-scroll-speed]');
      this.scrollRotators = document.querySelectorAll('[data-scroll-rotate]');
      this.scrollScalers = document.querySelectorAll('[data-scroll-scale]');
      this.scrollOpacity = document.querySelectorAll('[data-scroll-opacity]');
      this.sectionDecos = document.querySelectorAll('.section-deco');
      this.heroContent = document.querySelector('.hero-content');
      this.ticker = document.querySelector('.ticker-track');
      this.waveSvgs = document.querySelectorAll('.wave-divider svg');

      this.scrollY = 0;
      this.ticking = false;

      this.bind();
      this.update();
    }

    bind() {
      window.addEventListener('scroll', () => {
        this.scrollY = window.pageYOffset;
        if (!this.ticking) {
          requestAnimationFrame(() => {
            this.update();
            this.ticking = false;
          });
          this.ticking = true;
        }
      });
    }

    update() {
      const scrollY = this.scrollY;
      const vh = window.innerHeight;

      // Basic parallax layers
      this.layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax) || 0.1;
        const offset = scrollY * speed;
        layer.style.transform = `translate3d(0, ${offset}px, 0)`;
      });

      // Scroll speed elements (translate Y based on their position)
      this.scrollElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < vh && rect.bottom > 0;
        if (inView) {
          const speed = parseFloat(el.dataset.scrollSpeed) || 0.1;
          const center = rect.top + rect.height / 2 - vh / 2;
          const offset = center * speed;
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      });

      // Scroll rotate elements
      this.scrollRotators.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < vh && rect.bottom > 0;
        if (inView) {
          const speed = parseFloat(el.dataset.scrollRotate) || 0.1;
          const rotation = scrollY * speed;
          el.style.transform = `rotate(${rotation}deg)`;
        }
      });

      // Scroll scale elements
      this.scrollScalers.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < vh && rect.bottom > 0;
        if (inView) {
          const progress = 1 - (rect.top / vh);
          const clampedProgress = Math.max(0, Math.min(1, progress));
          const baseScale = parseFloat(el.dataset.scrollScale) || 0.8;
          const scale = baseScale + (1 - baseScale) * clampedProgress;
          el.style.transform = `scale(${scale})`;
        }
      });

      // Scroll opacity
      this.scrollOpacity.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < vh && rect.bottom > 0;
        if (inView) {
          const progress = 1 - (rect.top / vh);
          const clamped = Math.max(0, Math.min(1, progress));
          el.style.opacity = clamped;
        }
      });

      // Section decorative elements — each section's decos move relative to section scroll
      this.sectionDecos.forEach((deco) => {
        const section = deco.closest('.section') || deco.closest('.hero');
        if (!section) return;
        const sRect = section.getBoundingClientRect();
        const inView = sRect.top < vh && sRect.bottom > 0;
        if (inView) {
          const sectionProgress = (vh - sRect.top) / (vh + sRect.height);
          const speed = parseFloat(deco.dataset.decoSpeed) || 0.5;
          const direction = deco.dataset.decoDir || 'up';
          const maxMove = 80;
          const move = (sectionProgress - 0.5) * maxMove * speed;

          let transform = '';
          if (direction === 'up') transform = `translate3d(0, ${-move}px, 0)`;
          else if (direction === 'down') transform = `translate3d(0, ${move}px, 0)`;
          else if (direction === 'left') transform = `translate3d(${-move}px, 0, 0)`;
          else if (direction === 'right') transform = `translate3d(${move}px, 0, 0)`;

          const baseRotate = parseFloat(deco.dataset.decoRotate) || 0;
          if (baseRotate) {
            transform += ` rotate(${baseRotate + sectionProgress * 60}deg)`;
          }

          deco.style.transform = transform;
        }
      });

      // Hero content parallax on scroll (fades out and moves up)
      if (this.heroContent) {
        const heroProgress = Math.min(scrollY / vh, 1);
        this.heroContent.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
        this.heroContent.style.opacity = 1 - heroProgress * 0.8;
      }

      // Animate wave dividers
      this.waveSvgs.forEach((svg) => {
        const rect = svg.getBoundingClientRect();
        const inView = rect.top < vh + 100 && rect.bottom > -100;
        if (inView) {
          const progress = (vh - rect.top) / (vh + rect.height);
          const shift = progress * 30;
          svg.style.transform = `translateX(${shift}px)`;
        }
      });
    }
  }

  // ──────────────────────────────────────────────
  // 4. CUSTOM CURSOR
  // ──────────────────────────────────────────────
  class CustomCursor {
    constructor() {
      this.isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (this.isMobile) return;

      this.cursor = document.getElementById('customCursor');
      this.cursorDot = document.getElementById('customCursorDot');
      if (!this.cursor || !this.cursorDot) return;

      this.pos = { x: 0, y: 0 };
      this.target = { x: 0, y: 0 };
      this.visible = false;

      this.bind();
      this.animate();
    }

    bind() {
      document.addEventListener('mousemove', (e) => {
        this.target.x = e.clientX;
        this.target.y = e.clientY;
        if (!this.visible) {
          this.visible = true;
          this.cursor.style.opacity = '1';
          this.cursorDot.style.opacity = '1';
        }
      });

      document.addEventListener('mouseleave', () => {
        this.visible = false;
        this.cursor.style.opacity = '0';
        this.cursorDot.style.opacity = '0';
      });

      const hovers = document.querySelectorAll('a, button, .portfolio-card, .about-card, .tilt-card, input, textarea, .skill-badge');
      hovers.forEach((el) => {
        el.addEventListener('mouseenter', () => this.cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => this.cursor.classList.remove('cursor-hover'));
      });
    }

    animate() {
      this.pos.x += (this.target.x - this.pos.x) * 0.12;
      this.pos.y += (this.target.y - this.pos.y) * 0.12;

      this.cursor.style.transform = `translate(${this.pos.x - 16}px, ${this.pos.y - 16}px)`;
      this.cursorDot.style.transform = `translate(${this.target.x - 3}px, ${this.target.y - 3}px)`;

      requestAnimationFrame(() => this.animate());
    }
  }

  // ──────────────────────────────────────────────
  // 5. SCROLL REVEAL with Stagger
  // ──────────────────────────────────────────────
  class ScrollReveal {
    constructor() {
      this.elements = document.querySelectorAll('.reveal');
      if (!this.elements.length) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = entry.target.dataset.delay || 0;
              setTimeout(() => {
                entry.target.classList.add('revealed');
              }, delay);
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      this.elements.forEach((el) => this.observer.observe(el));
    }
  }

  // ──────────────────────────────────────────────
  // 6. COUNTER ANIMATION
  // ──────────────────────────────────────────────
  class CounterAnimation {
    constructor() {
      this.counters = document.querySelectorAll('[data-count]');
      if (!this.counters.length) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animateCounter(entry.target);
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      this.counters.forEach((el) => this.observer.observe(el));
    }

    animateCounter(el) {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    }
  }

  // ──────────────────────────────────────────────
  // 7. MAGNETIC BUTTONS
  // ──────────────────────────────────────────────
  class MagneticButtons {
    constructor() {
      this.buttons = document.querySelectorAll('.magnetic');
      this.isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (!this.isMobile) this.bind();
    }

    bind() {
      this.buttons.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0, 0)';
          btn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        btn.addEventListener('mouseenter', () => {
          btn.style.transition = 'transform 0.1s ease-out';
        });
      });
    }
  }

  // ──────────────────────────────────────────────
  // 8. TYPING EFFECT
  // ──────────────────────────────────────────────
  class TypingEffect {
    constructor(el) {
      if (!el) return;
      this.el = el;
      this.words = ['web_developer', 'creative_coder', 'problem_solver', 'tech_enthusiast'];
      this.wordIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.type();
    }

    type() {
      const current = this.words[this.wordIndex];
      if (this.isDeleting) {
        this.charIndex--;
      } else {
        this.charIndex++;
      }

      this.el.textContent = current.substring(0, this.charIndex);

      let speed = this.isDeleting ? 40 : 80;

      if (!this.isDeleting && this.charIndex === current.length) {
        speed = 2000;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        speed = 500;
      }

      setTimeout(() => this.type(), speed);
    }
  }

  // ──────────────────────────────────────────────
  // 9. SCROLL PROGRESS BAR
  // ──────────────────────────────────────────────
  class ScrollProgress {
    constructor() {
      this.bar = document.getElementById('scrollProgress');
      if (!this.bar) return;
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            this.bar.style.width = `${progress}%`;
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }

  // ──────────────────────────────────────────────
  // 10. HEADER SCROLL BEHAVIOR
  // ──────────────────────────────────────────────
  class HeaderScroll {
    constructor() {
      this.header = document.getElementById('mainHeader');
      if (!this.header) return;
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 80) {
          this.header.classList.add('header-scrolled');
        } else {
          this.header.classList.remove('header-scrolled');
        }
      });
    }
  }

  // ──────────────────────────────────────────────
  // 11. INFINITE TICKER (Marquee)
  // ──────────────────────────────────────────────
  class InfiniteTicker {
    constructor() {
      const track = document.querySelector('.ticker-track');
      if (!track) return;
      // Duplicate content for seamless loop
      const content = track.innerHTML;
      track.innerHTML = content + content;
    }
  }

  // ──────────────────────────────────────────────
  // 12. SMOOTH SCROLL
  // ──────────────────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) mobileMenu.classList.remove('open');
      });
    });
  }

  // ──────────────────────────────────────────────
  // 13. THEME TOGGLE
  // ──────────────────────────────────────────────
  function initThemeToggle() {
    function toggleTheme() {
      const body = document.body;
      const t = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', t);
      localStorage.setItem('theme', t);
    }

    const btn = document.getElementById('themeToggle');
    const btnMobile = document.getElementById('themeToggleMobile');
    if (btn) btn.addEventListener('click', toggleTheme);
    if (btnMobile) btnMobile.addEventListener('click', toggleTheme);

    const saved = localStorage.getItem('theme');
    if (saved) document.body.setAttribute('data-theme', saved);
  }

  // ──────────────────────────────────────────────
  // 14. CONTACT FORM
  // ──────────────────────────────────────────────
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="btn-loading"></span> Sending...';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          btn.innerHTML = '✨ Message Sent!';
          btn.classList.add('btn-success');
          form.reset();
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
            btn.disabled = false;
          }, 3000);
        } else {
          throw new Error('Failed');
        }
      } catch {
        btn.innerHTML = '❌ Failed. Try again.';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const menu = document.getElementById('mobileMenu');
    if (btn && menu) {
      btn.addEventListener('click', () => menu.classList.toggle('open'));
    }
  }

  // ──────────────────────────────────────────────
  // INITIALIZATION
  // ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) new ParticleSystem(canvas);

    const tiltCards = document.querySelectorAll('.tilt-card');
    if (tiltCards.length) new TiltEffect(tiltCards);

    new ParallaxEngine();
    new CustomCursor();
    new ScrollReveal();
    new CounterAnimation();
    new MagneticButtons();
    new InfiniteTicker();

    const typingEl = document.getElementById('typingText');
    new TypingEffect(typingEl);

    new ScrollProgress();
    new HeaderScroll();

    initSmoothScroll();
    initThemeToggle();
    initContactForm();
    initMobileMenu();
    setYear();
  });
})();
