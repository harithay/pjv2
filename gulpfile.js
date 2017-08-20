var gulp = require('gulp');
var sass = require('gulp-sass');
var react = require('gulp-react');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var minify = require('gulp-minify');
var autoprefixer = require('gulp-autoprefixer');
var stripDebug = require('gulp-strip-debug');

gulp.task('copy-static-js-libs', function(){
	return gulp.src('./js/lib/*.js').pipe(gulp.dest('dist/js/lib'));
});
gulp.task('copy-html', function(){
	return gulp.src('./*.html').pipe(gulp.dest('dist'));
});
gulp.task('copy-css', function(){
	return gulp.src('./css/*.css').pipe(gulp.dest('dist/css'));
});
gulp.task('copy-scss', function(){
	return gulp.src('./css/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('dist/css'));
});
gulp.task('copy-css-lib', function(){
	return gulp.src('./css/lib/*.css').pipe(gulp.dest('dist/css/lib'));
});
gulp.task('copy-images', function(){
	return gulp.src('./images/*.*').pipe(gulp.dest('dist/images'));
});
gulp.task('copy-js', function(){
	return gulp.src('./js/*.js$').pipe(gulp.dest('dist/js'));
});
gulp.task('copy', ['copy-js', 'copy-html','copy-css','copy-scss', 'copy-images','copy-css-lib', "copy-static-js-libs"], function(){
	
});
gulp.task('default', function () {
    return gulp.src(['./js/main.jsx','./js/model.js'])
        .pipe(react())
        .pipe(babel())
        .pipe(gulp.dest('dist/js'));
});

gulp.task("watch", function(){
	return watch(["./css/*.css","./css/*.scss",'./js/lib/*.js','./*.html','./js/*.js','./js/main.jsx','./js/helper_classes.jsx'], function(){
		gulp.src("./css/*.css").pipe(autoprefixer()).pipe(gulp.dest('dist/css'));
		gulp.src('./css/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('dist/css'));
		gulp.src("./images/*.*").pipe(gulp.dest('dist/images'));
		gulp.src("./images/uploaded/*.*").pipe(gulp.dest('dist/images/uploaded'));
		gulp.src("./css/lib/*.css").pipe(autoprefixer()).pipe(gulp.dest('dist/css/lib'));
		gulp.src('./js/lib/*.js').pipe(gulp.dest('dist/js/lib'));
		gulp.src('./*.html').pipe(gulp.dest('dist'));
		gulp.src('./js/*.js').pipe(gulp.dest('dist/js'));
		gulp.src('./js/helper_classes.jsx').pipe(babel()).pipe(gulp.dest('dist/js'));
		gulp.src('./js/main.jsx').pipe(react()).pipe(babel()).pipe(gulp.dest('dist/js'));
	});
});