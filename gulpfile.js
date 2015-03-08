"use strict";

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
    return gulp.src(['./src/odm.js', './src/util.js', './src/collection.js', './src/query.js'])
        .pipe(concat('json.odm.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./bin/'));
});