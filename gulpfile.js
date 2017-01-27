var gulp = require("gulp");
var htmlMin = require("gulp-htmlmin");
var concat = require("gulp-concat");
var cssConcat = require("gulp-concat-css");
var cleanCSS = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var pump = require("pump");


var cssPaths = [
  "./css/codemirror.css",
  "./css/monokai.css",
  "./css/main.css"
];

var jsPaths = [
  "./libs/codemirror.js",
  "./libs/xml.js",
  "./libs/css.js",
  "./libs/javascript.js",
  "./js/helpers.js",
  "./js/app.js"
];


gulp.task("html", function() {
  return gulp.src("./dist/index.html")
         .pipe(htmlMin({collapseWhitespace: true}))
         .pipe(gulp.dest("dist"));
});


gulp.task("css", function() {
  return gulp.src(cssPaths)
        .pipe(cssConcat("css/bundle.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest("dist"));
});

gulp.task("scripts", function() {
  return gulp.src(jsPaths)
        .pipe(concat("bundle.js"))
        .pipe(gulp.dest("./dist/"));
});


gulp.task("compress", function(cb) {
  pump([
    gulp.src("./dist/bundle.js"),
    uglify(),
    gulp.dest("dist")
  ], cb);
});

gulp.task("default", ["scripts", "compress", "css"]);
