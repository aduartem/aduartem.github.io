var backToTopButton = document.getElementById('back-to-top');

// Verifica que el botón exista antes de configurar el evento onscroll
if (backToTopButton) {
  window.onscroll = function () {
    if (
      document.body.scrollTop > 300 ||
      document.documentElement.scrollTop > 300
    ) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  };

  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}

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

document.addEventListener('DOMContentLoaded', function () {
  // Función para verificar si el texto es solo una palabra o muy corto
  function esSoloPalabra(texto) {
    // Eliminar espacios en blanco al inicio y al final
    const trimmed = texto.trim();
    // Verificar si no contiene espacios (una sola palabra) o es muy corto (menos de 10 caracteres)
    return !trimmed.includes(' ') || trimmed.length < 10;
  }

  // Envolver cada bloque de código en un contenedor
  const codeBlocks = document.querySelectorAll('.highlighter-rouge');

  codeBlocks.forEach(function (block, index) {
    // Encontrar el elemento de código dentro del bloque
    const codeElement =
      block.querySelector('code') || block.querySelector('pre');

    // Si no hay elemento de código, o es solo una palabra, no agregar el botón de copiar
    if (!codeElement || esSoloPalabra(codeElement.textContent)) {
      return;
    }

    // Crear el contenedor
    const wrapper = document.createElement('div');
    wrapper.className = 'highlight-wrapper';

    // Crear el botón de copiar
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button';
    copyButton.textContent = 'Copiar';
    copyButton.setAttribute('aria-label', 'Copiar código');
    copyButton.setAttribute('data-id', 'code-' + index);

    // Insertar el botón y el bloque en el contenedor
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(copyButton);
    wrapper.appendChild(block);

    // Agregar funcionalidad de copiar
    copyButton.addEventListener('click', function () {
      let codeText = codeElement.textContent;

      // Crear un elemento textarea temporal
      const textArea = document.createElement('textarea');
      textArea.value = codeText;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.select();

      try {
        // Ejecutar el comando copiar
        const successful = document.execCommand('copy');

        // Cambiar el texto del botón para dar retroalimentación
        copyButton.textContent = successful ? '✓ Copiado!' : 'Error al copiar';
        copyButton.classList.add('copied');

        setTimeout(() => {
          copyButton.textContent = 'Copiar';
          copyButton.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('No se pudo copiar el texto: ', err);
        copyButton.textContent = 'Error al copiar';
      }

      // Eliminar el textarea temporal
      document.body.removeChild(textArea);
    });
  });
});

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

document.addEventListener('DOMContentLoaded', function () {
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;

  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
    body.classList.add(currentTheme);

    if (currentTheme === 'dark-theme') {
      themeSwitch.checked = true;
    }
  } else {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      body.classList.add('dark-theme');
      themeSwitch.checked = true;
      localStorage.setItem('theme', 'dark-theme');
    }
  }

  themeSwitch.addEventListener('change', function () {
    if (this.checked) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark-theme');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light-theme');
    }
  });
});
