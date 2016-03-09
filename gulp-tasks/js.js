const gulp = require('gulp')
const rename = require('gulp-rename')
const browserSync = require('browser-sync')
const webpackStream = require('webpack-stream')
const plumber = require('gulp-plumber')
const report = require('../report-error.js')
const argv = require('yargs').argv
const config = require('../webpack.config.dev.js')

const chartPath = `charts/${argv.chart}`
const src = `src/${chartPath}/js/main.js`
const dest = `dev/${chartPath}`

gulp.task('js-chart-dev', () => {
	return gulp.src(src)
		.pipe(plumber({ errorHandler: report }))
		.pipe(webpackStream(config))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.reload({ stream: true }))
})

// gulp.task('js-prod', function() {
// 	return gulp.src(src)
// 		.pipe(webpackStream(prod_config))
// 		.pipe(rename('bundle.js'))
// 		.pipe(gulp.dest('.tmp'))
// })
