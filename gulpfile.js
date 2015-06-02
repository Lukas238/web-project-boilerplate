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
	comp: 'components',
	wf: 'dev',
	directory: false	/* Default Working Folder */
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
	gulp.src(cfg.src+'/**/*.html')
	.pipe(changed(cfg.wf))
	.pipe(gulp.dest(cfg.wf));
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
	.pipe(gulp.dest(cfg.wf+'/css'))
	.pipe(minifyCSS({processImport: false}))
	.pipe(rename({ suffix: '.min' }))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(cfg.wf+'/css'));
	
});


gulp.task('js', function(){
  return gulp.src(cfg.src+'/js/scripts.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    //.pipe(header(banner, { package : package }))
    .pipe(gulp.dest(cfg.wf+'/js'))
    .pipe(uglify())
    //.pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(cfg.wf+'/js'));
});


gulp.task('fonts', function () {
    return gulp.src(cfg.src+'/fonts/*')
	.pipe(changed(cfg.wf+'/fonts'))
    .pipe(gulp.dest(cfg.wf+'/fonts'));
});



gulp.task('vendors', function(){

	return merge(

		//SCRIPTS
		gulp.src([
			cfg.vendors+'/jquery/dist/jquery.js',
			cfg.vendors+'/jQuery.mmenu/dist/js/jquery.mmenu.min.js'
		])
		.pipe(changed(cfg.wf+'/js'))
		.pipe(concat('vendors.js', {newLine: ';'}))
		.pipe(gulp.dest(cfg.wf+'/js/'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(cfg.wf+'/js/')),
		
		gulp.src([
			cfg.vendors+'/bootstrap/dist/css/bootstrap.css',
			cfg.vendors+'/jQuery.mmenu/dist/css/jquery.mmenu.css',
			cfg.vendors+'/jQuery.mmenu/dist/css/extensions/jquery.mmenu.themes.css'
		])
		.pipe(changed(cfg.wf+'/css'))
		.pipe(concat('vendors.css'))
		.pipe(gulp.dest(cfg.wf+'/css'))
		.pipe(minifyCSS({processImport: false}))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(cfg.wf+'/css')),
	
	
		gulp.src([
			cfg.vendors+'/bootstrap/dist/fonts/*'
		])
		.pipe(changed(cfg.wf+'/fonts'))
		.pipe(gulp.dest(cfg.wf+'/fonts/')),
		
		gulp.src([
			cfg.vendors+'/html5shiv/dist/html5shiv.min.js'
		])
		.pipe(changed(cfg.wf+'/js'))
		.pipe(gulp.dest(cfg.wf+'/js'))
					
	); //Merge
});

gulp.task('extras', function() {
	return gulp.src([
		cfg.src+'/*.*',
		'!'+cfg.src+'/*.html'
	])
	.pipe(changed(cfg.wf))
	.pipe(gulp.dest(cfg.wf));
});

//compressing images & handle SVG files
gulp.task('images_optimize', function(tmp) {
    return gulp.src([
		cfg.src+'/images/*.jpg',
		cfg.src+'/images/*.png'
	])
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
	.pipe(gulp.dest(cfg.wf+'/images'));
});

//compressing images & handle SVG files
gulp.task('images', ['images_optimize'], function() {
    gulp.src(cfg.src+'/images/**/*')
    .pipe(gulp.dest(cfg.wf+'/images'));
});


gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: cfg.wf,
			directory: cfg.directory
        }
    });
});


gulp.task('bs-reload', function () {
    browserSync.reload();
});


/******************************************
	TASKS
*******************************************/

// DEV
gulp.task('default', ['clean:dev'], function(){
	
	cfg.wf = cfg.dev;
	cfg.directory = false;
	
	run(['html', 'css', 'js', 'fonts', 'vendors', 'images', 'extras', 'browser-sync'], function(){
		
		gulp.watch(cfg.src+'/**/*.html', ['html']);
		gulp.watch(cfg.src+'/scss/**/*.scss', ['css']);
		gulp.watch(cfg.src+'/js/**/*', ['js']);
		gulp.watch(cfg.src+'/images/**/*', ['images']);
		
		gulp.watch([
			cfg.wf + '/**/.html',
			cfg.wf + '/css/**/*',
			cfg.wf + '/js/**/*',
			cfg.wf + '/images/**/*'
		], ['bs-reload']);
		
	});

});

//COMPONENTS
gulp.task('comps', ['clean:comps'], function () {
	
	cfg.wf = cfg.comp;
	cfg.directory = true;
	
	run(['css', 'js', 'fonts', 'vendors', 'images', 'extras', 'browser-sync'], function () {
		
		gulp.watch(cfg.src+'/scss/**/*.scss', ['css']);
		gulp.watch(cfg.src+'/js/*', ['js']);
		gulp.watch(cfg.src+'/images/**/*', ['images']);
		
		gulp.watch([
			cfg.wf + '/**/*.html',
			cfg.wf + '/css/**/*',
			cfg.wf + '/js/**/*',
			cfg.wf + '/images/**/'
		], ['bs-reload']);
		
	});	
});


// BUILD
gulp.task('build', ['clean:dist'], function(){
	cfg.wf = cfg.dist;
	
	run(['html', 'css', 'js', 'fonts', 'vendors', 'images', 'extras']);
});


