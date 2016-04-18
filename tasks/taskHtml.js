var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('html', function () {
    var assets = $.useref.assets({searchPath: ['.tmp']});


    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
        .pipe(gulp.dest('dist'));
});