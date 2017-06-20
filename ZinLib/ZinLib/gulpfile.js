// declarations, dependencies
// ----------------------------------------------------------------------------
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    browserSync = require('browser-sync').create();

// sources to convert
// ----------------------------------------------------------------------------
var reactFiles = {
    path: [
        {
            from: 'Assets/js/ReactJS/Components/DanhMuc/table.jsx',
            to: 'DanhMuc/table.js'
        },
        {
            from: 'Assets/js/ReactJS/Components/DanhMuc/home.jsx',
            to: 'DanhMuc/home.js'
        }
    ],
    watchPath: 'Assets/js/ReactJS/Components/**/*.jsx',
    destPath: 'Assets/js/ReactJS/Compiled'
};

// Gulp tasks
// ----------------------------------------------------------------------------
gulp.task('default', ['rebuild', 'watch']);

gulp.task('rebuild', function () {
    var fileBuilt = 0;
    var isSuccess = true;
    var onError = function (err) {
        isSuccess = false;
        notify.onError({
            title: 'Thông báo',
            message: "Error: <%= error.message %>"
        })(err);
        gutil.log(err.codeFrame);
        this.emit('end');
    };
    browserSync.init({
        proxy: 'localhost:777',
    }, function () {
        // something you want to do
    });
    reactFiles.path.map(function (reactModuleEntry) {
        var appBundler = browserify(reactModuleEntry.from)
            .bundle()
            .on('error', onError)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(source(reactModuleEntry.to))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(reactFiles.destPath))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(notify(function () {
                fileBuilt++;
                if (isSuccess && fileBuilt === reactFiles.path.length - 1) {
                    //browserSync.reload();
                    return {
                        title: 'Thông báo',
                        message: 'Rebuild thành công'
                    };
                } else {
                    return false;
                }
            }));
    });
});

gulp.task('watch', function () {
    gulp.watch(reactFiles.watchPath, ['rebuild']);
});