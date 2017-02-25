'use strict';

var Chalk, autoprefixer, babel, beep, browserSync, cleanCSS, coffee, coffeeToJs, color_rgba_fallback, concat, frameCss, gulp, less, lessToJs, opacity, pixrem, plumber, postcss, processors, pseudoelements, purify, showErr, uglify, vmin, watch, watchCoffee, watchLess;

gulp = require('gulp');

plumber = require('gulp-plumber');

coffee = require('gulp-coffee');

watch = require('gulp-watch');

babel = require("gulp-babel");

uglify = require('gulp-uglify');

less = require('gulp-less');

Chalk = require('chalk');

cleanCSS = require('gulp-clean-css');

autoprefixer = require('gulp-autoprefixer');

postcss = require('gulp-postcss');

color_rgba_fallback = require('postcss-color-rgba-fallback');

opacity = require('postcss-opacity');

pseudoelements = require('postcss-pseudoelements');

vmin = require('postcss-vmin');

pixrem = require('pixrem');

concat = require('gulp-concat');

purify = require('gulp-purifycss');

browserSync = require('browser-sync').create();

processors = [color_rgba_fallback, opacity, pseudoelements, vmin, pixrem];

beep = function beep() {
  return console.log("\x07");
};

showErr = function showErr(err) {
  beep();
  return console.log(err);
};

coffeeToJs = function coffeeToJs(src, dest) {
  if (dest == null) {
    dest = './';
  }
  return gulp.src(src).pipe(plumber()).on('error', showErr).pipe(coffee({
    bare: true
  })).pipe(babel()).pipe(gulp.dest(dest));
};

watchCoffee = function watchCoffee(src, dest) {
  if (dest == null) {
    dest = './';
  }
  return gulp.src(src).pipe(watch(src)).pipe(plumber()).on('error', console.log).pipe(coffee({
    bare: true
  })).pipe(babel()).pipe(gulp.dest(dest));
};

lessToJs = function lessToJs(src, dest) {
  if (dest == null) {
    dest = './';
  }
  return gulp.src(src).pipe(plumber()).on('error', console.log).pipe(less()).pipe(autoprefixer({
    browsers: ['> 2%', 'Android >= 4.0', 'IE 8'],
    cascade: false
  })).pipe(postcss(processors)).pipe(cleanCSS()).pipe(gulp.dest(dest));
};

watchLess = function watchLess(src, dest) {
  if (dest == null) {
    dest = './';
  }
  return gulp.src(src).pipe(watch(src)).pipe(plumber()).on('error', console.log).pipe(less()).pipe(cleanCSS()).pipe(autoprefixer({
    browsers: ['> 2%', 'Android >= 4.0', 'IE 8'],
    cascade: false
  })).pipe(postcss(processors)).pipe(gulp.dest(dest));
};

frameCss = function frameCss(src, mod) {
  return gulp.src(src).pipe(watch(mod)).pipe(plumber()).on('error', console.log).pipe(concat('lib.css')).pipe(purify(['./assets/**/*.js', './**/*.html'])).pipe(cleanCSS()).pipe(autoprefixer({
    browsers: ['> 2%', 'Android >= 4.0', 'IE 8'],
    cascade: false
  })).pipe(postcss(processors)).pipe(gulp.dest('./assets/css'));
};

gulp.task('less', function () {
  return lessToJs('./less/**/*.less', './assets/css');
});

gulp.task('watchLess', function () {
  watchLess('./less/**/*.less', './assets/css');
  return frameCss(['./assets/css/bootstrap.css', './assets/css/flat-ui.css'], ['./*.html']);
});

gulp.task('selfWatch', function () {
  var restart;
  restart = function restart() {
    console.log(Chalk.green.bold('gulpfile changed and restarted'));
    return coffeeToJs('./gulpfile.coffee');
  };
  return watch('./gulpfile.coffee', restart).on('error', function (e) {
    return console.log(Chalk.red.blod(e.message));
  });
});

gulp.task('watch', function () {
  gulp.start('watchLess');
  return gulp.start('selfWatch');
});

gulp.task('default', ['less'], function () {
  gulp.start('web');
  gulp.start('watchLess');
  return gulp.start('selfWatch');
});

gulp.task('web', function () {
  return browserSync.init(null, {
    server: {
      baseDir: "./"
    },
    files: ["*.html", "assets/**/*.*"],
    browser: "ff",
    port: 7000
  });
});