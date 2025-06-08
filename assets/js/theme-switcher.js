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
