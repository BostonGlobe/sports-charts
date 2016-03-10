const gulp = require('gulp')
const del = require('del')
const argv = require('yargs').argv
const chartPath = `charts/${argv.chart}`

gulp.task('clean', (cb) => {
	del.sync([`dist/${chartPath}/**/*`])
	cb()
})
