var fs = require('fs');     //file system
var gulp = require('gulp');
var babel = require('gulp-babel');
var gulpIf = require('gulp-if');
var watch = require('gulp-watch'); //watch files
var esLint = require('gulp-eslint'); //identifying and reporting on patterns found in JavaScript code
var uglify = require('gulp-uglify-cli');    //minify js
var cleanCSS = require('gulp-clean-css');   //minify css
var htmlmin = require('gulp-htmlmin');  //minify html
var concat = require('gulp-concat'); //combine files
var imagemin = require('gulp-imagemin'); //minify images
var compression = require('compression'); //gzip files
var historyApiFallback = require('connect-history-api-fallback'); //resolve html5Mode problem: refresh page will receive 404
var browserSync = require('browser-sync').create();
var _ = require('lodash');
var pathExists = require('path-exists');    //check file exist or not
// var lazypipe = require('lazypipe'); //create reusable pipelines
var constants = require('./environment/gulpConstants')(historyApiFallback, compression);

var lessCss = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({browsers: ["iOS >= 7","Android >= 4.1"]});

var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');

//argv parameters used by gulp tasks
//gulp serve: --no-open, --no-notify, --port
//gulp test: --no-singleRun, --browsers
//gulp ngController: --service, -s
//gulp ngDirective: --template, --t
//发布正式版: --release
//删除angular生成文件: --d, --delete
//定义文件路径: --path
//定义文件名称: --name
var argv = require('yargs').argv;


//使用eslint检查js代码
gulp.task('esLint', function() {
    var lintFiles = constants.js.src.concat(constants.js.test);

    lintFiles.map(function(value, index) {
        lintFiles[index] = value.replace('!', '');
    });

    return gulp.src(lintFiles)
        .pipe(esLint())
        .pipe(esLint.format())
        .pipe(esLint.failAfterError());
});

//生成dist文件夹
gulp.task('dist', ['less', 'style',  'font', 'img', 'html', 'index', 'js', 'json']);

gulp.task('style', function() {
    return gulp.src(constants.style.src)
        // .pipe(concat(constants.style.output))
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({ remove: false, browsers: ["iOS >= 7","Android >= 4.1"] }) ]))
        .pipe( sourcemaps.write('.') )
        .pipe( gulpIf(argv.release, cleanCSS(constants.minify.css)) )
        .pipe(gulp.dest(constants.basePath + constants.style.dest));
});

gulp.task('less', function() {
    console.log('less do ~~~~~~~~~~~~~~~~')
    return gulp.src(constants.less.src)
        .pipe( lessCss({plugins: [autoprefix]}))
        // .pipe(autoprefixer({remove: false}))
        .pipe(gulp.dest(constants.basePath + constants.less.dest));
});

gulp.task('font', function() {
    return gulp.src(constants.font.src)
        .pipe(gulp.dest(constants.basePath + constants.font.dest));
});

// gulp.task('package', function() {
//     return gulp.src(constants.package.src)
//         .pipe(gulp.dest(constants.basePath + constants.package.dest));
// });

gulp.task('img', function() {
    console.log(constants.image.src);
    return gulp.src(constants.image.src)
        // .pipe(gulpIf(argv.release, imagemin()))
        .pipe(gulp.dest(constants.basePath+ constants.image.dest));
});

gulp.task('html', function() {
    return gulp.src(constants.html.src)
        .pipe(htmlmin(constants.minify.html))
        .pipe(gulp.dest(constants.basePath + constants.html.dest));
});

gulp.task('index', function() {
    return gulp.src(constants.html.index)
        .pipe(htmlmin(constants.minify.html))
        .pipe(gulp.dest(constants.basePath));
});

gulp.task('js', function() {
    return gulp.src(constants.js.src)
        .pipe(gulpIf(argv.release, uglify(constants.minify.js)))
        .pipe(gulp.dest(constants.basePath + constants.js.dest));
});

gulp.task('json', function() {
    return gulp.src(constants.json.src)
        .pipe(gulp.dest(constants.basePath + constants.json.dest));
});

gulp.task('components', function() {
    return gulp.src(constants.components.src)
        .pipe(gulp.dest(function(file) {
            var isBabel = file.base.indexOf(constants.components.babel) >= 0;
            return constants.basePath + constants.components.dest + (isBabel ? constants.components.babel : '');
        }));
});

gulp.task('minifyComponents', ['components'], function() {
    return gulp.src(constants.components.minify)
        .pipe(uglify(constants.minify.js))
        .pipe(gulp.dest(function(file) {
            return file.base.replace(__dirname + '\\', '');
        }));
});

//定义监控事件
gulp.task('styleWatch', ['style'], function() {
    browserSync.reload();
});
gulp.task('lessWatch', ['less'], function() {
    browserSync.reload();
});
gulp.task('imgWatch', ['img'], function() {
    browserSync.reload();
});
gulp.task('fontWatch', ['font'], function() {
    browserSync.reload();
});
gulp.task('htmlWatch', ['html'], function() {
    browserSync.reload();
});
gulp.task('indexWatch', ['index'], function() {
    browserSync.reload();
});
gulp.task('jsWatch', ['js'], function() {
    browserSync.reload();
});
gulp.task('jsonWatch', ['json'], function() {
    browserSync.reload();
});
gulp.task('componentsWatch', ['components'], function() {
    browserSync.reload();
});

//在浏览器上运行
gulp.task('serve', [argv.release ? 'dist' : 'filesWatch'], function() {
    browserSync.init({
        server: constants.browser.server,
        host: constants.browser.host,
        port: argv.port || constants.browser.port,
        https: constants.browser.https,
        ghostMode: false,
        logPrefix: constants.browser.logPrefix,
        open: _.isUndefined(argv.open) ? true : argv.open,
        notify: false
    });
});

//监控服务
gulp.task('filesWatch', ['dist'], function() {
    watch(constants.style.src, function() {
        gulp.start('styleWatch');
    });
    watch(constants.less.src, function() {
        gulp.start('lessWatch');
    });
    watch(constants.image.src, function() {
        gulp.start('imgWatch');
    });
    watch(constants.font.src, function() {
        gulp.start('fontWatch');
    });
    watch(constants.html.src, function() {
        gulp.start('htmlWatch');
    });
    watch(constants.html.index, function() {
        gulp.start('indexWatch');
    });
    watch(constants.js.src, function() {
        gulp.start('jsWatch');
    });
    watch(constants.json.src, function() {
        gulp.start('jsonWatch');
    });
    watch(constants.components.src, function() {
        gulp.start('componentsWatch');
    });
});

//打包
gulp.task('build', ['dist'], function() {

});
