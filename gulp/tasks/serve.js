'use strict';

var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('../config')();
var log = require('../util/log');
var port = process.env.PORT || config.defaultPort;
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var modRewrite = require('connect-modrewrite');

var $ = require('gulp-load-plugins')({lazy: true});

/**
 * serve the dev environment
 * --nosync
 */
gulp.task('serve-dev', ['inject'], function () {
    serve(true /*isDev*/);
});

/**
 * serve the dist environment
 * --nosync
 */
gulp.task('serve-dist', ['optimize'], function () {
    global.isProd = true;
    serve(false /*isDev*/);
});

/**
 * Optimize the code and re-load browserSync
 */
gulp.task('browserSyncReload', ['optimize'], browserSync.reload);

/**
 * serve the code
 * @param  {Boolean} isDev - dev or dist mode
 */
function serve(isDev) {
    var debugMode = '--debug';
    var nodeOptions = getNodeOptions(isDev);

    nodeOptions.nodeArgs = [debugMode + '=5858'];
    
    if (args.verbose) {
        console.log(nodeOptions);
    }

    return $.nodemon(nodeOptions)
        .on('restart', ['lint'], function (ev) {
            log.message('*** nodemon restarted');
            log.message('files changed:\n' + ev);
            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log.message('*** nodemon started');
            startBrowserSync(isDev);
        })
        .on('crash', function () {
            log.message('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log.message('*** nodemon exited cleanly');
        });
}

function getNodeOptions(isDev) {
    return {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'dist'
        },
        watch: [config.server]
    };
}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev) {
    if (args.nosync || browserSync.active) {
        return;
    }

    console.log('Starting BrowserSync on port ' + port);

    // If dist: watches the files, builds, and restarts browser-sync.
    // If dev: watches files, browser-sync handles reload
    if (isDev) {
        gulp.watch([config.watchFiles], ['styles'])
            .on('change', log.fileEvent);
    } else {
        gulp.watch([config.watchFiles], ['browserSyncReload'])
            .on('change', log.fileEvent);
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: isDev ? [
            config.client + '**/*.*',
            config.temp + '**/*.*'
        ] : [],
        watchOptions: {
            ignored: ['node_modules', 'bower_components']
        },
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'info',
        logPrefix: 'eatmeup',
        notify: true,
        reloadDelay: 0 //1000
    };

    browserSync(options);
}

/**
 * serve the code
 * @param  {Boolean} isDev - dev or build mode
 */
// module.exports = function (isDev) {
//     var logText = '';
//     var baseDir = '';

//     if (isDev) {
//         logText = 'serving the dev environment';
//         baseDir = './';
//     } else {
//         logText = 'serving the dist environment';
//         baseDir = './dist';
//     }

//     log.message('Starting BrowserSync on port 3000 ' + logText);

//     browserSync({
//         port: '3000',
//         server: {
//             baseDir: baseDir,
//             middleware: [
//                 modRewrite([
//                     '!\\.\\w+$ /index.html [L]'
//                 ])
//             ]
//         }
//     });

// };