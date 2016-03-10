const gulp = require('gulp')
const replace = require('gulp-replace')
const fs = require('fs')
const argv = require('yargs').argv
const rename = require('gulp-rename')
const version = require('../package.json').version.replace(/\./g, '')

const chartPath = `charts/${argv.chart}`
const src = 'src/base/index.html'
const dest = { dev: `dev/${chartPath}`, prod: `dist/${chartPath}` }
const data = `test-data/${argv.chart}.json`

gulp.task('html-preview', () => {
	const json = fs.readFileSync(data)
	return gulp.src('preview.html.template')
		.pipe(replace('<!-- data -->', json))
		.pipe(replace('<!-- chart -->', argv.chart))
		.pipe(rename('preview.html'))
		.pipe(gulp.dest('.'))
})

gulp.task('html-chart-dev', () => {
	const html = fs.readFileSync(`src/${chartPath}/chart.html`)
	return gulp.src(src)
		.pipe(replace('<!-- chart -->', html))
		.pipe(gulp.dest(dest.dev))
})

gulp.task('html-chart-prod', () => {
	const html = fs.readFileSync(`src/${chartPath}/chart.html`)
	const timestamp = Math.floor(Date.now() / 6000)
	return gulp.src(src)
		.pipe(replace('<!-- chart -->', html))
		.pipe(replace(/\?v=chart/g, `?v=${timestamp}`))
		.pipe(replace(/\?v=base/g, `?v=${version}`))
		.pipe(gulp.dest(dest.prod))
})
