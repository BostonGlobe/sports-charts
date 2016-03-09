const gulp = require('gulp')
const argv = require('yargs').argv

const chartPath = `charts/${argv.chart}`

gulp.task('default', ['html-chart-dev', 'css-chart-dev', 'js-chart-dev', 'browser-sync'], () => {
	gulp.watch(`src/${chartPath}/css/**/*.styl`, ['css-chart-dev'])
	gulp.watch(`src/${chartPath}/js/**/*.js`, ['js-chart-dev'])
	gulp.watch(`src/${chartPath}/assets/**/*`, ['assets-chart-dev'])
	gulp.watch(`src/${chartPath}/index.html`, ['html-chart-dev'])

	gulp.watch('src/common/css/**/*.styl', ['css-common-dev'])
	gulp.watch('src/common/js/**/*.js', ['js-common-dev'])
})
