const gulp = require('gulp')
const shell = require('shelljs')
const argv = require('yargs').argv
const base = '/web/bgapps/html/sports/charts'
const host = 'shell.boston.com'

gulp.task('ssh-chart', (cb) => {
	const username = argv.u
	const chart = argv.chart

	if (username) {
		const filepath = `${base}/${chart}`
		const command = `(cd dist/charts/${chart}; scp -r . ${username}@${host}:${filepath}/)`
		console.log(command)
		shell.exec(command, cb)
	} else {
		console.log('** provide a username **')
		cb()
	}
})

gulp.task('ssh-base', (cb) => {
	const username = argv.u

	if (username) {
		const command = `(cd dist; scp -r chart-base.* ${username}@${host}:${base}/)`
		console.log(command)
		shell.exec(command, cb)
	} else {
		console.log('** provide a username **')
		cb()
	}
})
