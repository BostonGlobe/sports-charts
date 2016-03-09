const gulp = require('gulp')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const fs = require('fs')
const argv = require('yargs').argv

const chartPath = `charts/${argv.chart}`
const src = 'src/common/index.html'
const dest = `dev/${chartPath}`

gulp.task('html-chart-dev', () => {
	const html = fs.readFileSync(`src/${chartPath}/chart.html`)
	return gulp.src(src)
		.pipe(replace('<!-- chart -->', html))
		.pipe(gulp.dest(dest))
})

// gulp.task('html-prod', function() {
// 	return gulp.src('src/index.html')
// 		.pipe(smoosher())
// 		.pipe(gulp.dest('.tmp'))
// })
