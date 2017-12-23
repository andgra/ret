let gulp = require('gulp');
let pug = require('gulp-pug');
let del = require('del');
let sass = require('gulp-sass');
let minifyCSS = require('gulp-csso');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
let imagemin = require('gulp-imagemin');
let pump = require('pump');
let babel = require('gulp-babel');
let VueModule = require('gulp-vue-module');
let rename = require('gulp-rename');

scripts = {
    "gulp clean": "gulp clean",
    "gulp build": "gulp build",
    "gulp watch": "gulp"
};

pckg = {
    "gulp": "^3.9.1",
    "gulp-babel": "^7.0.0",
    "gulp-concat": "^2.6.1",
    "gulp-csso": "^3.0.0",
    "gulp-data": "^1.2.1",
    "gulp-imagemin": "^3.4.0",
    "gulp-pug": "^3.3.0",
    "gulp-pug2": "0.0.2",
    "gulp-rename": "^1.2.2",
    "gulp-sass": "^3.1.0",
    "gulp-sourcemaps": "^2.6.1",
    "gulp-uglify": "^3.0.0",
    "gulp-vue-module": "^0.1.3",
    "pump": "^1.0.3",
    "del": "^3.0.0"
};

function swallowError (error) {

    // If you want details of the error in the console
    console.error(error.toString())

    this.emit('end')
}

gulp.task('uglify', function (cb) {
    pump([
        gulp.src('src/js/**/*.js'),
        uglify(),
        gulp.dest('public/js')
    ], cb);
});

gulp.task('watch', function(){
    gulp.watch('src/views/**/*.pug', ['pug']);
    gulp.watch('src/**/*.vue', ['vue']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/img/**/*', ['img']);
});
gulp.task('clean', function(){
    return del('public/**', {force:true});
});

gulp.task('pug', function(){
    /*gulp.src(['src/views/!**!/__*.pug'])
        .pipe(pug({client: true, name: 'temp123456(){};\n\nmodule.exports = function'}))
        .pipe(gulp.dest('public/js'));
    return gulp.src(['src/views/!**!/!*.pug', '!src/views/!**!/_*.pug'])
        .pipe(pug())
        .pipe(gulp.dest('public'));*/
});

gulp.task('vue', function() {
    return gulp.src('src/js/components/**/*.vue')
        .pipe(VueModule({
            debug : true,
            define: false,
            // templateReplaceTag: '__component_template__'
        }))
        .on('error', swallowError)
        .pipe(rename({extname : ".js"}))
        .pipe(gulp.dest("public/js/components"));
});

gulp.task('html', function(){
    return gulp.src(['src/**/*.html'])
        .pipe(gulp.dest('public'));
});

gulp.task('sass', function(){
    return gulp.src('src/sass/**/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass())
            .on('error', swallowError)
            .pipe(concat('all.min.css'))
            .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
});

gulp.task('js', function(){
    return gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init())
            .pipe(babel({
                presets: ['es2015']
            }))
            .on('error', swallowError)
            .pipe(uglify())
            .on('error', swallowError)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'))
});

gulp.task('img', function(){
    return gulp.src('src/img/**/*')
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('public/img'))
});

gulp.task('default', [ 'build', 'watch']);
gulp.task('build', [ 'pug', 'vue', 'html', 'sass', 'js', 'img']);