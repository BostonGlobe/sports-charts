const gulp = require('gulp')
const shell = require('shelljs')
const command = 'chmod -R 777 dist'

gulp.task('chmod-prod', (cb) => {
	shell.exec(command)
	cb()
})
