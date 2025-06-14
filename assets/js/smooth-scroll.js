document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const elementId = targetId.substring(1);
      let targetElement = document.getElementById(elementId);

      if (!targetElement) {
        try {
          const escapedId = CSS.escape(elementId);
          targetElement = document.querySelector(`#${escapedId}`);
        } catch (err) {
          console.warn(`No se pudo encontrar el elemento con ID: ${elementId}`);
          return;
        }
      }

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
