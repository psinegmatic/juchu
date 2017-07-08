var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		bourbon        = require('node-bourbon'),
		notify         = require('gulp-notify'),
	    svgmin         = require('gulp-svgmin'),
	    svgsprite      = require('gulp-svg-sprites');

// Скрипты проекта
gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/jquery.js',
		'app/libs/bxslider-4/dist/jquery.bxslider.js',
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({
		includePaths: bourbon.includePaths
	}).on('error', notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 2 versions']))
	.pipe(cleanCSS())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'scripts', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js'], ['scripts']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('symbols', function() {
  return gulp.src('app/img/icons/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(svgsprite({
      mode: 'symbols',
        preview: false,
        selector: '%f',
        svg: {
          symbols: 'symbol_sprite.html'
        }
    }))
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest('app/img'));
});


gulp.task('build', ['removedist', 'imagemin', 'symbols', 'sass', 'scripts'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess'
		]).pipe(gulp.dest('build'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
		]).pipe(gulp.dest('build/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js'
		]).pipe(gulp.dest('build/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*']
		).pipe(gulp.dest('build/fonts'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
