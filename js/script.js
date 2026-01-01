const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

const observeRevealItems = (root = document) => {
  root.querySelectorAll('.reveal').forEach((item) => {
    if (item.dataset.revealObserved === 'true') {
      return;
    }
    item.dataset.revealObserved = 'true';
    revealObserver.observe(item);
  });
};

observeRevealItems();

const setActiveNavLink = (nav) => {
  const links = nav.querySelectorAll('.nav-link');
  if (!links.length) {
    return;
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;
  let activated = false;

  links.forEach((link) => {
    link.classList.remove('active');
  });

  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const [pathPart, hashPart] = href.split('#');
    const normalizedPath = pathPart || 'index.html';
    if (normalizedPath !== currentPath) {
      return;
    }
    if (currentHash && hashPart && `#${hashPart}` === currentHash) {
      link.classList.add('active');
      activated = true;
    }
  });

  if (!activated) {
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const [pathPart] = href.split('#');
      const normalizedPath = pathPart || 'index.html';
      if (normalizedPath === currentPath && normalizedPath !== 'index.html') {
        link.classList.add('active');
        activated = true;
      }
    });
  }
};

const initUniversalNav = (root = document) => {
  const nav = root.querySelector('.universal-nav');
  if (!nav || nav.dataset.navInitialized === 'true') {
    return;
  }

  nav.dataset.navInitialized = 'true';

  const navToggle = nav.querySelector('.nav-toggle');
  const navMenu = nav.querySelector('.nav-menu');

  const closeMenu = () => {
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
    if (navMenu) {
      navMenu.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
    }
    if (navMenu) {
      navMenu.classList.add('is-open');
    }
    document.body.style.overflow = 'hidden';
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navMenu.querySelectorAll('.nav-link, .nav-cta-btn').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  setActiveNavLink(nav);
  window.addEventListener('hashchange', () => setActiveNavLink(nav));
};

const includeTargets = document.querySelectorAll('[data-include]');

if (includeTargets.length) {
  includeTargets.forEach((target) => {
    const source = target.getAttribute('data-include');
    if (!source) {
      return;
    }

    fetch(source)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${source}`);
        }
        return response.text();
      })
      .then((html) => {
        target.innerHTML = html;
        observeRevealItems(target);
        initUniversalNav(target);
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

initUniversalNav();
