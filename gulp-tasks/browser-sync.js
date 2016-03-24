const gulp = require('gulp')
const browserSync = require('browser-sync').create()

gulp.task('browser-sync', (cb) => {
	browserSync.init({
		server: {
			baseDir: './',
			index: 'preview.html',
		},
		notify: false,
		ghostMode: false,
		port: 3010,
		ui: {
			port: 3011,
		},
	})

	cb()
})

gulp.task('browser-sync-reload', () => browserSync.reload())
