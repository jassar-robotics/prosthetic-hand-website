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
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('is-open');
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  });
  
  // Close menu when clicking on a link
  navMenu.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

// Scroll effect for nav (optional subtle effect)
const universalNav = document.querySelector('.universal-nav');

if (universalNav) {
  const handleScroll = () => {
    if (window.scrollY > 50) {
      universalNav.style.background = 'rgba(17, 18, 21, 0.98)';
      universalNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      universalNav.style.background = 'rgba(17, 18, 21, 0.95)';
      universalNav.style.boxShadow = 'none';
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll();
}
