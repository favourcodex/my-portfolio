/* ===================================================
   AZUBUIKE FAVOUR — Portfolio Script
   Vanilla JS: Typing, Particles, IntersectionObserver,
   Scroll Progress, Nav Highlight, Theme Toggle, Form
   =================================================== */

// ─── DOM READY ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initParticles();
  initTypingAnimation();
  initScrollReveal();
  initNavHighlight();
  initStickyNav();
  initHamburger();
  initThemeToggle();
  initSkillBars();
  initContactForm();
  initSmoothScroll();
});


/* ─── 1. SCROLL PROGRESS BAR ──────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop  = document.documentElement.scrollTop;
    const scrollMax  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0;
    bar.style.width  = pct + '%';
  }, { passive: true });
}


/* ─── 2. FLOATING PARTICLES ───────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let   W, H, particles;

  // Accent color for particles
  const getAccent = () => getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim() || '#d4a017';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Build particle pool
  function buildParticles(count = 55) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.4,       // radius
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
  }
  buildParticles();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const accent = getAccent();

    for (const p of particles) {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      // Wrap edges
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;

      // Draw
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.restore();
    }

    // Draw faint connection lines between close particles
    ctx.save();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.globalAlpha = (1 - dist / 120) * 0.06;
          ctx.strokeStyle = accent;
          ctx.lineWidth   = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    requestAnimationFrame(draw);
  }
  draw();
}


/* ─── 3. TYPING ANIMATION ─────────────────────────── */
function initTypingAnimation() {
  const el    = document.getElementById('typed-name');
  const text  = 'Azubuike Favour';
  let   index = 0;
  let   started = false;

  // Start after initial animations settle
  setTimeout(() => {
    function typeNext() {
      if (index <= text.length) {
        el.textContent = text.slice(0, index);
        index++;
        setTimeout(typeNext, index < 5 ? 120 : 80);
      }
    }
    typeNext();
  }, 600);
}


/* ─── 4. SCROLL REVEAL via IntersectionObserver ───── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-fade');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve once revealed for performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px',
  });

  targets.forEach(el => observer.observe(el));
}


/* ─── 5. ACTIVE NAV LINK ON SCROLL ───────────────── */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -50% 0px',
  });

  sections.forEach(sec => observer.observe(sec));
}


/* ─── 6. STICKY NAV SCROLL STYLE ─────────────────── */
function initStickyNav() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}


/* ─── 7. HAMBURGER MOBILE MENU ───────────────────── */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#navbar')) {
      links.classList.remove('open');
      btn.classList.remove('open');
    }
  });
}


/* ─── 8. THEME TOGGLE (Dark / Light) ─────────────── */
function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const icon = btn.querySelector('.theme-icon');

  // Read saved preference
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    icon.textContent = theme === 'dark' ? '☀' : '☾';
  }
}


/* ─── 9. ANIMATED SKILL BARS ─────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width') + '%';
        // Small delay so user notices the animation
        setTimeout(() => { bar.style.width = width; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}


/* ─── 10. CONTACT FORM ───────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('contact-form');
  const success   = document.getElementById('form-success');
  const submitBtn = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Extract form values
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject')?.value.trim() || '';
    const message = form.querySelector('#message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      shakeForm();
      return;
    }
    if (!isValidEmail(email)) {
      shakeInput(form.querySelector('#email'));
      return;
    }

    // UI Loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'Sending…';

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      } else {
        alert(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = originalText;
    }
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeInput(input) {
    input.style.borderColor = '#e05252';
    input.style.animation   = 'shake 0.4s ease';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.animation   = '';
    }, 600);
  }

  function shakeForm() {
    form.style.animation = 'shake 0.4s ease';
    setTimeout(() => { form.style.animation = ''; }, 600);
  }
}


/* ─── 11. SMOOTH SCROLL ──────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });
}


/* ─── CSS for shake keyframe (injected once) ────── */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();