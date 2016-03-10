const gulp = require('gulp')
const runSequence = require('run-sequence')

gulp.task('dev', (cb) => {
	runSequence(
		'preview-html',
		'html-chart-dev',
		'css-chart-dev',
		'js-chart-dev',
		'browser-sync',
		cb
	)
})
