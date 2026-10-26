/* =========================================================
   Dicky Afriza — portfolio interactions
   · split-reveal hero               · scroll-filled text
   · custom cursor + magnetic btns   · work index with hover peek
   · throwable toolbox (Matter.js)   · contact form (Formspree)
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* ---------- tiny utilities ---------- */
  $('#year').textContent = new Date().getFullYear();

  const clockEl = $('#clock');
  const tickClock = () => {
    clockEl.textContent = new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit'
    });
  };
  tickClock();
  setInterval(tickClock, 15000);

  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('ready')));

  /* ---------- mobile menu ---------- */
  const menuBtn = $('#menuBtn');
  const mobileMenu = $('#mobileMenu');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- reveal on scroll ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('in'), delay);
      revealIO.unobserve(el);
      if (el.classList.contains('num-card')) countUp($('[data-count]', el));
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  $$('.rv, .lines').forEach(el => revealIO.observe(el));

  function countUp(el) {
    if (!el) return;
    const target = parseInt(el.dataset.count, 10);
    if (reduceMotion) { el.textContent = target; return; }
    const dur = 1400, t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- scroll-filled text ---------- */
  function splitWords(node) {
    Array.from(node.childNodes).forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) frag.appendChild(document.createTextNode(t));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.appendChild(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) splitWords(n);
    });
  }
  const fills = $$('.fill').map(el => { splitWords(el); return { el, words: $$('.w', el), lit: 0 }; });
  function updateFill() {
    fills.forEach(f => {
      const n = f.words.length;
      let lit = n;
      if (!reduceMotion) {
        const r = f.el.getBoundingClientRect(), vh = innerHeight;
        lit = Math.round(clamp((vh * 0.85 - r.top) / (r.height + vh * 0.25), 0, 1) * n);
      }
      if (lit === f.lit) return;
      f.words.forEach((w, i) => w.classList.toggle('on', i < lit));
      f.lit = lit;
    });
  }

  /* ---------- active section → header colour, counter, nav, progress ---------- */
  const sections = $$('[data-section]');
  const header = $('#siteHeader');
  const counterNum = $('#counterNum');
  const counterLabel = $('#counterLabel');
  const themeMeta = $('meta[name="theme-color"]');
  const navLinks = $$('[data-nav]');
  const progress = $('#progress');
  let activeSection = null;

  function setActive(sec) {
    activeSection = sec;
    header.style.color = sec.dataset.ink;
    themeMeta.setAttribute('content', sec.dataset.bg);
    counterNum.textContent = String(sections.indexOf(sec) + 1).padStart(2, '0');
    counterLabel.textContent = sec.dataset.label;
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === sec.id));
  }

  let ticking = false;
  function onScroll() {
    ticking = false;
    let act = sections[0];
    sections.forEach(s => { if (s.getBoundingClientRect().top <= 70) act = s; });
    if (act !== activeSection) setActive(act);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;
    updateFill();
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- hero: cursor reveals the second layer ---------- */
  const hero = $('#hello');
  const heroAlt = $('#heroAlt');
  if (hero && heroAlt && !reduceMotion) {
    const BASE_R = clamp(innerWidth * 0.14, 110, 190);
    let x = innerWidth * 0.62, y = innerHeight * 0.5, tx = x, ty = y, r = 0, tr = 0, down = false;
    const auto = !finePointer;

    addEventListener('pointermove', (e) => {
      if (auto || scrollY > innerHeight * 0.9) return;
      const b = hero.getBoundingClientRect();
      tx = e.clientX - b.left; ty = e.clientY - b.top;
      tr = down ? BASE_R * 1.9 : BASE_R;
    }, { passive: true });
    addEventListener('pointerdown', () => { down = true; if (!auto) tr = BASE_R * 1.9; });
    addEventListener('pointerup', () => { down = false; if (!auto && tr > 0) tr = BASE_R; });
    document.addEventListener('mouseleave', () => { tr = 0; });

    const loop = (t) => {
      if (scrollY < innerHeight * 1.05) {
        if (auto) {
          const W = hero.clientWidth, H = hero.clientHeight;
          tx = W * (0.5 + 0.28 * Math.sin(t * 0.0007));
          ty = H * (0.5 + 0.2 * Math.sin(t * 0.001 + 1));
          tr = Math.min(W, H) * (0.2 + 0.04 * Math.sin(t * 0.0013));
        }
        x += (tx - x) * 0.14; y += (ty - y) * 0.14; r += (tr - r) * 0.12;
        heroAlt.style.setProperty('--hx', x.toFixed(1) + 'px');
        heroAlt.style.setProperty('--hy', y.toFixed(1) + 'px');
        heroAlt.style.setProperty('--hr', Math.max(r, 0).toFixed(1) + 'px');
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------- custom cursor + magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    document.documentElement.classList.add('has-cursor');
    const cur = $('#cursor'), label = $('.cursor-label', cur);
    let cx = -100, cy = -100, mx = -100, my = -100;
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; cur.classList.add('on'); }, { passive: true });
    document.addEventListener('mouseleave', () => cur.classList.remove('on'));
    const curLoop = () => {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(curLoop);
    };
    curLoop();

    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor], a, button, input, textarea, label');
      cur.classList.remove('hover', 'big');
      if (!t) return;
      if (t.dataset.cursor) { label.textContent = t.dataset.cursor; cur.classList.add('big'); }
      else cur.classList.add('hover');
    });

    $$('[data-magnet]').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const b = el.getBoundingClientRect();
        const dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
        el.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- marquee: duplicate content for a seamless loop ---------- */
  $$('.marquee-track').forEach(t => { t.innerHTML += t.innerHTML; });

  /* ---------- work index: accordion + hover peek ---------- */
  const accItems = $$('.acc-item');
  const peek = $('#peek'), peekImg = $('img', peek);
  let px = 0, py = 0, ppx = 0, ppy = 0, peekOn = false;

  accItems.forEach(item => {
    const btn = $('.acc-btn', item);
    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      accItems.forEach(i => {
        i.classList.remove('open');
        $('.acc-btn', i).setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
      peek.classList.remove('on'); peekOn = false;
    });
    if (finePointer) {
      btn.addEventListener('pointerenter', () => {
        if (item.classList.contains('open')) return;
        peekImg.src = $('img', item).getAttribute('src');
        peek.classList.add('on'); peekOn = true;
      });
      btn.addEventListener('pointerleave', () => { peek.classList.remove('on'); peekOn = false; });
    }
  });
  if (finePointer && !reduceMotion) {
    addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
    let sx = 0, sy = 0;
    const peekLoop = () => {
      sx += (px - sx) * 0.14; sy += (py - sy) * 0.14;
      if (peekOn) {
        const tilt = clamp((px - sx) * 0.08, -12, 12);
        peek.style.transform = `translate3d(${sx + 28}px, ${sy - peek.offsetHeight / 2}px, 0) rotate(${tilt}deg)`;
      }
      requestAnimationFrame(peekLoop);
    };
    peekLoop();
  }

  /* =======================================================
     TOOLBOX — throwable pills (Matter.js)
     ======================================================= */
  function initToolbox() {
    const stage = $('#toyStage');
    if (!stage || !window.Matter) return;
    const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter;

    const pills = $$('.pill', stage);
    let engine, mc, bodies = [], visible = false, zero = false, category = 'all';
    let lastW = 0;

    function build() {
      const w = stage.clientWidth, h = stage.clientHeight;
      lastW = w;
      if (mc && engine) Composite.clear(engine.world, false);

      stage.classList.remove('no-physics');
      pills.forEach(el => { el.style.display = ''; });   // make sure every pill can be measured
      engine = Engine.create({ gravity: { x: 0, y: zero ? 0 : 1 } });

      const t = 80;
      Composite.add(engine.world, [
        Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, { isStatic: true }),
        Bodies.rectangle(w / 2, -h * 2, w + t * 2, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, h / 2 - h, t, h * 4, { isStatic: true }),
        Bodies.rectangle(w + t / 2, h / 2 - h, t, h * 4, { isStatic: true })
      ]);

      bodies = pills.map(el => {
        const pw = el.offsetWidth, ph = el.offsetHeight;
        const b = Bodies.rectangle(
          rand(pw, Math.max(pw + 1, w - pw)), rand(-h * 0.9, -30), pw, ph,
          { chamfer: { radius: ph / 2 }, restitution: 0.55, friction: 0.08, frictionAir: 0.012, angle: rand(-1, 1) }
        );
        b.el = el; b.pw = pw; b.ph = ph; b.cat = el.dataset.cat; b.inWorld = false;
        return b;
      });
      applyFilter(category, true);

      const mouse = Mouse.create(stage);
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
      mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
      Composite.add(engine.world, mc);
      sync();
    }

    function applyFilter(cat, initial) {
      category = cat;
      const w = stage.clientWidth;
      bodies.forEach(b => {
        const show = cat === 'all' || b.cat === cat;
        if (show && !b.inWorld) {
          if (!initial) {
            Body.setPosition(b, { x: rand(b.pw, Math.max(b.pw + 1, w - b.pw)), y: -40 });
            Body.setVelocity(b, { x: 0, y: 0 });
          }
          Composite.add(engine.world, b);
          b.el.style.display = '';
        } else if (!show && b.inWorld) {
          Composite.remove(engine.world, b);
          b.el.style.display = 'none';
        } else if (!show) {
          b.el.style.display = 'none';
        }
        b.inWorld = show;
      });
    }

    function sync() {
      bodies.forEach(b => {
        if (!b.inWorld) return;
        b.el.style.transform =
          `translate(${(b.position.x - b.pw / 2).toFixed(1)}px, ${(b.position.y - b.ph / 2).toFixed(1)}px) rotate(${b.angle.toFixed(3)}rad)`;
      });
    }

    function loop() {
      if (visible && engine) { Engine.update(engine, 1000 / 60); sync(); }
      requestAnimationFrame(loop);
    }

    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0.15 }).observe(stage);

    // controls
    $$('.chip[data-cat]').forEach(chip => chip.addEventListener('click', () => {
      $$('.chip[data-cat]').forEach(c => c.classList.toggle('is-on', c === chip));
      applyFilter(chip.dataset.cat);
    }));
    $('#shakeBtn').addEventListener('click', () => {
      bodies.forEach(b => {
        if (!b.inWorld) return;
        Body.setVelocity(b, { x: rand(-16, 16), y: rand(-22, -6) });
        Body.setAngularVelocity(b, rand(-0.25, 0.25));
      });
    });
    const zeroBtn = $('#zeroBtn');
    zeroBtn.addEventListener('click', () => {
      zero = !zero;
      zeroBtn.setAttribute('aria-pressed', String(zero));
      engine.gravity.y = zero ? 0 : 1;
      if (zero) bodies.forEach(b => b.inWorld && Body.setVelocity(b, { x: rand(-3, 3), y: rand(-3, 3) }));
    });

    let rt;
    addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { if (stage.clientWidth !== lastW) build(); }, 250);
    });

    build();
    loop();
  }
  // Matter is loaded with `defer` before this file, but guard anyway.
  if (window.Matter) initToolbox();
  else addEventListener('load', initToolbox);

  /* ---------- contact form: submit without leaving the page ---------- */
  const form = $('#contactForm');
  const status = $('#formStatus');
  const sendBtn = $('#sendBtn');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    sendBtn.disabled = true;
    status.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('bad response');
      form.reset();
      status.textContent = 'Thanks! I’ll get back to you soon.';
    } catch (err) {
      status.textContent = 'Something went wrong — please try again.';
    } finally {
      sendBtn.disabled = false;
    }
  });

  /* ---------- profile & quick contact modal ---------- */
  const profileModal = $('#profileModal');
  const profileBackdrop = $('#profileBackdrop');
  const closeProfileModal = $('#closeProfileModal');
  const openModalTriggers = $$('[data-open-profile], #openProfileModal, #openMobileProfile');
  const copyEmailBtn = $('#copyEmailBtn');
  const modalChatBtn = $('#modalChatBtn');
  const modalContactBtn = $('#modalContactBtn');

  const setProfileModal = (open) => {
    if (!profileModal) return;
    profileModal.classList.toggle('open', open);
    profileModal.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('modal-open', open);
  };

  openModalTriggers.forEach(btn => {
    btn?.addEventListener('click', (e) => {
      // If trigger is inside an anchor link, prevent normal jump only if clicked on avatar-ring
      if (btn.classList.contains('avatar-ring')) {
        e.preventDefault();
        e.stopPropagation();
      }
      setProfileModal(true);
    });
    // Keyboard accessibility for role="button"
    btn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setProfileModal(true);
      }
    });
  });

  closeProfileModal?.addEventListener('click', () => setProfileModal(false));
  profileBackdrop?.addEventListener('click', () => setProfileModal(false));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && profileModal?.classList.contains('open')) setProfileModal(false);
  });

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const email = copyEmailBtn.dataset.email || 'afrizadicky6@gmail.com';
      let copied = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
          copied = true;
        }
      } catch (err) {}
      if (!copied) {
        try {
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copied = true;
        } catch (e2) {}
      }
      const originalText = copyEmailBtn.textContent;
      copyEmailBtn.textContent = 'Copied! ✓';
      copyEmailBtn.classList.add('copied');
      setTimeout(() => {
        copyEmailBtn.textContent = originalText;
        copyEmailBtn.classList.remove('copied');
      }, 2200);
    });
  }

  if (modalChatBtn) {
    modalChatBtn.addEventListener('click', () => {
      setProfileModal(false);
      const cbFab = $('#cbFab');
      if (cbFab) cbFab.click();
    });
  }

  if (modalContactBtn) {
    modalContactBtn.addEventListener('click', () => {
      setProfileModal(false);
    });
  }
})();
