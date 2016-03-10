const gulp = require('gulp')
const runSequence = require('run-sequence')

gulp.task('prod', (cb) => {
	runSequence(
		'clean',
		'css-base-prod',
		'html-chart-prod',
		'css-chart-prod',
		'js-chart-prod',
		cb
	)
})
