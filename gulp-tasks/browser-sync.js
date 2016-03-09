const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const shell = require('shelljs')
const argv = require('yargs').argv

gulp.task('browser-sync', (cb) => {
	browserSync.init({
		server: {
			baseDir: './',
			directory: true,
		},
		open: false,
		notify: false,
		ghostMode: false,
	})

	// open with query param
	shell.exec(`open http://localhost:3000/preview.html?chart=${argv.chart}`, cb)
})

gulp.task('browser-sync-reload', () => browserSync.reload())
