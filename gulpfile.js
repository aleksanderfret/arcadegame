const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const htmlreplace = require('gulp-html-replace');

// gulp-concat-replace
// gulp-useref'
// gulpIf
// gulp-cssnano
// gulp-imagemin

gulp.task('default', function(done){
  gulp.watch('./app/sass/**/*.scss', gulp.series('styles'));
  gulp.watch('./app/src/**/*.js', gulp.series('js'));
  gulp.watch('./app/index.html', gulp.series('html'));
  browserSync.init({
    server: "./app"
  });
  browserSync.stream();
  done();
});

gulp.task('styles', (done) => {
  gulp.src('./app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream());
    done();
});

gulp.task('js', (done) => {
  gulp.src(['./app/src/resources.js','./app/src/app.js', './app/src/engine.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
		.pipe(babel({
			presets: ['env']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/js'))
    .pipe(browserSync.stream());
    done();
  });

  gulp.task('html', (done) => {
    gulp.src('./app/index.html')
    .pipe(htmlreplace({
      'js': 'js/main.min.js'
    }))
    .pipe(browserSync.stream());
    done();
  });

  gulp.task('jsBuild', (done) => {
    gulp.src(['./app/src/resources.js','./app/src/app.js', './app/src/engine.js'])
    .pipe(concat('main.js'))
		.pipe(babel({
			presets: ['env']
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./build/js'));
    done();
  });

  gulp.task('stylesBuild', (done) => {
    gulp.src('./app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./build/css'));
    done();
  });

  gulp.task('htmlBuild', (done) => {
    gulp.src('./app/index.html')
    .pipe(htmlreplace({
      'js': 'js/main.min.js'
    }))
    .pipe(gulp.dest('./build'));
    done();
  });

  gulp.task('imagesBuild', (done) => {
    gulp.src('./app/img/**/*.+(jpg|png|svg)')
    .pipe(gulp.dest('./build/img'));
    done();
  });

  gulp.task('empty:build', (done) => {
    del.sync('./build/*');
    done();
  })

  gulp.task('build', gulp.series('imagesBuild', 'jsBuild', 'stylesBuild', 'htmlBuild', (done) => {
    done();
  }));