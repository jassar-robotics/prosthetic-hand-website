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

const nav = document.querySelector('.nav');

if (nav) {
  const toggleNav = () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', toggleNav);
  toggleNav();
}
