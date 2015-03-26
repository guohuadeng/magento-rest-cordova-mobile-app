var gulp = require('gulp'),
    bower = require('gulp-bower'),
    del = require('del'),
    minifyHTML = require('gulp-minify-html'),
    cssimport = require('gulp-cssimport'),
    minifyCSS = require('gulp-minify-css'),
    concatScript = require('gulp-concat-script'),
    uglify = require('gulp-uglify'),
    bless = require('gulp-bless'),
    target = './dist';

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('bower_components/'));
});

gulp.task('clean', function(cb) {
    del([target], cb);
});

gulp.task('copy', ['clean'], function () {
    gulp.src('bower_components/fontawesome/fonts/**/*')
        .pipe(gulp.dest(target + '/fonts/'));

    gulp.src('bower_components/ratchet/fonts/**/*')
        .pipe(gulp.dest(target + '/fonts/'));

    gulp.src('images/**/*')
        .pipe(gulp.dest(target + '/images/'));

    gulp.src('assets/scroll/*.png')
        .pipe(gulp.dest(target + '/css/'));

    gulp.src('plugins/**/**')
        .pipe(gulp.dest(target + '/plugins'));
});

gulp.task('html', ['clean'], function () {
    gulp.src('index.html')
        .pipe(minifyHTML())
        .pipe(gulp.dest(target));
});

gulp.task('css', ['clean'], function () {
    gulp.src('css/config.css')
        .pipe(cssimport())
        .pipe(minifyCSS())
        .pipe(bless())
        .pipe(gulp.dest(target + '/css/'));
});

gulp.task('js', ['clean'], function () {
    gulp.src('js/config.js')
        .pipe(concatScript())
        .pipe(uglify())
        .pipe(gulp.dest(target + '/js'));
});

gulp.task('default', ['bower', 'copy', 'html', 'css', 'js']);