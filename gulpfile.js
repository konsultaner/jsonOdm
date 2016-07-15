"use strict";

var gulp = require("gulp"),
    jsdoc = require("gulp-jsdoc3"),
    concat = require("gulp-concat"),
    bench = require("gulp-bench"),
    karmaServer = require('karma').Server,
    uglify = require("gulp-uglify");

gulp
    .task("default", ["test-minified","doc"] ,function () {})
    .task("build",["build-non-minified","test-non-minified"], function() {
        return gulp.src(["./bin/json.odm.js"])
            .pipe(concat("json.odm.min.js"))
            .pipe(uglify())
            .pipe(gulp.dest("./bin/")
        );
    })
    .task("build-non-minified", function() {
        return gulp.src(["./src/odm.js", "./src/util.js", "./src/geo.js", "./src/collection.js", "./src/query.js"])
            .pipe(concat("json.odm.js"))
            .pipe(gulp.dest("./bin/")
        );
    })
    .task("test-non-minified", function (done) {
        new karmaServer({
            configFile: __dirname + "/karma.conf.js",
            singleRun: true
        }, done).start();
    })
    .task("test-minified", ["build"], function (done) {
        new karmaServer({
            configFile: __dirname + "/karma.conf.min.js",
            singleRun: true
        }, done).start();
    })
    .task("doc", function () {
        return gulp.src(["./src/*.js"])
            .pipe(jsdoc());
    })
    .task("bench", function () {
        return gulp.src("./bench/*.js", {read: false})
            .pipe(bench())
            .pipe(gulp.dest("./docs/bench/"));  /* writes a results file to current folder */
    });