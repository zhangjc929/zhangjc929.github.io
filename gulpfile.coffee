gulp = require 'gulp'
plumber = require 'gulp-plumber'
coffee = require 'gulp-coffee'
watch = require 'gulp-watch'
babel = require "gulp-babel"
uglify = require 'gulp-uglify'
nodemon = require 'gulp-nodemon'
less = require 'gulp-less'
Chalk = require 'chalk'
cleanCSS = require 'gulp-clean-css'
autoprefixer = require 'gulp-autoprefixer'
postcss = require 'gulp-postcss'
color_rgba_fallback = require 'postcss-color-rgba-fallback'
opacity = require 'postcss-opacity'
pseudoelements = require 'postcss-pseudoelements'
vmin = require 'postcss-vmin'
pixrem = require 'pixrem'
concat = require 'gulp-concat'
purify = require 'gulp-purifycss'
browserSync = require('browser-sync').create()

processors = [
    color_rgba_fallback,
    opacity,
    pseudoelements,
    vmin,
    pixrem
]

coffeeToJs = (src, dest) ->
	console.log "complie #{src}"
	dest ?= './'
	gulp
	.src src
	.pipe plumber()
	.on 'error', console.log
	.pipe coffee { bare: true }
	.pipe babel()
	#.pipe uglify()
	.pipe gulp.dest(dest)

watchCoffee = (src, dest) ->
	dest ?= './'
	gulp
	.src src
	.pipe watch(src)
	.pipe plumber()
	.on 'error', console.log
	.pipe coffee { bare: true }
	.pipe babel()
	#.pipe uglify()
	.pipe gulp.dest(dest)

lessToJs = (src, dest) ->
	console.log "complie #{src}"
	dest ?= './'
	gulp
	.src src
	.pipe plumber()
	.on 'error', console.log
	.pipe less()
	.pipe(autoprefixer({
		browsers: ['> 2%', 'Android >= 4.0', 'IE 8'],
		cascade: false
	}))
	.pipe postcss(processors)
	.pipe cleanCSS()
	.pipe gulp.dest(dest)

watchLess = (src, dest) ->
	dest ?= './'
	gulp
	.src src
	.pipe watch(src)
	.pipe plumber()
	.on 'error', console.log
	.pipe less()
	.pipe cleanCSS()
	.pipe(autoprefixer({
		browsers: ['> 2%', 'Android >= 4.0', 'IE 8'],
		cascade: false
	}))
	.pipe postcss(processors)
	.pipe gulp.dest(dest)

frameCss = (src, mod) ->
	gulp
	.src src
	.pipe watch(mod)
	.pipe plumber()
	.on 'error', console.log
	.pipe concat('lib.css')
	.pipe purify(['./assets/**/*.js', './**/*.html'])
	.pipe cleanCSS()
	.pipe(autoprefixer({
		browsers: ['> 2%', 'Android >= 4.0', 'IE 8'],
		cascade: false
	}))
	.pipe postcss(processors)
	.pipe gulp.dest('./assets/css')

gulp.task 'less', ->
	lessToJs './less/**/*.less', './assets/css'

gulp.task 'watchLess', ->
	watchLess './less/**/*.less', './assets/css'
	frameCss ['./assets/css/bootstrap.css', './assets/css/flat-ui.css'], ['./*.html']

gulp.task 'selfWatch', ->
	restart = () ->
		console.log(Chalk.green.bold('gulpfile changed and restarted'))
		coffeeToJs './gulpfile.coffee'
		#require('child_process').spawn 'node', ['gulp'], {stdio: 'inherit'}

		#process.exit(0)

	watch('./gulpfile.coffee', restart).on 'error', (e) -> console.log(Chalk.red.blod(e.message))

gulp.task 'watch', ->
	gulp.start 'watchLess'
	gulp.start 'selfWatch'

gulp.task 'default', ['less'], ->
	gulp.start 'web'
	gulp.start 'watchLess'
	gulp.start 'selfWatch'

gulp.task 'web', ->
	browserSync.init null, {
		server: {
			baseDir: "./"
		}
		files : ["*.html", "assets/**/*.*"]
		browser : "ff"
		port : 7000
	}
