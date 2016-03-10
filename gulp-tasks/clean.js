const gulp = require('gulp')
const del = require('del')
const argv = require('yargs').argv
const chartPath = `charts/${argv.chart}`

gulp.task('clean-chart', (cb) => {
	del.sync([`dist/${chartPath}/**/*`])
	cb()
})

gulp.task('clean-base', (cb) => {
	del.sync(['dist/chart-base.css'])
	cb()
})
