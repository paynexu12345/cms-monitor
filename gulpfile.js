const { series, src, dest, watch, parallel } = require("gulp");
var lessc = require("gulp-less");
var browserSync = require("browser-sync");
var concat = require("gulp-concat");

function compileLess() 
{
    return src(["src/less/*.less"])
        .pipe(lessc())
        .pipe(dest("dist/css"));
}

function concatCss()
{
    return src(["dist/font/font.css","dist/css/reset.css", "dist/css/layout.css", "dist/css/dashboard.css"])
        .pipe(concat("main.css"))
        .pipe(dest("dist/css"));
}

function concatJs()
{
    return src(["src/js/ext/*.js"])
    .pipe(concat("main.js"))
    .pipe(dest("dist/js"));
}

function copyFont()
{
    return src(["src/font/**/*"]).pipe(dest("dist/font"))
}

function copyHtml()
{
    return src(["src/index.html"]).pipe(dest("dist"))
}

function watchAll()
{
    watch("src/less/*.less", parallel(compileLess, concatCss, copyFont, copyHtml, concatJs, browserSync.reload, watchAll));
    watch(["*.js", "src/**/*.html"], parallel(copyHtml, concatJs, browserSync.reload, watchAll));
}

function serve() 
{
    watchAll();
    return browserSync({
        server: {
            baseDir: "dist"
        }
    });
}
exports.serve = series(compileLess, concatCss, copyFont, copyHtml, concatJs, serve);