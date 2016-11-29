'use strict';

var gulp = require('gulp');
var paths = gulp.paths;
var plugins = gulp.plugins;

function packageJsDependencies(min) {
  gulp.src([
    (min) ? 'bower_components/jquery/dist/jquery.min.js' :
      'bower_components/jquery/dist/jquery.js',
    (min) ? 'bower_components/angular/angular.min.js' :
      'bower_components/angular/angular.js',
    'bower_components/angular-ui-layout/src/ui-layout.js',
    (min) ? 'bower_components/angular-animate/angular-animate.min.js' :
      'bower_components/angular-animate/angular-animate.js',
    (min) ? 'bower_components/angular-ui-router/release/angular-ui-router.min.js' :
      'bower_components/angular-ui-router/release/angular-ui-router.js',
    (min) ? 'bower_components/angular-bootstrap/ui-bootstrap.min.js' :
      'bower_components/angular-bootstrap/ui-bootstrap.js',
    (min) ? 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js' :
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    (min) ? 'bower_components/jasny-bootstrap/dist/js/jasny-bootstrap.min.js' :
      'bower_components/jasny-bootstrap/dist/js/jasny-bootstrap.js',
    'bower_components/modernizer/modernizr.js',
    (min) ? 'bower_components/moment/min/moment.min.js' :
      'bower_components/moment/moment.js',
    'bower_components/angular-ui-calendar/src/calendar.js',
    (min) ? 'bower_components/fullcalendar/dist/fullcalendar.min.js' :
      'bower_components/fullcalendar/dist/fullcalendar.js',
    'bower_components/fullcalendar/dist/gcal.js',
    'bower_components/angular-cache/dist/angular-cache.min.js'
  ])
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.concat('vendor.js'))
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest(paths.dist + '/js'));
}

gulp.task('scripts', ['jscs', 'jshint', 'templates'], function(done) {
  packageJsDependencies(false);
  return gulp.src([paths.app + '/**/*.js', '!' + paths.app + '/**/*-test.js'])
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat('app.js'))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task('scripts:prod', ['jscs', 'jshint', 'templates'], function(done) {
  packageJsDependencies(true);
  return gulp.src([paths.app + '/**/*.js', '!' + paths.app + '/**/*-test.js'])
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat('app.js'))
      .pipe(plugins.uglify())
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest(paths.dist + '/js'));
});
