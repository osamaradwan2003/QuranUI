var gulp = require("gulp"),
    prefix = require("gulp-autoprefixer"),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    pug = require('gulp-pug'),
    server = require('gulp-server-livereload'),
    sourcemap = require("gulp-sourcemaps"),
    minify = require("gulp-minify");





gulp.task("webserver", function () {
    return gulp.src(".")
        .pipe(server({
            livereload: {
                enable: true,
                filter: function (filePath, cb) {
                    cb(!(/node_modules/.test(filePath)));
                }
            },
            directoryListing: false,
            open: true,
            defaultFile: './dist/index.html'
        }));
});

gulp.task("html", function () {
    return gulp.src("./stage/html/*.pug")
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest("./dist"));

});

gulp.task("css", function () {
    return gulp.src(["./stage/css/**/*.scss", "./stage/css/**/*.css"])
        .pipe(sourcemap.init())
        .pipe(sass({
            outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(prefix())
        .pipe(concat("app.css"))
        .pipe(sourcemap.write("."))
        .pipe(minify())
        .pipe(gulp.dest("./dist/css/"));
});


gulp.task("js", function () {

    return gulp.src("./stage/js/**/*.js")
        .pipe(sourcemap.init())
        .pipe(sourcemap.write("."))
        .pipe(minify())
        .pipe(gulp.dest("./dist/js/"));

});


gulp.task("watch", function () {
    gulp.watch("./stage/html/**/*.pug", gulp.series("html"));
    gulp.watch(["./stage/css/**/*.scss", "./stage/css/**/*.css"], gulp.series("css"));
    gulp.watch("./stage/js/**/*.js", gulp.series("js"));
});

gulp.task("default", gulp.parallel("watch"));