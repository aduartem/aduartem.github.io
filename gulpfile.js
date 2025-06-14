const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

// Tarea para minificar y combinar JavaScript
gulp.task('minify-js', function () {
  return gulp
    .src('assets/js/*.js')
    .pipe(concat('all.js'))     // Combina todos los archivos en uno llamado all.js
    .pipe(gulp.dest('assets/js/min'))  // Guarda la versión combinada sin minificar (opcional)
    .pipe(uglify())             // Minifica el archivo combinado
    .pipe(rename({ suffix: '.min' }))  // Renombra a all.min.js
    .pipe(gulp.dest('assets/js/min'));  // Guarda el archivo minificado
});

// Tarea de construcción
gulp.task('build', gulp.series('minify-js'));
