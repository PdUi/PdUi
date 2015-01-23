//C:\Users\peine\Desktop\a\Experiment\PdUI\PdUI

//npm install gulp
//npm install gulp-load-plugins
//npm install gulp-size
//npm install gulp-concat

//npm install gulp-sass
//npm install gulp-minify-css

//npm install gulp-jshint
//npm install jshint-stylish

//npm install gulp-uglify

//npm install gulp-minify-html

//npm install gulp-notify

//npm install gulp-jasmine

//npm install gulp-karma
//npm install karma-jasmine
//npm install karma-phantom-launcher

'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    config: {
        'dependencies': {
            'gulp-concat': '*',
            'gulp-jshint': '*',
            'gulp-minify-css': '*',
            'gulp-minify-html': '*',
            'gulp-notify': '*',
            //'gulp-sass': '*',
            'gulp-ruby-sass': '*',// -- need to install sass and ruby on machine first
            'gulp-size': '*',
            'gulp-uglify': '*',
            'jshint-stylish': '*',
            'gulp-jasmine': '*',
            'gulp-karma': '*'
        }
    },
    camelize: true
});

var jshintopts = {
    "camelcase": true,
    "curly": true,
    "eqeqeq": true,
    "forin": true,
    "globals": {
        "jQuery": true,
        "angular": true,
        "toastr": true,
        "breeze": true,
        "moment": true,
        "q": true
    },
    "immed": true,
    "indent": 4,
    "latedef": "nofunc",
    "newcap": true,
    "noarg": true,
    "nonew": true,
    "plusplus": false,
    "quotmark": "single",
    "undef": false,
    "unused": false,
    "strict": false,
    "maxparams": 10,
    "maxdepth": 4,
    "trailing": true,
    "maxlen": 120,
    "browser": true,
    "node": true,
    "expr": false,
    "validthis": true
};

gulp.task('bundlecss', function () {
    return gulp.src(['Content/app.scss'], { base: './' })
               .pipe(plugins.sass())
               .pipe(plugins.size({ showFiles: true }))
               .pipe(plugins.minifyCss())
               .pipe(plugins.concat("app.min.css"))
//             .pipe(plug.header(commentHeader))
               .pipe(gulp.dest('gulp_test/Styles/'))
               .pipe(plugins.size({ showFiles: true }));
})
    .task('jshint', function () {
        return gulp.src(['Scripts/Components/**/*.js'])
            .pipe(plugins.jshint(jshintopts))
            .pipe(plugins.jshint.reporter(plugins.jshintStylish));
        //.pipe(plugins.jshint.reporter('fail'));
    })
    //.task('test', function () {
    //    return gulp.src(['js_unit_tests/grid-tests.js'])
    //        .pipe(plugins.karma({
    //            configFile: 'js_unit_tests/karma-config.js',
    //            action: 'run'
    //        }))
    //        .on('error', function (err) {
    //            throw err;
    //        });
    //})
    //.task('jstest', function () {
    //    return gulp.src(['js_unit_tests/*'])
    //        .pipe(plugins.jasmine({ verbose: true, showStackTrace: true }));
    //})
    .task('minifyjs', ['jshint'], function () {
        return gulp.src(['Scripts/Components/**/*.js'], { base: './' })
                   .pipe(plugins.size({ showFiles: true }))
                   .pipe(plugins.uglify())
//                 .pipe(plug.header(commentHeader))
                   .pipe(gulp.dest('gulp_test/'))
                   .pipe(plugins.size({ showFiles: true }));
    })
    .task('bundlejs', ['minifyjs'], function () {
        return gulp.src(['gulp_test/Scripts/Components/**/*.js'])
                   .pipe(plugins.concat('app.min.js', { newLine: ';' }))
//                 .pipe(plug.header(commentHeader))
                   .pipe(gulp.dest('gulp_test/Scripts/'))
                   .pipe(plugins.size({ showFiles: true }));
    })
    .task('minifyhtml', function () {
        return gulp.src(['Scripts/Components/**/*.html'], { base: './' })
               .pipe(plugins.size({ showFiles: true }))
               .pipe(plugins.minifyHtml({ empty: true }))
//             .pipe(plug.header(commentHeader))
               .pipe(gulp.dest('gulp_test/'))
               .pipe(plugins.size({ showFiles: true }));

    })
    //.task('copyfiles', function () {
    //    return gulp.src(['Fonts/**/*.*', 'Web.config'], { base: './' })
    //               .pipe(gulp.dest('gulp_test/'));
    //})
    .task('default', ['bundlejs', 'bundlecss', 'minifyhtml'/*, 'copyfiles'*/], function () {
        return gulp.src('')
            .pipe(plugins.notify({
                onLast: true,
                message: "linted, bundled, and images compressed!"
            }));
    });
//preBuild, postBuild

/* example from john papa: https://github.com/johnpapa/ng-demos/blob/master/grunt-gulp/build-gulp/gulpfile.js

* Create comments for minified files
var commentHeader = common.createComments(gutil);
/*
* Could use a product/development switch.
* Run `gulp --production`
var type = gutil.env.production ? 'production' : 'development';
gutil.log('Building for', gutil.colors.magenta(type));
gutil.beep();

/*
* Compress images
gulp.task('images', function () {
    return gulp.src(pkg.paths.source.images)
    .pipe(plug.cache(plug.imagemin({ optimizationLevel: 3 })))
    .pipe(gulp.dest(pkg.paths.dest.images));
});

/*
* Remove all files from the output folder
gulp.task('cleanOutput', function () {
    return gulp.src([
    pkg.paths.dest.base,
    pkg.paths.production])
    .pipe(plug.clean({ force: true }))
});
/*
* Watch file and re-run the linter
gulp.task('build-watcher', function () {
    var jsWatcher = gulp.watch(pkg.paths.source.js, ['jshint']);
    /*
    * Rebuild when any files changes
    // gulp.watch([pkg.paths.source.css,
    // pkg.paths.source.js,
    // pkg.paths.source.images], ['default']);
    jsWatcher.on('change', function (event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
*/