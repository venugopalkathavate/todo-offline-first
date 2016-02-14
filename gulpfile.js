var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var sass = require('gulp-sass');
var htmlreplace = require('gulp-html-replace');

var path = {
	HTML: 'src/index.html',
	ALL: ['src/js/*.js', 'src/js/**/*.js', 'src/index.html', 'src/scss/*.scss', 'src/scss/**/*.scss'],
	JS: ['src/js/*.js', 'src/js/**/*.js'],
	SCSS: ['src/scss/*.scss', 'src/scss/**/*.scss'],
	MINIFIED_OUT: 'build.min.js',
	DEST_SRC: 'dist/src/js',
	DEST_CSS: 'dist/src/css',
	DEST_BUILD: 'dist/build',
	DEST: 'dist'
};

gulp.task('transform', function() {
	gulp.src(path.JS)
	    .pipe(react())
	    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('sass', function () {
	return gulp.src(path.SCSS)
	    .pipe(sass().on('error', sass.logError))
	    .pipe(gulp.dest(path.DEST_CSS));
});

gulp.task('copy', function() {
  	gulp.src(path.HTML)
    	.pipe(gulp.dest(path.DEST));
});

gulp.task('watch', function() {
  	gulp.watch(path.ALL, ['transform', 'sass', 'copy']);
});

gulp.task('build', function() {
	gulp.src(path.JS)
	    .pipe(react())
	    .pipe(concat(path.MINIFIED_OUT))
	    .pipe(uglify(path.MINIFIED_OUT))
	    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('replaceHTML', function() {
	gulp.src(path.HTML)
    	.pipe(htmlreplace({
      		'js': 'build/' + path.MINIFIED_OUT
    	}))
    	.pipe(gulp.dest(path.DEST));
});

gulp.task('default', ["transform", "sass", 'watch']);
gulp.task('production', ['replaceHTML', 'build']);

