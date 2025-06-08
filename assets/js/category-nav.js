document.addEventListener('DOMContentLoaded', function () {
  const categoryLinks = document.querySelectorAll('.category-nav a');
  const sections = document.querySelectorAll('.category-section');

  if (categoryLinks.length === 0 || sections.length === 0) return;

  function setActiveLink() {
    let currentSectionId = '';
    let foundActive = false;

    if (window.location.hash) {
      currentSectionId = window.location.hash.substring(1);
      foundActive = true;
    }

    if (!foundActive || !document.getElementById(currentSectionId)) {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 0) {
          if (!foundActive) {
            currentSectionId = section.getAttribute('id');
            foundActive = true;
          }
        }
      });
    }

    if (!currentSectionId && sections.length > 0) {
      currentSectionId = sections[0].getAttribute('id');
    }

    categoryLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('active');
        if (link.parentElement && link.parentElement.parentElement) {
          link.parentElement.parentElement.scrollTop = link.offsetTop - 100;
        }
      }
    });

    sections.forEach((section) => {
      section.classList.remove('active');
    });

    if (currentSectionId) {
      const activeSection = document.getElementById(currentSectionId);
      if (activeSection) {
        activeSection.classList.add('active');
      }
    }
  }

  categoryLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();

        const targetId = href;
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        history.pushState(null, null, targetId);

        targetElement.classList.add('highlight-flash');

        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth',
        });

        setActiveLink();

        setTimeout(() => {
          targetElement.classList.remove('highlight-flash');
        }, 1500);
      }
    });
  });

  const postLinks = document.querySelectorAll('a.post-link[data-post-url]');
  postLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      console.log('Navegando a post: ' + this.href);
    });
  });

  window.addEventListener('scroll', setActiveLink);

  window.addEventListener('hashchange', setActiveLink);

  setActiveLink();
});
