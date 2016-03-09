const gulp = require('gulp')
const browserSync = require('browser-sync')

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './',
            index: 'preview.html'
        },
        notify: false,
        ghostMode: false
    })
})
