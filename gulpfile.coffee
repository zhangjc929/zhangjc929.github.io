gulp = require 'gulp'
plumber = require 'gulp-plumber'
coffee = require 'gulp-coffee'
watch = require 'gulp-watch'
babel = require "gulp-babel"
uglify = require 'gulp-uglify'
Chalk = require 'chalk'

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

gulp.task 'selfWatch', ->
	restart = () ->
		console.log(Chalk.green.bold('gulpfile changed and restarted'))
		coffeeToJs './gulpfile.coffee'
		#require('child_process').spawn 'node', ['gulp'], {stdio: 'inherit'}

		#process.exit(0)

	watch('./gulpfile.coffee', restart).on 'error', (e) -> console.log(Chalk.red.blod(e.message))

gulp.task 'default', ->
	gulp.start 'web'
	gulp.start 'selfWatch'

gulp.task 'web', ->
	browserSync = require('browser-sync').create()

	browserSync.init null, {
		server: {
			baseDir: "./"
		}
		browser : "ff"
		port : 7000
	}
