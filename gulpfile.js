var gulp = require('gulp');

var concat = require('gulp-concat');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');



gulp.task('concat', function() {
  gulp.src(['public/js/**/*.js', '!public/js/app.js', '!public/lib/*.js'])
      .pipe(concat('script.js'))
      .pipe(gulp.dest('./build/js'))   
});

gulp.task('minify', function() {
  gulp.src(['build/js/*.js', 'public/js/app.js'])
  .pipe(minify())
  .pipe(gulp.dest('./build/js'))  
  
  gulp.src('public/js/lib/*.js')
  .pipe(minify())
  .pipe(gulp.dest('./build/js/lib'))   
});


gulp.task('minifyCSS', function() {
  gulp.src('public/css/style.css')
      .pipe(cleanCSS('style.css'))
      .pipe(gulp.dest('./build/css'))   
});


gulp.task('uglify', function() {
  gulp.src('build/js/*-min.js')
      .pipe(uglify())
      .pipe(gulp.dest('./build/js'))   
});


gulp.task('copy', function() {
  gulp.src(['public/templates/**/*', 'public/index.html'])
      .pipe(gulp.dest('./build/templates'))   

  gulp.src('public/index.html')
    .pipe(gulp.dest('./build'))  
});


gulp.task('default', ['concat', 'minifyCSS', 'copy']);
gulp.task('minugly', ['minify', 'uglify']);