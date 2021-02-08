const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
 
gulp.task('default', function () {
    return gulp.src('./projects/question-editor-library/src/lib/assets/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./projects/question-editor-library/src/lib/assets'));
});