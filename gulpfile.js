'use strict';

var Chalk, autoprefixer, babel, browserSync, cleanCSS, coffee, coffeeToJs, color_rgba_fallback, gulp, less, lessToJs, nodemon, opacity, pixrem, plumber, postcss, processors, pseudoelements, uglify, vmin, watch, watchCoffee, watchLess;

gulp = require('gulp');

plumber = require('gulp-plumber');

coffee = require('gulp-coffee');

watch = require('gulp-watch');

babel = require("gulp-babel");

uglify = require('gulp-uglify');

nodemon = require('gulp-nodemon');

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

browserSync = require('browser-sync').create();

processors = [color_rgba_fallback, opacity, pseudoelements, vmin, pixrem];

coffeeToJs = function (src, dest) {
  console.log("complie " + src);
  if (dest == null) {
    dest = './';
  }
  return gulp.src(src).pipe(plumber()).on('error', console.log).pipe(coffee({
    bare: true
  })).pipe(babel()).pipe(gulp.dest(dest));
};

watchCoffee = function (src, dest) {
  if (dest == null) {
    dest = './';
  }
  return gulp.src(src).pipe(watch(src)).pipe(plumber()).on('error', console.log).pipe(coffee({
    bare: true
  })).pipe(babel()).pipe(gulp.dest(dest));
};

lessToJs = function (src, dest) {
  console.log("complie " + src);
  if (dest == null) {
    dest = './';
  }
  return gulp.src(src).pipe(plumber()).on('error', console.log).pipe(less()).pipe(autoprefixer({
    browsers: ['> 2%', 'Android >= 4.0', 'IE 8'],
    cascade: false
  })).pipe(postcss(processors)).pipe(cleanCSS()).pipe(gulp.dest(dest));
};

watchLess = function (src, dest) {
  if (dest == null) {
    dest = './';
  }
  return gulp.src(src).pipe(watch(src)).pipe(plumber()).on('error', console.log).pipe(less()).pipe(cleanCSS()).pipe(autoprefixer({
    browsers: ['> 2%', 'Android >= 4.0', 'IE 8'],
    cascade: false
  })).pipe(postcss(processors)).pipe(gulp.dest(dest));
};

gulp.task('less', function () {
  return lessToJs('./less/**/*.less', './assets/css');
});

gulp.task('watchLess', function () {
  return watchLess('./less/**/*.less', './assets/css');
});

gulp.task('selfWatch', function () {
  var restart;
  restart = function () {
    console.log(Chalk.green.bold('gulpfile changed and restarted'));
    return coffeeToJs('./gulpfile.coffee');
  };
  return watch('./gulpfile.coffee', restart).on('error', function (e) {
    return console.log(Chalk.red.blod(e.message));
  });
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
    files: ["*.html", "less/*.less", "assets/**/*.*"],
    browser: "ff",
    port: 7000
  });
});