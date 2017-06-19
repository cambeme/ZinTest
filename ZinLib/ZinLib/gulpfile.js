// declarations, dependencies
// ----------------------------------------------------------------------------
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var notifier = require('node-notifier');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
    'react',
    'react-dom'
];

// Gulp tasks
// ----------------------------------------------------------------------------
gulp.task('scripts', function () {
    bundleApp(true);
});

gulp.task('deploy', function () {
    bundleApp(true);
});

gulp.task('watch', function () {
    gulp.watch([
        './Assets/js/ReactJS/Components/**/*.js'
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
            from: ['Assets/js/ReactJS/Components/DanhMuc/table.js'],
            to: 'DanhMuc/table.js'
        },
        {
            from: ['Assets/js/ReactJS/Components/DanhMuc/home.js'],
            to: 'DanhMuc/home.js'
        }
    ],
    watchPath: ['Assets/js/*.js']
};

// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(isProduction) {
    // Browserify will bundle all our js files together in to one and will let
    // us use modules in the front end.
    var finished = 0;
    reactFiles.path.map(function (reactModuleEntry) {
        var appBundler = browserify(reactModuleEntry.from)
            .transform(babelify, { presets: ['es2015', 'react'] })
            .bundle();

        appBundler.pipe(source(reactModuleEntry.to))
            .pipe(gulp.dest('./Assets/js/ReactJS/Compiled'))
            .on('finish', function () {
                finished++;
                if (finished === reactFiles.path.length - 1) {
                    notify('Reactify', 'Build thành công');
                    //done();
                }
            });
    });

}