var gulp = require('gulp');
gulp.task('fonts', function () {
    return gulp.src(require('main-bower-files')({
            filter: '**/*.{eot,svg,ttf,woff,woff2}'
        }).concat('app/styles/fonts/**/*'))
        .pipe(gulp.dest('.tmp/fonts'))
        .pipe(gulp.dest('dist/fonts'));
});