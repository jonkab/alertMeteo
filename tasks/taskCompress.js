/**
 * Created by saadna on 22/03/2016.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
gulp.task('compress', function() {
    return gulp.src('.tmp/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});