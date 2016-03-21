const gulp = require('gulp')
const rename = require('gulp-rename')
const webpackStream = require('webpack-stream')
const named = require('vinyl-named')
const plumber = require('gulp-plumber')
const report = require('../report-error.js')
const argv = require('yargs').argv
const config = {
	dev: require('../webpack.config.dev.js'),
	prod: require('../webpack.config.prod.js'),
}

const chartPath = `charts/${argv.chart}`
const src = `src/${chartPath}/js/main.js`
const dest = { dev: `dev/${chartPath}`, prod: `dist/${chartPath}` }

gulp.task('js-chart-dev', () =>
	gulp.src(src)
	.pipe(named())
	.pipe(plumber({ errorHandler: report }))
	.pipe(webpackStream(config.dev))
	.pipe(gulp.dest(dest.dev))
)

gulp.task('js-chart-prod', () =>
	gulp.src(src)
	.pipe(named())
	.pipe(webpackStream(Object.assign(
		{},
		config.prod,
		{ devtool: 'source-map' })))
	.pipe(gulp.dest(dest.prod))
)

gulp.task('js-base-dev', () =>
	gulp.src('src/base/js/config.js')
	.pipe(plumber({ errorHandler: report }))
	.pipe(webpackStream(config.dev))
	.pipe(rename('chart-base.js'))
	.pipe(gulp.dest('dev'))
)

gulp.task('js-base-prod', () =>
	gulp.src('src/base/js/config.js')
	.pipe(webpackStream(config.prod))
	.pipe(rename('chart-base.js'))
	.pipe(gulp.dest('dist'))
)
