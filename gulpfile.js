var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var jade = require('gulp-jade');
var uncss = require('gulp-uncss');
var critical = require('critical').stream;
// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });
});
// .pipe(autoprefixer({
//     browsers: ['last 2 version', 'safari 5', 'ie6', 'ie7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
//     cascade: false
// }))
gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.sass') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass
    .pipe(autoprefixer({
      browsers: ['last 2 version'],
      cascade: false,
    }))
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true,
    }));
});

// Jade templates
gulp.task('jade', function() {
  gulp.src('app/jade/index.jade')
    .pipe(jade({
      pretty: true,
    }))
    .pipe(gulp.dest('app/'));
});

// Generate & Inline Critical-path CSS
// gulp.task('critical', function () {
//     return gulp.src('index.html')
//         .pipe(critical({base: ' ', inline: true, css: ['css/main.min.css']}))
//         .pipe(gulp.dest(' '));
// });

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']);
  gulp.watch(['app/data/*.jade','app/jade/*.jade'], ['jade']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// NOTE: I'm hosting my site with Github Pages so index.html goes in the root folder
// for other projects configuration use the dist folder only. In my case I just copy the dist/index.html to root

// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript
gulp.task('useref', function() {
  var assets = useref.assets();
  return gulp.src('app/index.html')
    .pipe(assets)
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', minifyCSS()))
    // Uglifies only if it's a Javascript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest(''));
});

// Optimizing Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg|ico)')
  // Caching images that ran through imagemin
  //.pipe(cache(imagemin()))
  .pipe(gulp.dest('images'));
});

// Copying fonts
// gulp.task('fonts', function() {
//   return gulp.src('app/fonts/**/*')
//   .pipe(gulp.dest('dist/fonts'));
// });

// Cleaning
// gulp.task('clean', function(callback) {
//   del('dist');
//   return cache.clearAll(callback);
// });
//
// gulp.task('clean:dist', function(callback) {
//   del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback);
// });

gulp.task('clean', function(callback) {
  del('assets');
  return cache.clearAll(callback);
});

gulp.task('clean:dist', function(callback) {
  del(['css','js', 'images', '!images/**/*', 'index.html'], callback);
});

// uncss
gulp.task('uncss', function () {
    return gulp.src('css/*.css')
        .pipe(uncss({
            html: ['index.html']
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('css'));
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch', 'jade'],
    callback
  );
});

gulp.task('build', function(callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images'],
    callback
  );
});
