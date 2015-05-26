var gulp = require('gulp'),
	run = require('run-sequence'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	changed = require('gulp-changed'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	fs = require('fs'),
	path = require('path'),
	glob = require('glob'),
	imagemin    = require('gulp-imagemin'),
	merge = require('merge-stream'),
	del = require('del'),
	package = require('./package.json');
	

var cfg = {
	src: './src',
	dev: 'dev',
	dist: 'dist',
	vendors: 'src/vendors',
	comp: 'components'
}

var banner = [
  '/*!\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

/***********************************************************/

gulp.task('clean:dev', function(cb){
	del(cfg.dev+'/*', cb);
});

gulp.task('clean:dist', function(cb){
	del(cfg.dist+'/*', cb);
});

gulp.task('clean:comps', function(cb){
	del([
		cfg.comp+'/*',
		'!'+cfg.comp+'/*.html'
	], cb);
});


gulp.task('html', function () {
	gulp.src(cfg.src+'/*.html')
	.pipe(changed(cfg.dev))
	.pipe(gulp.dest(cfg.dev));
});


// Import the whole directory with @import "somedir/all";
gulp.task('sass-includes', function (callback) {
	var all = '_all.scss';
	glob(cfg.src+'/scss/**/' + all, function (error, files) {
		files.forEach(function (allFile) {
			// Add a banner to warn users
			fs.writeFileSync(allFile, '/** This is a dynamically generated file **/\n\n');
			var directory = path.dirname(allFile);
			var partials = fs.readdirSync(directory).filter(function (file) {
				return (
					// Exclude the dynamically generated file
					file !== all &&
					// Only include _*.scss files
					path.basename(file).substring(0, 1) === '_' &&
					path.extname(file) === '.scss'
				);
			});

			// Append import statements for each partial
			partials.forEach(function (partial) {
				fs.appendFileSync(allFile, '@import "' + partial + '";\n');
			});
		});
	});
	callback();
});


gulp.task('css', ['sass-includes'], function () {
	
	gulp.src(cfg.src+'/scss/styles.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({
		includePaths: [ 
			cfg.vendors + '/bootstrap-sass-official/assets/stylesheets/'
		],
		errLogToConsole: true
	}))
	//.pipe(autoprefixer('last 4 version'))
	//.pipe(header(banner, { package : package }))
	.pipe(gulp.dest(cfg.dev+'/css'))
	.pipe(minifyCSS())
	.pipe(rename({ suffix: '.min' }))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(cfg.dev+'/css'));
	
});


gulp.task('js', function(){
  return gulp.src(cfg.src+'/js/scripts.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    //.pipe(header(banner, { package : package }))
    .pipe(gulp.dest(cfg.dev+'/js'))
    .pipe(uglify())
    //.pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(cfg.dev+'/js'));
});


gulp.task('fonts', function () {
    return gulp.src(cfg.src+'/fonts/*')
	.pipe(changed(cfg.dev+'/fonts'))
    .pipe(gulp.dest(cfg.dev+'/fonts'));
});



gulp.task('vendors', function(){

	return merge(

		//SCRIPTS
		gulp.src([
			cfg.vendors+'/jquery/dist/jquery.js',
			cfg.vendors+'/jQuery.mmenu/dist/js/jquery.mmenu.min.js'
		])
		.pipe(changed(cfg.dev+'/js'))
		.pipe(concat('vendors.js', {newLine: ';'}))
		.pipe(gulp.dest(cfg.dev+'/js/'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(cfg.dev+'/js/')),
		
		gulp.src([
			cfg.vendors+'/bootstrap/dist/css/bootstrap.css',
			cfg.vendors+'/jQuery.mmenu/dist/css/jquery.mmenu.css',
			cfg.vendors+'/jQuery.mmenu/dist/css/extensions/jquery.mmenu.themes.css'
		])
		.pipe(changed(cfg.dev+'/css'))
		.pipe(concat('vendors.css'))
		.pipe(gulp.dest(cfg.dev+'/css'))
		.pipe(minifyCSS())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(cfg.dev+'/css')),
	
	
		gulp.src([
			cfg.vendors+'/bootstrap/dist/fonts/*'
		])
		.pipe(changed(cfg.dev+'/fonts'))
		.pipe(gulp.dest(cfg.dev+'/fonts/')),
		
		gulp.src([
			cfg.vendors+'/html5shiv/dist/html5shiv.min.js'
		])
		.pipe(changed(cfg.dev+'/js'))
		.pipe(gulp.dest(cfg.dev+'/js'))
					
	); //Merge
});

gulp.task('extras', function() {
	return gulp.src([
		cfg.src+'/*.*',
		'!'+cfg.src+'/*.html'
	])
	.pipe(changed(cfg.dev))
	.pipe(gulp.dest(cfg.dev));
});

//compressing images & handle SVG files
gulp.task('images_optimize', function(tmp) {
    return gulp.src([
		cfg.src+'/images/*.jpg',
		cfg.src+'/images/*.png'
	])
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
	.pipe(gulp.dest(cfg.dev+'/images'));
});

//compressing images & handle SVG files
gulp.task('images', ['images_optimize'], function() {
    gulp.src(cfg.src+'/images/**/*')
    .pipe(gulp.dest(cfg.dev+'/images'));
});


gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: 'dev'
        }
    });
});


gulp.task('bs-reload', function () {
    browserSync.reload();
});


/*******************************
	DEV COMPONENTS
*******************************/
gulp.task('comps-css', ['css'], function () {
    return gulp.src(cfg.dev+'/css/*')
    .pipe(gulp.dest(cfg.comp+'/css'));
});

gulp.task('comps-js', ['js'], function () {
	return gulp.src(cfg.dev+'/js/*')
    .pipe(gulp.dest(cfg.comp+'/js'));
});

gulp.task('comps-images', ['images'], function () {	
	return gulp.src(cfg.dev+'/images/*')
    .pipe(gulp.dest(cfg.comp+'/images'));
});

gulp.task('comps-fonts', ['images'], function () {	
	return gulp.src(cfg.dev+'/fonts/*')
    .pipe(gulp.dest(cfg.comp+'/fonts'));
});

gulp.task('compsBrowser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: './components',
			directory: true
        }
    });
});


/*******************************
	BUILD
*******************************/
gulp.task('build:copyall', ['images'], function () {	
	return gulp.src(cfg.dev+'/**/*')
    .pipe(gulp.dest(cfg.dist));
});


/******************************************
	TASKS
*******************************************/

// DEV
gulp.task('default', ['clean:dev'], function(){
	
	run(['html', 'css', 'js', 'fonts', 'vendors', 'images', 'extras', 'browser-sync'], function(){
		
		gulp.watch(cfg.src+'/*.html', ['html']);
		gulp.watch(cfg.src+'/scss/*.scss', ['css']);
		gulp.watch(cfg.src+'/js/*', ['js']);
		gulp.watch(cfg.src+'/images/*', ['images']);
		
		gulp.watch([
			cfg.dev+'/*.html',
			cfg.dev+'/css/*',
			cfg.dev+'/js/*',
			cfg.dev+'/images/*'
		], ['bs-reload']);
		
	});

});

//COMPONENTS
gulp.task('comps', ['clean:comps'], function () {
	run(['css', 'js', 'fonts', 'vendors', 'images', 'extras', 'comps-css', 'comps-js', 'comps-images', 'comps-fonts', 'compsBrowser-sync'], function () {
		gulp.watch(cfg.src+'/scss/*.scss', ['css', 'comps-css', 'bs-reload']);
		gulp.watch(cfg.src+'/js/*', ['js', 'comps-js', 'bs-reload']);
		gulp.watch(cfg.src+'/images/*', ['images', 'comps-images', 'bs-reload']);
		
		gulp.watch([
			cfg.comp+'/*.html',
			cfg.comp+'/css/*',
			cfg.comp+'/js/*',
			cfg.comp+'/images/*'
		], ['bs-reload']);		
	});	
});

// BUILD
gulp.task('build', ['clean:dist'], function(){
	run(['html', 'css', 'js', 'fonts', 'vendors', 'images', 'extras', 'build:copyall']);
});
