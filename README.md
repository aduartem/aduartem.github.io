# aduartem.github.io

Iniciar servidor local en ambiente development:

```shell
# En windows
set JEKYLL_ENV=development
echo %JEKYLL_ENV%
bundle exec jekyll serve
```

Iniciar servidor local en ambiente production:

```shell
# En windows
npm run minify-js
set JEKYLL_ENV=production
echo %JEKYLL_ENV%
bundle exec jekyll serve
```

Build producción

```shell
npm run minify-js
set JEKYLL_ENV=production
bundle exec jekyll build

# En Linux/Mac:
JEKYLL_ENV=production bundle exec jekyll build --trace
```

