const gulp = require('gulp')
const argv = require('yargs').argv

const chartPath = `charts/${argv.chart}`
const src = `src/${chartPath}/assets/**/*`
const dest = { dev: `dev/${chartPath}/assets`, prod: `dist/${chartPath}/assets` }

gulp.task('assets-chart-dev', () =>
	gulp.src(src)
	.pipe(gulp.dest(dest.dev))
)

gulp.task('assets-chart-prod', () =>
	gulp.src(src)
	.pipe(gulp.dest(dest.prod))
)
