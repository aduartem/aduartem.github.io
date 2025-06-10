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
