const gulp = require('gulp')
const stylus = require('gulp-stylus')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const browserSync = require('browser-sync')
const plumber = require('gulp-plumber')
const report = require('../report-error.js')
const argv = require('yargs').argv

const chartPath = `charts/${argv.chart}`
const src = `src/${chartPath}/css/main.styl`
const dest = `dev/${chartPath}`

gulp.task('css-chart-dev', () => {
	gulp.src(src)
		.pipe(plumber({ errorHandler: report }))
        .pipe(stylus())
		.pipe(autoprefixer())
		.pipe(rename('bundle.css'))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.reload({ stream: true }))
})

// gulp.task('css-prod', function () {
// 	gulp.src(src)
//         .pipe(stylus())
// 		.pipe(autoprefixer())
// 		.pipe(rename('bundle.css'))
// 		.pipe(gulp.dest('.tmp'))
// })
