var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');

gulp.task('es6', function () {
    browserify({
        entries:'./app/scripts/main.js',
        debug:true
    })
        .transform(babelify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./.tmp'))
        .pipe(gulp.dest('dist'));
});