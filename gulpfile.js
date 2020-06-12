const { series, src, dest, watch, parallel } = require("gulp");
var gulpless = require("gulp-less");
var browserSync = require("browser-sync");
var concat = require("gulp-concat");

function lessc() 
{
    return src(["src/less/*.less"])
        .pipe(gulpless())
        .pipe(dest("src/css"));
}

function concatCss()
{
    return src(["src/css/*.css"])
        .pipe(concat())
        .pipe(dest("src/dist/css"));
}

function watchAll()
{
    watch("src/less/*.less", parallel(lessc, concatCss, browserSync.reload, watchAll));
    watch(["*.js", "*.html"], parallel(browserSync.reload, watchAll));
}

function serve() 
{
    watchAll();
    return browserSync({
        server: {
            baseDir: "src"
        }
    });
}
exports.serve = series(lessc, concatCss, serve);