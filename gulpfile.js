const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass',  () => {
    return gulp.src('./dev/assets/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/css'));
});

gulp.task('sass:watch',  () => {
    gulp.watch('./dev/assets/*.scss', ['sass']);
});