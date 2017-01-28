/*********************
 * NODE DEPENDENCIES *
 *********************/
var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var del = require('del');
var fs = require('fs');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
// var templateCache = require('gulp-angular-templatecache');

/*******************
 * LOCAL VARIABLES *
 *******************/
// Directories
var dir = {};
dir.bower = 'bower_components/';
dir.client = 'client/';
dir.public = 'html/';
dir.shared = dir.client + 'shared/';
// Environment Switch (run as: NODE_ENV=production gulp)
var env = process.env.NODE_ENV || 'development';
// Destinations
var dest = {};
dest.css = dir.public + 'css';
dest.js = dir.public + 'js/build';
dest.jsLibs = dir.public + 'js/libs';
dest.views = dir.public + 'views';
dest.fonts = dir.public + 'fonts';
dest.imgs = dir.public + 'imgs';
// Source Files
var src = {};
src.js = [];
src.jsLibs = [];
src.jsLibsMin = [];
src.css = [];
src.fonts = [];
src.views = [];
src.imgs = [];
src.index = [];
// Finalized Files
var finalized = {};
finalized.js = '';
finalized.jsLibs = '';
finalized.css = '';
finalized.baseHTMLDev = '<base href="/twitter-markov/html/"/>';
finalized.baseHTMLProd = '<base href="/"/>';

/************************
 * SETTING SOURCE FILES *
 ************************/
// JS
src.js.push(dir.client + 'core/MarkovModule.js');
src.js.push(dir.client + 'core/Home/HomeController.js');
// JS Lib
src.jsLibs.push(dir.bower + 'angular/angular.js');
src.jsLibs.push(dir.bower + 'angular-animate/angular-animate.js');
src.jsLibs.push(dir.bower + 'angular-ui-router/release/angular-ui-router.js');
src.jsLibs.push(dir.bower + 'angular-strap/dist/angular-strap.js');
src.jsLibs.push(dir.bower + 'angular-strap/dist/angular-strap.tpl.js');
src.jsLibs.push(dir.bower + 'socket.io-client/dist/socket.io.js');
src.jsLibs.push(dir.bower + 'angular-socket-io/socket.js');

// JS Lib (Minified)
src.jsLibsMin.push(dir.bower + 'angular/angular.min.js');
src.jsLibsMin.push(dir.bower + 'angular-animate/angular-animate.min.js');
src.jsLibsMin.push(dir.bower + 'angular-ui-router/release/angular-ui-router.min.js');
src.jsLibsMin.push(dir.bower + 'angular-strap/dist/angular-strap.min.js');
src.jsLibsMin.push(dir.bower + 'angular-strap/dist/angular-strap.tpl.min.js');
src.jsLibsMin.push(dir.bower + 'socket.io-client/dist/socket.io.min.js');
src.jsLibsMin.push(dir.bower + 'angular-socket-io/socket.js/socket.min.js');
// CSS
src.css.push(dir.bower + 'bootstrap/dist/css/bootstrap.css');
src.css.push(dir.bower + 'bootstrap-additions/dist/bootstrap-additions.css')
src.css.push(dir.bower + 'components-font-awesome/css/font-awesome.css');
src.css.push(dir.bower + 'angular-motion/dist/angular-motion.css');
src.css.push(dir.client + 'assets/css/**/*.css');
// Fonts
src.fonts.push(dir.bower + 'components-font-awesome/fonts/fontawesome-webfont.*')
// Views
src.views.push(dir.client + 'core/Home/HomeView.html');
src.views.push(dir.client + 'core/Footer/FooterView.html');
// Images
src.imgs.push(dir.client + 'assets/imgs/**/*');
// Index
src.index.push(dir.client + 'core/index.html');

/******************
 * BUILDING TASKS *
 ******************/
//  Build JS
gulp.task('js', function () {
    // Clear production JS and JS Libs folders
    del.sync([dest.js + '/**/*', dest.jsLibs + '/**/*']);
    // Check if in development or not
    if ( env === 'development' ) {
        // DEVELOPMENT
        // Pipes all of the src JS files
        gulp.src(src.js)
            .pipe(gulp.dest(dest.js));
        // Iterate through and add to a finalized file
        for (var i = 0; i < src.js.length; i++) {
            var path = src.js[i];
            var beginIndex = path.lastIndexOf('/') + 1;
            var file = path.substring(beginIndex);
            finalized.js += '<script type=\'text/javascript\' src=\'js/build/' + file + '\'></script>';
        }

        // Pipes all of the lib JS files
        gulp.src(src.jsLibs).pipe(gulp.dest(dest.jsLibs));
        // Iterate through and add to a finalized file
        for (var i = 0; i < src.jsLibs.length; i++) {
            var path = src.jsLibs[i];
            var beginIndex = path.lastIndexOf('/') + 1;
            var file = path.substring(beginIndex);
            finalized.jsLibs += '<script type=\'text/javascript\' src=\'js/libs/' + file + '\'></script>';
        }
    } else {
        // PRODUCTION
        // concat and minify user define js, name it build.js, and copy to js/build folder
        gulp.src(src.js)
            .pipe(concat('build.js'))
            .pipe(uglify())
            .pipe(gulp.dest(dest.js));
        // Create the included build.js
        finalized.js = '<script type=\'text/javascript\' src=\'js/build/build.js\'></script>';
        // concat and minify js library from minify library source, name it libs.js, and copy to js/libs folder
        gulp.src(src.jsLibs)
            .pipe(concat('libs.js'))
            .pipe(gulp.dest(dest.jsLibs));
        // Create the included libraries
        finalized.jsLibs = '<script type="text/javascript" src="js/libs/libs.js"></script>';
    }
});

// Build Views
gulp.task('views', function() {
    // Clear production views
    del.sync(dest.views);
    // Copy over views to Production
    gulp.src(src.views)
        .pipe(gulp.dest(dest.views));
});

// Build CSS
gulp.task('css', function () {
    del.sync(dest.css)
    // copy css to public/css
    gulp.src(src.css).pipe(concat('style.css'))
        .pipe(gulp.dest(dest.css));
    finalized.css = '<link rel="stylesheet" type="text/css" href="css/style.css">';
});

// Build Fonts
gulp.task('fonts', function () {
    gulp.src(src.fonts)
        .pipe(gulp.dest(dest.fonts));
});

// Build Images
gulp.task('images', function () {
    if (env === 'development') {
        return gulp.src(src.imgs)
            .pipe(gulp.dest(dest.imgs));
    } else {
        return gulp.src(src.imgs)
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            }))
            .pipe(gulp.dest(dest.imgs));
    }
});

// Builds index with dependent JS and CSS files
gulp.task('index', function(){
    if (env === 'development') {
        gulp.src(src.index)
            .pipe( replace('<!--#INJECT-HTML-BASE#-->', finalized.baseHTMLDev) )
            .pipe( replace('<!--#INJECT-JS-LIBS#-->', finalized.jsLibs) )
            .pipe( replace('<!--#INJECT-JS#-->', finalized.js) )
            .pipe( replace('<!--#INJECT-CSS#-->', finalized.css) )
            .pipe( gulp.dest(dir.public) )
            .on('end', function(){
                finalized.jsLibs = '';
                finalized.js = '';
                finalized.css = '';
            });
    } else {
        gulp.src(src.index)
            .pipe( replace('<!--#INJECT-HTML-BASE#-->', finalized.baseHTMLProd) )
            .pipe( replace('<!--#INJECT-JS-LIBS#-->', finalized.jsLibs) )
            .pipe( replace('<!--#INJECT-JS#-->', finalized.js) )
            .pipe( replace('<!--#INJECT-CSS#-->', finalized.css) )
            .pipe( gulp.dest(dir.public) )
            .on('end', function(){
                finalized.jsLibs = '';
                finalized.js = '';
                finalized.css = '';
            });
    }

});


/*****************
 * WATCHER TASKS *
 *****************/
gulp.task('watch', function(){
    gulp.watch(src.js, ['js', 'css', 'index']);
    gulp.watch(src.index, ['js', 'css', 'index']);
    gulp.watch(src.views, ['views']);
    gulp.watch(src.css, ['js', 'css', 'index']);
});

// Default task
gulp.task('default', ['js', 'views', 'css', 'fonts', 'images', 'index', 'watch']);