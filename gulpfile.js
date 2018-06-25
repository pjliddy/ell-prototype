'use strict'

/*
 *  Required Gulp Packages
 */

// default gulp package
const gulp = require('gulp')

// gulp server packages
const browserSync = require('browser-sync').create()

// gulp compile packages
const minifyHTML = require('gulp-minify-html')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const babel = require("gulp-babel")
const uglify = require('gulp-uglify')


// gulp utilities
const concat = require('gulp-concat')
const util = require('gulp-util')
const rename = require("gulp-rename")
// const changed = require('gulp-changed')


/*
 *  Variable Declarations
 */

const dist = 'dist'
const distDest = dist + '/'

const htmlSrc = '*.html'
const htmlDest = distDest

const hbsSrc = 'js/templates/*.hbs'
const hbsDest = distDest + 'js/templates/'

const dataSrc = 'data/*.json'
const dataDest = distDest + 'data/'
const dataWatch = dataDest + '*.json'

const sassWatch = 'scss/*.scss'
const sassSrc = 'scss/styles.scss'
const sassDest = 'css/'
const sassOutput = 'styles.css'

const cssSrc = sassDest + '*.css'
const cssDest = distDest + 'css/'

const jsSrc = 'js/**/*.js'
const jsDest = distDest + 'js/'

// const imgSrc = ['img/*.png', 'img/*.jpg', 'img/*.gif']
// const imgDest = distDest + 'img/'
const vendorSrc = 'vendor/**/*'
const vendorDest = distDest + 'vendor/'

/*
 *  Global Tasks
 */

// Run everything
gulp.task('default', [
  'minify-html',
  'minify-handlebars',
  'sass',
  'minify-css',
  'uglify-js',
  // 'copy-images',
  'copy-data',
  'copy-vendor',
  'copy-fonts'

])

// Run development server task with browserSync locally on port 3000
gulp.task('serve', ['browserSync', 'default'], function() {
  // run gulp tasks when source files change
  gulp.watch(htmlSrc, ['minify-html'])
  gulp.watch(hbsSrc, ['minify-handlebars'])

  // gulp.watch(hbsSrc, ['compile-handlebars'])
  gulp.watch(sassWatch, ['minify-css'])
  gulp.watch(jsSrc, ['uglify-js'])
  // gulp.watch(imgSrc, ['copy-images'])
  gulp.watch(vendorSrc, ['copy-vendor'])
  gulp.watch(dataSrc, ['copy-data'])

  // Reload the browser whenever files change
  gulp.watch(htmlDest, browserSync.reload)
  gulp.watch(hbsDest, browserSync.reload)
  gulp.watch(jsDest, browserSync.reload)
  gulp.watch(vendorDest, browserSync.reload)
  gulp.watch(cssDest, browserSync.reload)
  gulp.watch(dataWatch, browserSync.reload)
})

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: dist
    },
  })
})

/*
 *  Compile & Minify Tasks
 */

 // use minifyHTML to minify html and handlebars files
function minifyHtmlFiles(src, dest) {
  return gulp.src(src)
    .pipe(minifyHTML({
      conditionals: true,
      spare: true
    }))
    // .pipe(changed(dest))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({
      stream: true
    }))
}

// Minify html to dist/
gulp.task('minify-html', function() {
  return minifyHtmlFiles(htmlSrc, htmlDest)
})

// Minify handlebars to dist/
 gulp.task('minify-handlebars', function() {
   return minifyHtmlFiles(hbsSrc, hbsDest)
 })

// Compile SCSS files from to css/
gulp.task('sass', function() {
  return gulp.src(sassSrc)
    .pipe(sass())
    .pipe(concat(sassOutput))
    // .pipe(changed(sassDest))
    .pipe(gulp.dest(sassDest))
})

// Minify compiled CSS to dist
gulp.task('minify-css', ['sass'], function() {
  return gulp.src(['css/*.css', '!css/*.min.css'])
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    // .pipe(changed(cssDest))
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.reload({
      stream: true
    }))
})

// Minify JS to dist/
gulp.task('uglify-js', function() {
  return gulp.src(jsSrc)
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify().on('error', util.log))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(jsDest))
    .pipe(browserSync.reload({
      stream: true
    }))
})


// Deploy vendor directory to dist/
gulp.task('deploy-vendor', function() {
  return copy(vendorSrc, vendorDest)
})

// copy fonts to dist/
gulp.task('copy-fonts', function() {
  return copy('vendor/bootstrap/fonts/*.*', 'dist/fonts/bootstrap')
})

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy-vendor', function() {
  gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
    .pipe(gulp.dest('vendor/bootstrap'))

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('vendor/jquery'))

  gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    .pipe(gulp.dest('vendor/font-awesome'))

  gulp.src([
      'node_modules/handlebars/**/*'
    ])
    .pipe(gulp.dest('vendor/handlebars'))

  return copy(vendorSrc, vendorDest)
})

/*
 *  File Copy Tasks
 */

// Copy task
function copy(src, dest) {
  return gulp.src(src)
    .pipe(gulp.dest(dest))
}

// Copy images to dist/
gulp.task('copy-data', function() {
  return copy(dataSrc, dataDest)
})

// Copy images to dist/
gulp.task('copy-images', function() {
  return copy(imgSrc, imgDest)
})
