'use strict'

/*
 *  Required Gulp Packages
 */

// default gulp package
const gulp = require('gulp')

// gulp utilities
const concat = require('gulp-concat')
const util = require('gulp-util')
const rename = require("gulp-rename")
const changed = require('gulp-changed')

// gulp compile packages
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const minifyHTML = require('gulp-minify-html')
const babel = require("gulp-babel")
const uglify = require('gulp-uglify')

// gulp server packages
const browserSync = require('browser-sync').create()

/*
 *  Variable Declarations
 */

const distDest = 'dist/'

const htmlSrc = '*.html'
const htmlDest = distDest

const hbsSrc = 'js/templates/*.hbs'
const hbsDest = distDest + 'js/templates/'

const sassWatch = 'scss/*.scss'
const sassSrc = 'scss/styles.scss'
const sassDest = 'css/'
const sassOutput = 'styles.css'

const cssSrc = sassDest + '*.css'
const cssDest = 'dist/css'

const jsSrc = 'js/**/*.js'
const jsDest = './dist/js'

const imgSrc = ['img/*.png', 'img/*.jpg', 'img/*.gif']
const imgDest = distDest + 'img/'
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
  'minify-js',
  'copy-images',
  'copy-vendor'
])

// Run development server task with browserSync locally on port 3000
gulp.task('serve', ['browserSync', 'default'], function() {
  // run gulp tasks when source files change
  gulp.watch(htmlSrc, ['minify-html'])
  gulp.watch(hbsSrc, ['minify-handlebars'])
  gulp.watch(sassWatch, ['minify-css'])
  gulp.watch(imgSrc, ['copy-images'])
  gulp.watch(vendorSrc, ['copy-vendor'])

  // Reload the browser whenever files change
  gulp.watch(htmlDest, browserSync.reload)
  gulp.watch(jsDest, browserSync.reload)
  gulp.watch(vendorDest, browserSync.reload)
  gulp.watch(cssDest, browserSync.reload)
})

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})

/*
 *  Compile & Minify Tasks
 */

// Compile SCSS files from to css/
gulp.task('sass', function() {
  return gulp.src(sassSrc)
    .pipe(sass())
    .pipe(concat(sassOutput))
    // .pipe(changed(sassDest))
    .pipe(gulp.dest(sassDest))
})

// Minify compiled CSS to dist/
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

// Minify JS to dist/
gulp.task('minify-js', function() {
  return gulp.src(jsSrc)
    .pipe(babel())
    .pipe(uglify().on('error', util.log))
    // .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    // .pipe(changed(jsDest))
    .pipe(gulp.dest(jsDest))
    .pipe(browserSync.reload({
      stream: true
    }))
})

/*
 *  File Copy Tasks
 */

// Copy favicons to dist/
function copy(src, dest) {
  return gulp.src(src)
    .pipe(gulp.dest(dest))
}

// Copy images to dist/
gulp.task('copy-images', function() {
  return copy(imgSrc, imgDest)
})

// Deploy vendor directory to dist/
gulp.task('deploy-vendor', function() {
  return copy(vendorSrc, vendorDest)
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

  return copy(vendorSrc, vendorDest)
})

/*
 *  Git Deploy Scripts
 */

// Add dist files to remote repo on server
// gulp.task('git-dist', function() {
//   return gulp.src('dist/')
//     // add dist/ directory to commit
//     .pipe(git.add({
//       args: '-f'
//     }))
//     // commit files for subtree
//     .pipe(git.commit(undefined, {
//       args: '-m "commit build"',
//       disableMessageRequirement: true
//     }))
// })

// // Push 'dist/' to dev server
// gulp.task('deploy-dev', ['git-dist'], shell.task([
//   'git push dev `git subtree split --prefix dist master`:master --force'
//   // 'git subtree push --prefix dist dev master'
// ]))
//
// // Push 'dist/' to staging server
// gulp.task('deploy-staging', ['git-dist'], shell.task([
//   'git push staging `git subtree split --prefix dist master`:master --force'
//   // 'git subtree push --prefix dist staging master'
// ]))
//
// // Push 'dist/' to production server
// gulp.task('deploy-prod', ['git-dist'], shell.task([
//   'git push prod `git subtree split --prefix dist master`:master --force'
//   // 'git subtree push --prefix dist prod master'
// ]))



// var gulp = require('gulp');
// var sass = require('gulp-sass');
// var browserSync = require('browser-sync').create();
// var header = require('gulp-header');
// var cleanCSS = require('gulp-clean-css');
// var rename = require("gulp-rename");
// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');
// var pkg = require('./package.json');
//
// var minifyHTML = require('gulp-minify-html');
//
// // defining single task with name "deploy"
// gulp.task('deploy', function() {
//   // only copy desired files to dist folder
//   gulp.src('./css/**').pipe(gulp.dest('./dist/css'));
//   gulp.src('./img/**').pipe(gulp.dest('./dist/img'));
//   gulp.src('./pdf/**').pipe(gulp.dest('./dist/pdf'));
//   gulp.src('./js/**').pipe(gulp.dest('./dist/js'));
//   gulp.src('./vendor/**').pipe(gulp.dest('./dist/vendor'));
//   gulp.src('./*.html').pipe(gulp.dest('./dist'));
//
//   //minify css
//   // gulp.src('./dist/css/*.css')
//   //   .pipe(minifyCss({compatibility: 'ie8'}))
//   //   .pipe(gulp.dest('./dist'));
//
//   //gzipping css
//   // gulp.src('./dist/css/*.css')
//   //   .pipe(awspublish.gzip({ ext: '.gz' }))
//   //   .pipe(gulp.dest('./dist'));
//
//   //minifying html
//   // gulp.src('./dist/*.html')
//   //   .pipe(minifyHTML({ conditionals: true, spare:true}))
//   //   .pipe(gulp.dest('./dist'));
//
//   // var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };
//
//   // push all the contents of ./dist folder to s3
//   // gulp.src('./dist/**')
//   //   .pipe(publisher.publish(headers))
//   //   .pipe(publisher.sync())
//   //   .pipe(awspublish.reporter());
// });
//
// // Set the banner content
// var banner = ['/*!\n',
//     ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
//     ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
//     ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
//     ' */\n',
//     ''
// ].join('');
//
// // Compile LESS files from /less into /css
// // gulp.task('less', function() {
// //     return gulp.src('less/theme.less')
// //         .pipe(less())
// //         .pipe(header(banner, { pkg: pkg }))
// //         .pipe(gulp.dest('css'))
// //         .pipe(browserSync.reload({
// //             stream: true
// //         }))
// // });
//
// // Minify compiled CSS
// gulp.task('minify-css', ['sass'], function() {
//     return gulp.src('css/theme.css')
//         .pipe(cleanCSS({ compatibility: 'ie8' }))
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest('css'))
//         .pipe(browserSync.reload({
//             stream: true
//         }))
// });
//
// // Minify JS
// gulp.task('minify-js', function() {
//     return gulp.src('js/theme.js')
//         .pipe(uglify())
//         .pipe(header(banner, { pkg: pkg }))
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest('js'))
//         .pipe(browserSync.reload({
//             stream: true
//         }))
// });
//
// // Copy vendor libraries from /node_modules into /vendor
// gulp.task('copy', function() {
//     gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
//         .pipe(gulp.dest('vendor/bootstrap'))
//
//     gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
//         .pipe(gulp.dest('vendor/jquery'))
//
//     gulp.src([
//             'node_modules/font-awesome/**',
//             '!node_modules/font-awesome/**/*.map',
//             '!node_modules/font-awesome/.npmignore',
//             '!node_modules/font-awesome/*.txt',
//             '!node_modules/font-awesome/*.md',
//             '!node_modules/font-awesome/*.json'
//         ])
//         .pipe(gulp.dest('vendor/font-awesome'))
// })
//
// // Run everything
// gulp.task('default', ['sass', 'minify-css', 'minify-js', 'copy']);
//
// // Configure the browserSync task
// gulp.task('browserSync', function() {
//     browserSync.init({
//         server: {
//             baseDir: ''
//         },
//     })
// })
//
// // Dev task with browserSync
// gulp.task('dev', ['browserSync', 'sass', 'minify-css', 'minify-js'], function() {
//     gulp.watch('scss/*.scss', ['sass']);
//     gulp.watch('css/*.css', ['minify-css']);
//     gulp.watch('js/*.js', ['minify-js']);
//     // Reloads the browser whenever HTML or JS files change
//     gulp.watch('*.html', browserSync.reload);
//     gulp.watch('js/**/*.js', browserSync.reload);
// });
//
// // Compiles SCSS files from /scss into /css
// gulp.task('sass', function() {
//     return gulp.src('scss/theme.scss')
//         .pipe(sass())
//         .pipe(header(banner, { pkg: pkg }))
//         .pipe(concat('theme.css')) // this is what was missing
//         .pipe(gulp.dest('./css/'))
//         .pipe(browserSync.reload({
//             stream: true
//         }))
// });
