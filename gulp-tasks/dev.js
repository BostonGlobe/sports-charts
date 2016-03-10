const gulp = require('gulp')
const runSequence = require('run-sequence')

gulp.task('dev', (cb) => {
	runSequence(
		'html-preview',
		'css-base-dev',
		'html-chart-dev',
		'css-chart-dev',
		'js-chart-dev',
		'browser-sync',
		cb
	)
})
