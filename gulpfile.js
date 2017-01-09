var gulp = require("gulp");
var concat = require("gulp-concat");
var cssConcat = require("gulp-concat-css");
var uglify = require("gulp-uglify");
var pump = require("pump");

var jsPaths = [
  "./libs/codemirror.js",
  "./libs/xml.js",
  "./libs/css.js",
  "./libs/javascript.js",
  "./js/helpers.js",
  "./js/app.js"
];

var cssPaths = [
  "./css/codemirror.css",
  "./css/neo.css",
  "./css/main.css"
];

gulp.task("scripts", function() {
  return gulp.src(jsPaths)
        .pipe(concat("app.js"))
        .pipe(gulp.dest("./dist/"));
});

gulp.task("css", function() {
  return gulp.src(cssPaths)
        .pipe(cssConcat("css/bundle.css"))
        .pipe(gulp.dest("dist"));
});

gulp.task("compress", function(cb) {
  pump([
    gulp.src("./dist/app.js"),
    uglify(),
    gulp.dest("dist")
  ],
  cb
  );
});

gulp.task("default", ["scripts", "compress", "css"]);
