module.exports = function(historyApiFallback, compression) {
    var root = '/';
    var gulpConstants = {
        basePath: 'dist/',
        generator: {
            basePath: '/',
            fileOptions: {
                flag: 'wx'
            }
        },
        style: {
            src: 'www/src/**/*.css',
            output: 'main.css',
            dest: root
        },
        package: {
            src: 'package.json',
            output: 'package.json',
            dest: root
        },
        less: {
            src: 'www/src/**/*.less',
            dest: root
        },
        image: {
            src: ['www/src/**/*.png', 'www/src/**/*.jpg', 'www/src/**/*.gif'],
            dest: root
        },
        font: {
            src: 'www/font/*.*',
            dest: 'font'
        },
        html: {
            index: 'www/index.html',
            src: ['www/src/**/*.html'],
            dest: root
        },
        json: {
            src: ['www/json/*.json', 'www/json/**/*.json'],
            dest: 'json'
        },
        js: {
            src: ['www/src/*.js', 'www/src/**/*.js'],
            test: 'www/test/*.js',
            dest: root
        },
        components: {
            src: ['www/lib/**', 'node_modules/babel-polyfill/**'],
            dest: 'lib/',
            babel: 'babel-polyfill',
            minify: ['dist/lib/domReady/domReady.js', 'dist/lib/requirejs/require.js']
        },
        browser: {
            server: {
                baseDir: 'dist',
                middleware: [compression()]
            },
            host: 'localhost',
            port: 3003,
            https: undefined,
            logPrefix: 'BS'
        },
        minify: {
            js: '--keep-fnames',
            html: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeComments: true,
                minifyJS: {
                    mangle: {
                        toplevel: true
                    }
                },
                minifyCSS: true
            },
            css: {
                compatibility: 'ie8',
                keepSpecialComments: 0
            }
        }
    };
    return gulpConstants;
};