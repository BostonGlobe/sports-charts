const gulp = require('gulp')
const runSequence = require('run-sequence')

gulp.task('prod', (cb) => {
	runSequence(
		'clean-chart',
		'html-chart-prod',
		'css-chart-prod',
		'js-chart-prod',
		'ssh-chart',
		cb
	)
})

gulp.task('prod-base', (cb) => {
	runSequence(
		'clean-base',
		'css-base-prod',
		'js-base-prod',
		'ssh-base',
		cb
	)
})
