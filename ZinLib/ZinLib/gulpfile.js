// declarations, dependencies
// ----------------------------------------------------------------------------
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');

var reactFiles = {
    path: [
        {
            from: ['Assets/js/ReactJS/Components/DanhMuc/table.jsx'],
            to: 'DanhMuc/table.js'
        },
        {
            from: ['Assets/js/ReactJS/Components/DanhMuc/home.jsx'],
            to: 'DanhMuc/home.js'
        }
    ],
    watchPath: ['Assets/js/ReactJS/Components/**/*.jsx']
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
            message: "Error: <%= error.message %>",
        })(err);
        gutil.log(err.codeFrame);
        this.emit('end');
    };
    reactFiles.path.map(function (reactModuleEntry) {
        var appBundler = browserify(reactModuleEntry.from)
            .bundle()
            .on('error', onError)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(source(reactModuleEntry.to))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(notify(function (f) {
                fileBuilt++;
                return (isSuccess && fileBuilt === reactFiles.path.length - 1) ? {
                    title:'Thông báo',
                    message: 'Rebuild thành công'
                } : false;
            }))
            .pipe(gulp.dest('./Assets/js/ReactJS/Compiled'));
    });
});

gulp.task('watch', function () {
    gulp.watch(reactFiles.watchPath, ['rebuild']);
});