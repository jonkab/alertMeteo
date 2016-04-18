var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('less', function () {
    return gulp.src('app/styles/main.less')
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.postcss([
            require('autoprefixer-core')({browsers: ['last 1 version']})
        ]))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reload({stream: true}));
});