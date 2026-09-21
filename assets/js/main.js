/* ==========================================================================
   Jonathan Faith Poedjianto — Portfolio
   Vanilla JS: no build step, no external libraries, no runtime dependencies.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*  Preloader  */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const countEl = preloader.querySelector('.pl-count');
    const barEl = preloader.querySelector('.pl-bar');
    const statusEl = preloader.querySelector('.pl-status');
    const ticks = [...preloader.querySelectorAll('.pl-ticks span')];
    const hide = () => preloader.classList.add('hidden');

    // Purely cosmetic loading captions — this is a page loader, not a
    // readout of any real running system.
    const stages = [
      { at: 0, text: 'INITIALIZING INTERFACE' },
      { at: 35, text: 'LOADING ASSETS' },
      { at: 75, text: 'ALMOST READY' },
      { at: 100, text: 'READY' },
    ];

    if (reducedMotion) {
      hide();
    } else {
      let pct = 0;
      const start = performance.now();
      const duration = 1400;
      const tick = (now) => {
        pct = Math.min(100, Math.round(((now - start) / duration) * 100));
        if (countEl) countEl.textContent = pct + '%';
        if (barEl) barEl.style.width = pct + '%';
        if (statusEl) {
          const stage = [...stages].reverse().find(s => pct >= s.at);
          if (stage) statusEl.textContent = stage.text;
        }
        const litCount = Math.round((pct / 100) * ticks.length);
        ticks.forEach((t, i) => t.classList.toggle('lit', i < litCount));
        if (pct < 100) requestAnimationFrame(tick);
        else setTimeout(hide, 350);
      };
      requestAnimationFrame(tick);
    }
  }


  /*  Nav scroll state  */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /*  Mobile menu  */
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.querySelector('.mobile-panel');
  const closeBtn = document.querySelector('.mobile-panel .close-btn');
  const openPanel = () => panel.classList.add('open');
  const closePanel = () => panel.classList.remove('open');
  if (toggle) toggle.addEventListener('click', openPanel);
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  panel?.querySelectorAll('a').forEach(a => a.addEventListener('click', closePanel));

  /*  Active section highlight  */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...document.querySelectorAll('section[id]')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => sectionObserver.observe(s));

  /*  Staggered word reveal for main section headings  */
  document.querySelectorAll('h2.reveal').forEach(title => {
    const words = title.textContent.trim().split(/\s+/);
    title.innerHTML = words
      .map((w, i) => `<span class="word"><span class="word-inner" style="transition-delay:${(i * 0.035).toFixed(3)}s">${w}</span></span>`)
      .join(' ');
  });

  /*  Reveal on scroll  */
  const revealEls = document.querySelectorAll('.reveal');
  if (reducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /*  Hero text reveal trigger  */
  const hero = document.querySelector('.hero');
  requestAnimationFrame(() => hero?.classList.add('loaded'));

  /*  Frame-sequence background: scrubs through 300 frames across the whole page scroll, instantly  */
  if (!reducedMotion) {
    const bgCanvas = document.getElementById('bgCanvas');
    const bgPosterFallback = document.getElementById('bgPosterFallback');

    if (bgCanvas) {
      const FRAME_COUNT = 300;
      const frameSrc = (i) => `assets/videos/hero-frames/frame-${String(i).padStart(3, '0')}.jpg`;
      const ctx = bgCanvas.getContext('2d');
      const frames = new Array(FRAME_COUNT);
      let lastDrawnIndex = -1;
      let scrubReady = false;

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.src = frameSrc(i);
        frames[i - 1] = img;
      }

      const drawFrame = (index) => {
        let useIndex = Math.min(Math.max(Math.round(index), 0), FRAME_COUNT - 1);
        // If the exact frame hasn't finished loading yet, fall back to the
        // nearest earlier one that has, so the background never goes blank.
        while (useIndex > 0 && !(frames[useIndex] && frames[useIndex].complete && frames[useIndex].naturalWidth)) {
          useIndex--;
        }
        const img = frames[useIndex];
        if (!img || !img.complete || !img.naturalWidth || useIndex === lastDrawnIndex) return;
        lastDrawnIndex = useIndex;
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        ctx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height);
      };

      const getScrollProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max <= 0) return 0;
        return Math.min(Math.max(window.scrollY / max, 0), 1);
      };

      const activateScrub = () => {
        if (scrubReady) return;
        scrubReady = true;
        bgCanvas.classList.add('ready');
        bgPosterFallback?.classList.add('hide');
        drawFrame(getScrollProgress() * (FRAME_COUNT - 1));
      };

      // Start as soon as the first frame is in, with a timed fallback
      // in case the network is slow.
      frames[0].addEventListener('load', activateScrub, { once: true });
      setTimeout(activateScrub, 1200);

      // Directly draw the frame matching the current scroll position —
      // no easing, no lag, one-to-one with the scroll.
      window.addEventListener('scroll', () => {
        if (!scrubReady) return;
        drawFrame(getScrollProgress() * (FRAME_COUNT - 1));
      }, { passive: true });
    }
  }


  document.querySelectorAll('video[data-optional]').forEach(video => {
    video.addEventListener('loadeddata', () => video.classList.add('loaded'));
    video.addEventListener('error', () => {
      // No video file present yet — the CSS gradient fallback behind it
      // already looks intentional, so we just leave it be.
      video.style.display = 'none';
    });
    // If nothing loads within a few seconds, don't leave a spinner state.
    setTimeout(() => { if (!video.classList.contains('loaded')) video.style.display = 'none'; }, 6000);
  });

  /*  CV link: friendly disabled state until the file is actually added  */
  document.querySelectorAll('a[data-cv-link]').forEach(link => {
    fetch(link.getAttribute('href'), { method: 'HEAD' })
      .then(res => { if (!res.ok) throw new Error('missing'); })
      .catch(() => {
        link.classList.add('cv-missing');
        link.title = 'Add your file as assets/cv.pdf to activate this link';
        link.addEventListener('click', (e) => e.preventDefault());
      });
  });


  document.querySelectorAll('img[data-optional-img]').forEach(img => {
    const wrapper = img.closest('.placeholder, .gallery-slot');
    const markLoaded = () => {
      img.classList.add('loaded');
      wrapper?.classList.add('filled');
    };
    const markMissing = () => { img.style.display = 'none'; };

    if (img.complete) {
      // Image tag already resolved (e.g. loaded from cache) before this ran.
      img.naturalWidth > 0 ? markLoaded() : markMissing();
    } else {
      img.addEventListener('load', markLoaded);
      img.addEventListener('error', markMissing);
    }
  });

  /*  CV link: friendly disabled state if the file isn't there yet  */
  document.querySelectorAll('a[data-cv-link]').forEach(link => {
    fetch(link.getAttribute('href'), { method: 'HEAD' })
      .then(res => { if (!res.ok) throw new Error('missing'); })
      .catch(() => {
        link.classList.add('cv-missing');
        link.setAttribute('title', 'Add your file as assets/cv.pdf to activate this link');
        link.addEventListener('click', (e) => e.preventDefault());
      });
  });

  /*  Custom cursor: replaces the native pointer, morphs on hover  */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && !reducedMotion) {
    document.documentElement.classList.add('custom-cursor-active');

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    const ringLabel = document.createElement('span');
    ringLabel.className = 'ring-label';
    ring.appendChild(ringLabel);
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;   // real cursor position
    let ringX = 0, ringY = 0;     // ring position, lerps toward the cursor

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.classList.add('active');
      ring.classList.add('active');
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });
    document.addEventListener('mouseleave', () => {
      dot.classList.remove('active');
      ring.classList.remove('active');
    });

    // Ring lags gently behind the dot for a weighted, premium feel.
    const followLoop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(followLoop);
    };
    requestAnimationFrame(followLoop);

    // Any element with data-cursor="LABEL" grows the ring and shows the label.
    // Anything else clickable just grows the ring with no label.
    document.querySelectorAll('a, button, .proj-row, [data-cursor]').forEach(el => {
      const label = el.getAttribute('data-cursor');
      el.addEventListener('mouseenter', () => {
        ring.classList.add('hover');
        ringLabel.textContent = label || '';
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('hover');
        ringLabel.textContent = '';
      });
    });
  }

  /*  Magnetic pull: nav links + project links drift toward the cursor  */
  if (canHover && !reducedMotion) {
    document.querySelectorAll('.nav-links a, .proj-link').forEach(el => {
      const strength = 0.35;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.height / 2 + r.top);
        el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /*  Hero parallax: text drifts opposite the cursor, subtly  */
  if (canHover && !reducedMotion) {
    const heroContent = document.querySelector('.hero-content');
    const heroEl = document.querySelector('.hero');
    if (heroEl && heroContent) {
      heroEl.addEventListener('mousemove', (e) => {
        const r = heroEl.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        heroContent.style.transform = `translate(${px * -14}px, ${py * -10}px)`;
      });
      heroEl.addEventListener('mouseleave', () => {
        heroContent.style.transform = '';
      });
    }
  }

  /*  Project rows: subtle 3D tilt toward the cursor  */
  if (canHover && !reducedMotion) {
    document.querySelectorAll('.proj-row').forEach(row => {
      row.addEventListener('mousemove', (e) => {
        const r = row.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        row.style.transform = `perspective(800px) rotateX(${py * -3.5}deg) rotateY(${px * 3.5}deg)`;
      });
      row.addEventListener('mouseleave', () => { row.style.transform = ''; });
    });
  }

  /*  Status strip: simple live-looking clock (cosmetic, honest)  */
  const uptimeEl = document.querySelector('[data-uptime]');
  if (uptimeEl) {
    // This does not connect to any real running instance of FRIDAY —
    // it's a static, honest label, not a live label.
    uptimeEl.textContent = 'local — not connected';
  }

  /*  Hover-follow image preview: project rows  */
  if (canHover && !reducedMotion) {
    const hoverPreview = document.getElementById('hoverPreview');
    const hoverPreviewImg = document.getElementById('hoverPreviewImg');
    if (hoverPreview && hoverPreviewImg) {
      const PREVIEW_W = 300, PREVIEW_H = 210, OFFSET_X = 30;
      document.querySelectorAll('.proj-row').forEach(row => {
        row.addEventListener('mousemove', (e) => {
          const shot = row.querySelector('.gallery-slot .ph-img.loaded');
          if (!shot) { hoverPreview.classList.remove('active'); return; }
          if (hoverPreviewImg.src !== shot.src) hoverPreviewImg.src = shot.src;
          hoverPreview.classList.add('active');
          const x = Math.min(e.clientX + OFFSET_X, window.innerWidth - PREVIEW_W - 16);
          const y = Math.min(Math.max(e.clientY - PREVIEW_H / 2, 16), window.innerHeight - PREVIEW_H - 16);
          hoverPreview.style.transform = `translate(${x}px, ${y}px)`;
        });
        row.addEventListener('mouseleave', () => hoverPreview.classList.remove('active'));
      });
    }
  }

  /*  Lightbox: click any loaded screenshot to view it full-size  */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('open');
    };
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      setTimeout(() => { if (!lightbox.classList.contains('open')) lightboxImg.src = ''; }, 300);
    };
    document.addEventListener('click', (e) => {
      const shot = e.target.closest('img.ph-img.loaded');
      if (shot) { openLightbox(shot.src, shot.alt); return; }
      if (e.target.closest('#lightbox')) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }
});