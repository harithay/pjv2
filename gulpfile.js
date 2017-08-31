var gulp = require('gulp');
var sass = require('gulp-sass');
var react = require('gulp-react');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var minify = require('gulp-minify');
var autoprefixer = require('gulp-autoprefixer');
var stripDebug = require('gulp-strip-debug');
var replace = require('gulp-replace');

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

gulp.task("production", function(el){
	var SEO = {
		collage : {
			title : "Collage maker - Use Photo Joiner Editor to create a beautiful collage",
			description: "Make a perfect collage using templates. PhotoJoiner editor gives you everything you need to create a beautiful collage online.",
			keyword : "make a collage, collage, collage maker,  photo joiner, photojoiner, combine multiple photos together, photo collage maker, create collage, photo collage",
			canonical : "https://www.photojoiner.net/collage-maker/editor",
			path : "photojoiner/collage-maker/editor"
		},
		meme : {
			title : "Meme generator - Awesome way to create memes and troll images",
			description: "Meme generator lets you create your funniest memes and troll images. You can either upload your own memes or select from thousands of memes from our repository freely",
			keyword : "Meme generator, memes, troll, meme, meme maker, meme creator, funny meme, troll images",
			canonical: "https://www.photojoiner.net/meme-generator/editor",
			path : "photojoiner/meme-generator/editor"
		},
		photojoiner: {
			title : "Stitch Photos - Use Photo Joiner Editor to Stitch images together",
			description: "Photo joiner, Stitch photos together using our online editor. Use our template chooser to arrange photos in horizontal or vertical arrangement.",
			keyword : "stitch photos, photo stitch,  photo joiner, photojoiner, join photos,  combine multiple photos together, vertical and horizontal stitching, image stitching, stitching with border",
			canonical: "https://www.photojoiner.net/merge-photos/editor",
			path : "photojoiner/merge-photos/editor"
		},
		freeonline: {
			title : "Free Online Collage Maker - Use Photo Editor to create a amazing collages",
			description: "Create collage using templates. Use filters to give your photo an amazing look. Create personal collages, memes or joiner photos for free.",
			keyword : "Online Collage Maker, Meme generator",
			canonical: "https://www.freeonlinetools.com/collage-maker",
			path : "freeonlinetools/collage-maker/editor"
		}
	}
	Object.getOwnPropertyNames(SEO).forEach((el) => {
		var site = SEO[el];
		var dest = "production/" + site.path;
		gulp.src("./css/*.css").pipe(autoprefixer()).pipe(gulp.dest(dest + '/css'));
		gulp.src('./css/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest(dest + '/css'));
		gulp.src("./images/*.*").pipe(gulp.dest(dest + '/images'));
		gulp.src("./images/uploaded/*.*").pipe(gulp.dest(dest + '/images/uploaded'));
		gulp.src("./css/lib/*.css").pipe(autoprefixer()).pipe(gulp.dest(dest + '/css/lib'));
		gulp.src('./js/lib/*.js').pipe(gulp.dest(dest + '/js/lib'));
		gulp.src('./*.html')
			.pipe(replace('{{title}}', site.title))
			.pipe(replace('{{canonical}}', site.canonical))
			.pipe(replace('{{description}}', site.description))
			.pipe(replace('{{keyword}}', site.keyword)).pipe(gulp.dest(dest + ''));
		gulp.src('./js/*.js').pipe(gulp.dest(dest + '/js'));
		gulp.src('./js/helper_classes.jsx').pipe(babel()).pipe(gulp.dest(dest + '/js'));
		gulp.src('./js/main.jsx').pipe(react()).pipe(babel()).pipe(gulp.dest(dest + '/js'));
	});
	return;
});