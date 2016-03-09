const gulp = require('gulp')
const rename = require('gulp-rename')
const browserSync = require('browser-sync')
const argv = require('yargs').argv

const chartPath = `charts/${argv.chart}`
const src = `src/${chartPath}/index.html`
const dest = `dev/${chartPath}`

gulp.task('html-chart-dev', () => {
	return gulp.src(src)
		.pipe(rename('index.html'))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.reload({ stream: true }))
})

// gulp.task('html-prod', function() {
// 	return gulp.src('src/index.html')
// 		.pipe(smoosher())
// 		.pipe(gulp.dest('.tmp'))
// })
