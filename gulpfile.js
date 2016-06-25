"use strict";

var gulp = require("gulp"),
    jsdoc = require("gulp-jsdoc"),
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
            .pipe(jsdoc.parser({
                name:"jsonOdm",
                description:"A light weight but fast object document mapper for JavaScript objects.",
                version:"0.2.1"
            }, "jsonOdm"))
            .pipe(jsdoc.generator("./doc",
                {
                    path: "./node_modules/jsdoc3-bootstrap"
                })
            );
    })
    .task("bench", function () {
        return gulp.src("./bench/*.js", {read: false})
            .pipe(bench())
            .pipe(gulp.dest("./doc/bench/"));  /* writes a results file to current folder */
    });