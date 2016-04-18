var gulp = require('gulp');

var source = require('vinyl-source-stream');

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/*.html')
        .pipe(wiredep({
//      ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('app'));
});