document.addEventListener('DOMContentLoaded', function () {
  // Envolver cada bloque de código en un contenedor
  const codeBlocks = document.querySelectorAll('.highlighter-rouge');

  codeBlocks.forEach(function (block, index) {
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
      // Encontrar el código dentro del bloque
      const codeElement =
        block.querySelector('code') || block.querySelector('pre');
      let codeText = codeElement.textContent;

      // Crear un elemento textarea temporal
      const textArea = document.createElement('textarea');
      textArea.value = codeText;
      textArea.style.position = 'fixed'; // Evitar desplazamiento
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
