const gulp = require('gulp')
const replace = require('gulp-replace')
const fs = require('fs')
const argv = require('yargs').argv

const chartPath = `charts/${argv.chart}`
const src = 'src/base/index.html'
const dest = { dev: `dev/${chartPath}`, prod: `.tmp/${chartPath}` }

gulp.task('html-chart-dev', () => {
	const html = fs.readFileSync(`src/${chartPath}/chart.html`)
	return gulp.src(src)
		.pipe(replace('<!-- chart -->', html))
		.pipe(gulp.dest(dest.dev))
})

gulp.task('html-chart-prod', () => {
	const html = fs.readFileSync(`src/${chartPath}/chart.html`)
	return gulp.src(src)
		.pipe(replace('<!-- chart -->', html))
		.pipe(gulp.dest(dest.prod))
})
