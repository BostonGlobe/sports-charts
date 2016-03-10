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
	})

	cb()
})

gulp.task('browser-sync-reload', () => browserSync.reload())
