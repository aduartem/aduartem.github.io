document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      targetElement.classList.add('highlight-target');

      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: 'smooth',
      });

      setTimeout(() => {
        targetElement.classList.remove('highlight-target');
      }, 2000);
    });
  });
});
