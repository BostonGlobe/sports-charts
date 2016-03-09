const gulp = require('gulp')
const runSequence = require('run-sequence')

gulp.task('prod', (cb) => {
	runSequence(
		'clean',
		'html-chart-prod',
		'css-chart-prod',
		'js-chart-prod',
		cb
	)
})
