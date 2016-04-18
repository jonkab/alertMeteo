/*global -$ */
'use strict';
// generated on 2016-02-03 using generator-es6-webapp 0.1.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var gulpif = require('gulp-if');
var minimist = require('minimist');

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
};
var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('deploy', function() {
  var assets = $.useref.assets({searchPath: ['.tmp']});
  return gulp.src('app/scripts/**/*.js')
      .pipe(assets)
      .pipe(gulpif(options.env === 'prod', $.uglify())) // only minify in production  : gulp deploy --env development
      .pipe(gulp.dest('dist'));
});

require('require-dir')('./tasks');

gulp.task('produce',['wiredep','es6','less','images','fonts']);

gulp.task('package',['produce','html','extras']);

gulp.task('serve', ['produce'], function () {
  browserSync({
    notify: false,
    port: 9005,
    server: {
      baseDir: ['.tmp', 'app'],
      middleware: function (req, res, next) {
        console.log('Adding CORS header for ' + req.method + ': ' + req.url);
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      },
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.less', ['less']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
  gulp.watch('app/scripts/**/*.js', ['es6']);
});

gulp.task('serve:dist',['package'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test',['produce'], function () {
  browserSync({
    notify: false,
    open: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test'
    }
  });

  gulp.watch([
    'test/spec/**/*.js',
  ]).on('change', reload);

});



gulp.task('build', ['package'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
