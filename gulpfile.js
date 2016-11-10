'use strict'

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    webserver = require('gulp-webserver'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    runSequence = require('run-sequence');
    


var config = {
  paths: {
      sources : {
        scss: './app/scss/',
        css: './app/css/',
        js:   './app/js/',
        root: './app/',
        images: './app/images/',
        assets: './app/assets/',
      },
      destinations : {    
        css: './dist/css/',  
        js:   './dist/js/',
        root: './dist/',
        images: './dist/images/',
        assets: './dist/assets/',
      }
     }
}


//watch for all files & browserSync
gulp.task('watch', ['browserSync','sass'] , function(){
  gulp.watch(config.paths.sources.scss + '**/*.scss', ['sass']);
  gulp.watch(config.paths.sources.root + '*.html', browserSync.reload);
  gulp.watch(config.paths.sources.js + '**/*.js', browserSync.reload);
  // Other watchers
});


gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})


//Convert SASS files & reload in every change.
gulp.task('sass', function(){
  return gulp.src(config.paths.sources.scss + '**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(config.paths.sources.root + 'css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//Concat & Minified , JS & CSS from .html's
gulp.task('useref', function(){
  return gulp.src(config.paths.sources.root + '*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))    
    .pipe(gulp.dest(config.paths.destinations.root))
});

//Minified and caching images.
gulp.task('images', function(){
  return gulp.src(config.paths.sources.images + '**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin()))
  .pipe(gulp.dest(config.paths.destinations.images))
});

//Copy assets
gulp.task('assets', function() {
  return gulp.src(config.paths.sources.assets + '**/*')
  .pipe(gulp.dest(config.paths.destinations.assets))
})

gulp.task('clean:dist', function() {
  return del.sync(config.paths.destinations.root);
})

//test server
gulp.task('webserver', function() {
  gulp.src(config.paths.destinations.root)
   .pipe(webserver({
      port: 8000,
      path: '/dist/',
      open: 'http://localhost:8000/dist/'
    }));
});

//HTML minified
gulp.task('html-min', function() {
  return gulp.src(config.paths.destinations.root + '*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(config.paths.destinations.root));
});
 
gulp.task('autoprefix', () =>
    gulp.src(config.paths.destinations.css + '**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(config.paths.destinations.css))
);


//Run all together
gulp.task('build', function (callback) {
  runSequence('clean:dist','sass',
    ['useref', 'images', 'assets'],['html-min','autoprefix'],'webserver', 
    callback
  )
})