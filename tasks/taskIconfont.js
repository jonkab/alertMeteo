var gulp = require('gulp');
var iconfont = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename');

gulp.task('Iconfont', function(){
    return gulp.src(['./app/icons/*.svg'])
        .pipe(iconfont({
            fontName: 'iconsWA', // required
            appendUnicode: false, // recommended option
            formats: ['ttf', 'eot', 'woff','svg'] // default, 'woff2' and 'svg' are available
        }))
        .on('glyphs', function(glyphs, options) {
            // CSS templating, e.g.
            gulp.src('./tools/icons-webfont-templates/_template.css')
                .pipe(sourcemaps.init())
                .pipe(consolidate('lodash', {
                    glyphs: glyphs,
                    fontName: 'iconsWA',
                    fontPath: '/styles/fonts/src',
                    className: 'iconWA'
                }))
                .pipe(rename('icons.less'))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest('app/styles/fonts'))
        })
        //.pipe(gulp.dest('./content/src/main/content/jcr_root/etc/designs/axa/axa-tva/clientlib_base/fonts'))
        .pipe(gulp.dest('./dist/styles/fonts'))
        .pipe(gulp.dest('./app/styles/fonts/src'));
});