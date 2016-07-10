var path = require('path');

var bootstrapDir = path.join(__dirname, 'node_modules', 'bootstrap');
    sourceRoot = path.join(__dirname, 'src')
    webRoot = path.join(__dirname, 'web');

var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps');

process.argv.slice(2).forEach(function (arg) {
    if (arg === 'build') {
        console.log('set NODE_ENV to production');
        process.env.NODE_ENV = 'production';
    }
});

gulp.task('browserify', ['ts'], function () {
    var babelify = require('babelify'),
        browserify = require('browserify'),
        source = require('vinyl-source-stream');

    return browserify(path.join(sourceRoot, 'main.js'), { debug: true, standalone: 'soundboard' })
      .transform(babelify, {presets: ['es2015', 'react']})
      .bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest(path.join(webRoot, 'js')));
});

gulp.task('copy', function () {
    return gulp
        .src(path.join(bootstrapDir, 'fonts', '*'))
        .pipe(gulp.dest(path.join(webRoot, 'fonts')));
});

gulp.task('less', function () {
  var less = require('gulp-less'),
      LessPluginAutoPrefix = require('less-plugin-autoprefix'),
      autoprefixPlugin = new LessPluginAutoPrefix({browsers: ['last 2 versions']});

  return gulp
    .src(path.join(__dirname, 'less', 'site.less'))
    .pipe(sourcemaps.init())
    .pipe(less({ paths: [path.join(bootstrapDir, 'less')], plugins: [autoprefixPlugin] }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(webRoot, 'css')))
});

gulp.task('minify:css', ['less'], function () {
    var cleanCSS = require('gulp-clean-css');

    return gulp
        .src(path.join(webRoot, 'css', 'site.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.join(webRoot, 'css')));
});

gulp.task('minify:js', ['browserify'], function () {
    var uglify = require('gulp-uglify');

    return gulp
        .src(path.join(webRoot, 'js', 'app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.join(webRoot, 'js')));
});

gulp.task('ts', function () {
    var ts = require('gulp-typescript'),
        tsProject = ts.createProject(path.join(__dirname, 'tsconfig.json'));

    return tsProject
      .src()
      .pipe(sourcemaps.init())
      .pipe(ts(tsProject))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(__dirname));
});

gulp.task('build', ['copy', 'minify:css', 'minify:js']);
gulp.task('default', ['browserify', 'copy', 'less']);
