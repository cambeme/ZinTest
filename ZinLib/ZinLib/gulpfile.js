// declarations, dependencies
// ----------------------------------------------------------------------------
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var browserifyshim = require('browserify-shim');
var notifier = require('node-notifier');

// Gulp tasks
// ----------------------------------------------------------------------------
gulp.task('scripts', function () {
    bundleApp();
});

gulp.task('deploy', function () {
    bundleApp();
});

gulp.task('watch', function () {
    gulp.watch([
        './Assets/js/ReactJS/Components/**/*.jsx'
    ], ['scripts']);
});


var notify = function (title, message) {
    notifier.notify({
        title: title,
        message: message
    });
    gutil.log(title + ': ' + message);
};

// When running 'gulp' on the terminal this task will fire.
// It will start watching for changes in every .js file.
// If there's a change, the task 'scripts' defined above will fire.
gulp.task('default', ['scripts', 'watch']);

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

// Private Functions
// ----------------------------------------------------------------------------
function bundleApp() {
    // Browserify will bundle all our js files together in to one and will let
    // us use modules in the front end.
    var finished = 0;
    reactFiles.path.map(function (reactModuleEntry) {
        var appBundler = browserify(reactModuleEntry.from)
            .transform(babelify, { presets: ['es2015', 'react'] })
            .transform(browserifyshim)
            .bundle()
            .pipe(source(reactModuleEntry.to))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest('./Assets/js/ReactJS/Compiled'))
            .on('finish', function () {
                finished++;
                if (finished === reactFiles.path.length - 1) {
                    notify('React', 'Build thành công');
                }
            })
            .on('error', function (err) {
                notify('React', 'Build thất bại: ' + err.toString());
            });
    });
}