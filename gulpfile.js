"use strict";

var gulp = require('gulp'),
    jsdoc = require("gulp-jsdoc"),
    concat = require('gulp-concat'),
    filesize = require('gulp-filesize'),
    bench = require('gulp-bench'),
    karma = require('gulp-karma'),
    uglify = require('gulp-uglify');


var testNonMinifiedFiles = [
    'src/odm.js',
    'src/util.js',
    'src/*.js',
    'test/**/*.js'
];
var testMinifiedFiles = [
    'bin/*.js',
    'test/**/*.js'
];

gulp
    .task('default', ['test-minified','doc'] ,function () {})
    .task('build',['test-non-minified'], function() {
        return gulp.src(['./src/odm.js', './src/util.js', './src/geo.js', './src/collection.js', './src/query.js'])
            .pipe(filesize())
            .pipe(concat('json.odm.min.js'))
            .pipe(uglify())
            .pipe(filesize())
            .pipe(gulp.dest('./bin/')
        );
    })
    .task('test-non-minified', function () {
        return gulp.src(testNonMinifiedFiles)
            .pipe(karma({
                configFile: 'karma.conf.js',
                action: 'run'
            }))
            .on('error', function(err) {
                // Make sure failed tests cause gulp to exit non-zero
                throw err;
            });
    })
    .task('test-minified', ['build'], function () {
        return gulp.src(testMinifiedFiles)
            .pipe(karma({
                configFile: 'karma.conf.js',
                action: 'run'
            }))
            .on('error', function(err) {
                // Make sure failed tests cause gulp to exit non-zero
                throw err;
            });
    })
    .task('doc', function () {
        return gulp.src(['./src/*.js'])
            .pipe(jsdoc.parser({
                name:"jsonOdm",
                description:"A light weight but fast object document mapper for JavaScript objects.",
                version:"0.1.3"
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