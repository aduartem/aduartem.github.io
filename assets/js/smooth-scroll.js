document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const escapedId = CSS.escape(targetId.substring(1));
      const targetElement = document.querySelector(`#${escapedId}`);

      if (!targetElement) {
        console.warn(`Elemento con ID "${targetId}" no encontrado`);
        return;
      }

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
