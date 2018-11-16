const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const connect = require('gulp-connect');
const autoprefix = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');
 
sass.compiler = require('node-sass');

var paths = {
    sass: "./scss/**/*.scss",
    templates: "./templates",
    pages: "./pages/**/*.njk",
    admin: "./admin/**/*",
    distAdmin:"./dist/admin",
    dist: "./dist",
    distCss: "./dist/css",
    distImages: "./dist/content/img/",
    images: "./content/img/**/*.*",
    js: "./content/js/**/*.js",
    distJs: "./dist/content/js",
    sourcemaps: "./maps"
};

var sassWatch = function(){
    gulp.watch(paths.sass, gulp.parallel('compile-sass'));
  };

  var htmlWatch = function(){
    gulp.watch([paths.templates, paths.pages], gulp.parallel('compile-html'));
  };

  var jsWatch = function(){
    gulp.watch(paths.js, gulp.parallel('compile-js'));
  };

  var imgWatch = function(){
    gulp.watch(paths.images, gulp.parallel('compress-images'));
  }

gulp.task('compile-html', function() {
    return gulp.src(paths.pages)
        .pipe(nunjucksRender({
            path: [paths.templates]
        }))
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload());
  });

  gulp.task('compile-sass', function () {
    return gulp.src(paths.sass)
      .pipe(sourcemaps.init())
      .pipe(autoprefix())
      .pipe(sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(sourcemaps.write(paths.sourcemaps))      
      .pipe(gulp.dest(paths.distCss))
      .pipe(connect.reload());
  });

  gulp.task('compile-js', function() {
    return gulp.src(paths.js)
      .pipe(minify())
      .pipe(gulp.dest(paths.distJs))
      .pipe(connect.reload())
  });

  gulp.task('compress-images', () =>
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.distImages))
    );

    gulp.task('copy-admin', () => 
      gulp.src(paths.admin)
          .pipe(gulp.dest(paths.distAdmin))
    );

    gulp.task('serve', function(){
      connect.server({
        livereload: true,
        root: 'dist'
      })
    });

    gulp.task('livereload', function() {
      gulp.src([paths.distCss, paths.distJs])
        .pipe(connect.reload());
    });

  gulp.task('build', gulp.parallel('compile-sass', 'compile-html', 'compile-js', 'compress-images', 'copy-admin'));
  gulp.task('sass:watch', gulp.series('compile-sass', sassWatch));
  gulp.task('html:watch', gulp.series('copy-admin', 'compile-html', htmlWatch));
  gulp.task('js:watch', gulp.series('compile-js', jsWatch));
  gulp.task('img:watch', gulp.series('compress-images', imgWatch));
  gulp.task('watch', gulp.parallel('sass:watch', 'html:watch', 'serve', 'img:watch','js:watch'));