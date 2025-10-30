(() => {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Mobile navigation toggle
  const menuToggle = qs('#menuToggle');
  const mobileMenu = qs('#mobileMenu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      menuToggle.querySelector('i')?.classList.toggle('fa-bars');
      menuToggle.querySelector('i')?.classList.toggle('fa-times');
    });
  }

  const setPaginationState = (pagination, activeIndex) => {
    if (!pagination) return;
    qsa('button', pagination).forEach((btn, idx) => {
      btn.classList.toggle('is-active', idx === activeIndex);
      btn.setAttribute('aria-pressed', idx === activeIndex ? 'true' : 'false');
    });
  };

  window.initHeroSlider = (root) => {
    if (!root) return;
    const track = qs('[data-hero-track]', root);
    const slides = track ? Array.from(track.children) : [];
    const prev = qs('[data-hero-prev]', root);
    const next = qs('[data-hero-next]', root);
    const pagination = qs('[data-hero-pagination]', root);
    if (!slides.length || !track) return;

    let index = 0;
    const slideCount = slides.length;

    if (pagination) {
      pagination.innerHTML = '';
      for (let i = 0; i < slideCount; i += 1) {
        const btn = document.createElement('button');
        btn.className = 'transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f4d75]';
        btn.type = 'button';
        btn.setAttribute('aria-label', `Pilih slide ${i + 1}`);
        btn.addEventListener('click', () => {
          index = i;
          update();
          restart();
        });
        pagination.appendChild(btn);
      }
    }

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      setPaginationState(pagination, index);
    };

    const nextSlide = () => {
      index = (index + 1) % slideCount;
      update();
    };

    const prevSlide = () => {
      index = (index - 1 + slideCount) % slideCount;
      update();
    };

    let timer = null;
    const restart = () => {
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(nextSlide, 6000);
    };

    next?.addEventListener('click', () => {
      nextSlide();
      restart();
    });
    prev?.addEventListener('click', () => {
      prevSlide();
      restart();
    });

    root.addEventListener('mouseenter', () => timer && window.clearInterval(timer));
    root.addEventListener('mouseleave', restart);

    update();
    restart();
  };

  const scrollByStep = (track, direction) => {
    const child = track?.firstElementChild;
    if (!child) return 0;
    const gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '16');
    const width = child.getBoundingClientRect().width;
    return direction * (width + gap);
  };

  window.initCarousel = (root) => {
    if (!root) return;
    const track = qs('[data-carousel-track]', root);
    if (!track) return;
    const prevButtons = qsa('[data-carousel-prev]', root);
    const nextButtons = qsa('[data-carousel-next]', root);

    const handle = (dir) => () => {
      const delta = scrollByStep(track, dir);
      track.scrollBy({ left: delta, behavior: 'smooth' });
    };

    prevButtons.forEach((btn) => btn.addEventListener('click', handle(-1)));
    nextButtons.forEach((btn) => btn.addEventListener('click', handle(1)));
  };
})();
