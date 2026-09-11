/* Anamika Nayak — no framework, no build step, no tracking. */
(() => {
  'use strict';
  const root = document.getElementById('anamika-portfolio');
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const intro = $('#coffee-intro');
  const popup = $('#coffee-message');
  const question = $('#intro-question');
  const serve = $('#coffee-serve');
  const cup = $('#coffee-cup');
  const canvas = $('#coffee-liquid');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sessionKey = 'anamika-portfolio-coffee-v1';
  let state = 'closed';
  let animationFrame = 0;
  let timers = [];
  let returnFocus = null;
  let previousOverflow = '';
  const later = (callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    timers.push(timer);
    return timer;
  };
  function clearAnimation() {
    cancelAnimationFrame(animationFrame);
    timers.forEach(window.clearTimeout);
    timers = [];
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  }
  function markSeen() {
    try { window.sessionStorage.setItem(sessionKey, 'seen'); } catch (_) { /* The experience also works with storage disabled. */ }
  }
  function lockScroll() {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  function unlockScroll() { document.body.style.overflow = previousOverflow; }
  function openIntro() {
    if (state !== 'closed') return;
    returnFocus = document.activeElement;
    state = 'question';
    clearAnimation();
    intro.classList.remove('is-revealing');
    cup.classList.remove('is-spilling');
    cup.disabled = false;
    question.hidden = false;
    serve.hidden = true;
    intro.setAttribute('aria-labelledby', 'intro-title');
    intro.setAttribute('aria-describedby', 'intro-description');
    lockScroll();
    intro.showModal();
    $('#coffee-yes').focus({ preventScroll: true });
  }
  function closeIntro({ restoreFocus = true } = {}) {
    if (state === 'closed') return;
    clearAnimation();
    markSeen();
    state = 'closed';
    intro.close();
    intro.classList.remove('is-revealing');
    unlockScroll();
    if (restoreFocus) {
      const target = returnFocus?.matches('button, a') ? returnFocus : $('.site-header .brand-name');
      target?.focus({ preventScroll: true });
    }
  }
  function serveCoffee() {
    if (state !== 'question') return;
    state = 'served';
    question.hidden = true;
    serve.hidden = false;
    intro.setAttribute('aria-labelledby', 'serve-title');
    intro.removeAttribute('aria-describedby');
    cup.focus({ preventScroll: true });
    $('#announcements').textContent = 'Here’s your coffee. Careful—it’s full. Tap the cup to continue.';
  }
  function showSpillMessage() {
    closeIntro({ restoreFocus: false });
    lockScroll();
    popup.showModal();
    $('[data-popup-target="work"]').focus({ preventScroll: true });
  }
  function closePopup(target) {
    popup.close();
    unlockScroll();
    if (target) {
      const section = $('#' + target);
      section?.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
      section?.querySelector('a,button')?.focus({ preventScroll: true });
    } else {
      (returnFocus?.matches('button, a') ? returnFocus : $('.site-header .brand-name'))?.focus({ preventScroll: true });
    }
  }

  /* A bounded, requestAnimationFrame liquid simulation: accelerating stream,
     ballistic droplets, and a softly irregular glossy pool. No libraries. */
  function animateSpill() {
    const ctx = canvas.getContext('2d');
    if (!ctx) { showSpillMessage(); return; }
    const shellRect = $('.intro-shell').getBoundingClientRect();
    const cupRect = cup.getBoundingClientRect();
    const width = shellRect.width;
    const height = shellRect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.scale(ratio, ratio);
    // Upper-left rim of the cup after the gentle counter-clockwise tilt.
    const origin = { x: cupRect.left - shellRect.left + cupRect.width * .29,
      y: cupRect.top - shellRect.top + cupRect.height * .47 };
    const pool = { x: origin.x - 34, y: Math.min(origin.y + 120, height * .8) };
    const maxRadius = Math.hypot(width, height) * 1.16;
    const droplets = Array.from({ length: 17 }, (_, i) => ({
      delay: .3 + (i % 5) * .075,
      vx: -135 + ((i * 79) % 260),
      vy: -205 + ((i * 53) % 170),
      r: 2.6 + (i % 4) * 1.3,
    }));
    let start;
    const ease = (value) => 1 - Math.pow(1 - Math.max(0, Math.min(1, value)), 3);
    function organicPool(x, y, radius, time) {
      ctx.beginPath();
      const count = 160;
      for (let i = 0; i <= count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const undulation = 1 + .075 * Math.sin(angle * 5 + .4) + .045 * Math.sin(angle * 9 - time * .25) + .028 * Math.cos(angle * 13);
        const px = x + Math.cos(angle) * radius * undulation;
        const py = y + Math.sin(angle) * radius * .68 * undulation;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }
    function frame(timestamp) {
      if (state !== 'spilling') return;
      start ??= timestamp;
      const t = (timestamp - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      const poolProgress = ease((t - .32) / 1.65);
      const radius = 8 + Math.pow(poolProgress, 3.3) * maxRadius;
      if (t > .3) {
        organicPool(pool.x, pool.y, radius, t);
        const gradient = ctx.createRadialGradient(pool.x - radius * .15, pool.y - radius * .2, 0, pool.x, pool.y, radius);
        gradient.addColorStop(0, '#422010');
        gradient.addColorStop(.45, '#2b1108');
        gradient.addColorStop(.92, '#321407');
        gradient.addColorStop(1, '#773b16');
        ctx.fillStyle = gradient;
        ctx.shadowColor = '#070301a8'; ctx.shadowBlur = 13;
        ctx.fill(); ctx.shadowBlur = 0;
        ctx.strokeStyle = '#a6632b88'; ctx.lineWidth = 1.5; ctx.stroke();
        // A narrow reflection along the advancing liquid edge.
        ctx.save(); ctx.clip();
        ctx.beginPath(); ctx.ellipse(pool.x - radius * .1, pool.y - radius * .44, radius * .49, radius * .075, -.12, Math.PI, Math.PI * 1.88);
        ctx.strokeStyle = '#d6a16d22'; ctx.lineWidth = 3; ctx.stroke();
        ctx.restore();
      }
      if (t > .16 && t < 1.15) {
        const stream = Math.min((t - .16) * 3, 1);
        const sx = origin.x - Math.sin(t * 2) * 18;
        const sy = origin.y + Math.sin(t * 1.7) * 6;
        const ex = pool.x;
        const ey = sy + (pool.y - sy) * stream;
        ctx.beginPath(); ctx.moveTo(sx - 8, sy);
        ctx.bezierCurveTo(sx - 23, sy + 25, ex - 17, ey - 22, ex - 14, ey);
        ctx.quadraticCurveTo(ex, ey + 11, ex + 12, ey);
        ctx.bezierCurveTo(ex + 3, ey - 20, sx - 2, sy + 29, sx + 5, sy);
        ctx.closePath();
        const streamGradient = ctx.createLinearGradient(sx - 20, 0, sx + 10, 0);
        streamGradient.addColorStop(0, '#783813'); streamGradient.addColorStop(.4, '#9b5124'); streamGradient.addColorStop(.58, '#4f200b'); streamGradient.addColorStop(1, '#260c04');
        ctx.fillStyle = streamGradient; ctx.fill();
      }
      droplets.forEach((d) => {
        const age = t - d.delay;
        if (age < 0 || age > .9) return;
        const x = pool.x + d.vx * age;
        const y = pool.y + d.vy * age + 360 * age * age;
        ctx.beginPath(); ctx.ellipse(x, y, d.r * (1 - age * .3), d.r * (1.15 + age * .5), Math.atan2(d.vy + 720 * age, d.vx), 0, Math.PI * 2);
        ctx.fillStyle = '#633013'; ctx.fill();
        ctx.beginPath(); ctx.ellipse(x - 1, y - 1, d.r * .27, d.r * .5, -.4, 0, Math.PI * 2);
        ctx.fillStyle = '#dca46d99'; ctx.fill();
      });
      if (t < 2.1) animationFrame = requestAnimationFrame(frame);
    }
    animationFrame = requestAnimationFrame(frame);
  }
  function spillCoffee() {
    if (state !== 'served') return;
    state = 'spilling';
    cup.disabled = true;
    markSeen();
    $('#announcements').textContent = 'Oops. You spilled the coffee!';
    if (motion.matches) { showSpillMessage(); return; }
    cup.classList.add('is-spilling');
    animateSpill();
    later(() => intro.classList.add('is-revealing'), 2050);
    later(showSpillMessage, 2800);
  }
  $('#coffee-yes').addEventListener('click', serveCoffee);
  cup.addEventListener('click', spillCoffee);
  $$('.intro-skip').forEach((button) => button.addEventListener('click', () => closeIntro()));
  intro.addEventListener('cancel', (event) => { event.preventDefault(); closeIntro(); });
  $('.replay-coffee').addEventListener('click', openIntro);
  $('.close-popup').addEventListener('click', () => closePopup());
  popup.addEventListener('cancel', (event) => { event.preventDefault(); closePopup(); });
  $$('[data-popup-target]').forEach((button) => button.addEventListener('click', () => closePopup(button.dataset.popupTarget)));
  motion.addEventListener?.('change', () => { if (motion.matches && state === 'spilling') showSpillMessage(); });
  $('#copyright-year').textContent = new Date().getFullYear();
  // Brand assets are bundled locally and work without a logo CDN.
  let seen = false;
  try { seen = window.sessionStorage.getItem(sessionKey) === 'seen'; } catch (_) { /* sessionStorage is optional. */ }
  if (!seen && typeof intro.showModal === 'function') openIntro();
  else if (typeof intro.showModal !== 'function') $('.replay-coffee').hidden = true;
})();
