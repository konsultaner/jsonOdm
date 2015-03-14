"use strict";

var gulp = require('gulp'),
    jsdoc = require("gulp-jsdoc"),
    concat = require('gulp-concat'),
    filesize = require('gulp-filesize'),
    bench = require('gulp-bench'),
    uglify = require('gulp-uglify');

gulp
    .task('default', ['build','doc'] ,function () {})
    .task('build', function() {
        return gulp.src(['./src/odm.js', './src/util.js', './src/geo.js', './src/collection.js', './src/query.js'])
            .pipe(filesize())
            .pipe(concat('json.odm.min.js'))
            .pipe(uglify())
            .pipe(filesize())
            .pipe(gulp.dest('./bin/')
        );
    })
    .task('doc', function () {
        return gulp.src(['./src/*.js'])
            .pipe(jsdoc.parser({
                name:"jsonOdm",
                description:"A light weight but fast object document mapper for JavaScript objects.",
                version:"0.0.2"
            }, "jsonOdm"))
            .pipe(jsdoc.generator('./doc',
                {
                    path: './node_modules/jsdoc3-bootstrap'
                })
            );
    })
    .task('bench', function () {
        return gulp.src('./bench/*.js', {read: false})
            .pipe(bench())
            .pipe(gulp.dest('./doc/bench/'));  /* writes a results file to current folder */
    });