import './styles/main.scss';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------------- Mobile menu ---------------- */
function initMenu(): void {
  const burger = document.querySelector<HTMLButtonElement>('.burger');
  const nav = document.querySelector<HTMLElement>('#site-nav');
  if (!burger || !nav) return;

  const setOpen = (open: boolean): void => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  };

  burger.addEventListener('click', () => {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      burger.focus();
    }
  });

  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ---------------- Hero parallax ---------------- */
function initParallax(): void {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;

  const layers = Array.from(hero.querySelectorAll<HTMLElement>('[data-parallax]'));
  const fading = hero.querySelector<HTMLElement>('[data-fade]');
  let ticking = false;

  const update = (): void => {
    ticking = false;
    const y = window.scrollY;
    const limit = hero.offsetHeight;

    // Nothing to animate once the hero is off screen
    if (y > limit * 1.2) return;

    for (const layer of layers) {
      const speed = Number(layer.dataset.parallax) || 0;
      layer.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
    }

    if (fading) {
      const progress = Math.min(y / (limit * 0.5), 1);
      fading.style.opacity = String(1 - progress);
    }
  };

  const onScroll = (): void => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  const enable = (): void => {
    if (prefersReducedMotion.matches) {
      window.removeEventListener('scroll', onScroll);
      layers.forEach((l) => (l.style.transform = ''));
      if (fading) fading.style.opacity = '';
      return;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  };

  prefersReducedMotion.addEventListener('change', enable);
  enable();
}

/* ---------------- Reveal on scroll ---------------- */
function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');

  // stagger items inside the same article
  document.querySelectorAll('.feature').forEach((feature) => {
    feature.querySelectorAll<HTMLElement>('.feature__body .reveal').forEach((el, i) => {
      el.style.setProperty('--i', String(i));
    });
  });

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------------- Section slider (Start / 01 / 02 / 03) ---------------- */
function initProgress(): void {
  const progress = document.querySelector<HTMLElement>('.progress');
  if (!progress) return;

  const links = Array.from(progress.querySelectorAll<HTMLAnchorElement>('.progress__link'));
  const sections = links
    .map((link) => document.getElementById(link.dataset.section ?? ''))
    .filter((el): el is HTMLElement => el !== null);

  const setActive = (index: number): void => {
    progress.style.setProperty('--step', String(index));
    links.forEach((link, i) => {
      const active = i === index;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  // a section becomes active when it crosses the middle of the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActive(sections.indexOf(entry.target as HTMLElement));
        }
      }
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}

initMenu();
initParallax();
initReveal();
initProgress();
