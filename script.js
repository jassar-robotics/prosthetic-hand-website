const revealItems = document.querySelectorAll('.reveal');

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const nav = document.querySelector('.nav');

if (nav) {
  const toggleNav = () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', toggleNav);
  toggleNav();
}
