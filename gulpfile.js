"use strict";

const { src, dest, watch, series, parallel } = require('gulp');
const concat       = require('gulp-concat');
const rename       = require('gulp-rename');
const uglify       = require('gulp-uglify');
const notify       = require('gulp-notify');
const notifier     = require('node-notifier');
const plumber      = require('gulp-plumber');
const newer        = require('gulp-newer');
const imagemin     = require('gulp-imagemin');
const sass         = require('gulp-sass');
const postcss      = require('gulp-postcss');
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const replace      = require('gulp-replace');
const htmlmin      = require('gulp-htmlmin');
const hb           = require('gulp-hb');
const fs           = require('fs');
const fse          = require('fs-extra');
const Enquirer     = require('enquirer');
const babel        = require('gulp-babel');
const map          = require('map-stream');
const enquirer     = new Enquirer();
const browserSync  = require('browser-sync');
const server       = browserSync.create();

const paths = {
  static: {src: 'src/static/**/*', dest: 'build/static/'},
  html: {src: 'src/*.html', dest: 'build/'},
  handlebars: {src: 'src/*.hbs', dest: 'build/'},
  scripts: {src: 'src/js/**/*.js', dest: 'build/js/'},
  styles: {src: 'src/scss/**/*.scss', dest: 'build/css/'},
  images: {src: 'src/media/**/*', dest: 'build/media/'},
  production: {
    dest: 'dist',
    title: '',
    url: '',
    images: '/wp-content/uploads/sites/'
  }
}

// Server

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: 'build/'
    },
    ui: false
  });
  done();
}

// Watch changes

function watchTask() {
  watch(paths.styles.src, compileCss);
  watch(paths.images.src, series(images, reload));
  watch(paths.html.src, series(compileHtml, reload));
  watch('src/**/*.hbs', series(compileHbs, reload));
  watch(paths.scripts.src, series(transpileJs, compileJs, reload));
}

// Error notifications

function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      title: errTitle || 'Error running Gulp',
      message: 'Error: <%= error.message %>',
      sound: 'Glass'
    })
  });
}

// Development tasks

function compileHtml() {
  let out = paths.html.dest;

  return src(paths.html.src)
    .pipe(newer(out))
    .pipe(dest(out));
};

function compileHbs() {
  return src(['./src/*.hbs', '!src/_*.hbs'])
    .pipe(hb()
      .partials('src/modules/**/*.hbs')
    )
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(paths.handlebars.dest));
}

function compileCss() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(customPlumber('Error running Sass'))
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest))
    .pipe(server.stream());
}

function staticFiles() {
  return src(paths.static.src)
    .pipe(dest(paths.static.dest));
}

function faviconTask() {
  return src('src/favicon.ico')
    .pipe(dest('build'));
}

function images() {
  let out = paths.images.dest;

  return src(paths.images.src)
    .pipe(newer(out))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: false },
          { removeXMLProcInst: false },
          { cleanupIDs: false }
        ]
      })
    ], { verbose: true }
    ))
    .pipe(dest(out));
}

function transpileJs() {
  return src([

    /* Components: optional */
    'src/js/components/*.js',

    /* Main scripts */
    'src/js/main.js'
  ])
  .pipe(babel())
  .pipe(concat('main.js'))
  .pipe(dest(paths.scripts.dest));
}

function compileJs() {
  return src([
    // Libs
    /* Uncomment the library you need below */

    /* Body Scroll Lock */
    "src/js/lib/bodyScrollLock.min.js",

    /* Particles */
    "src/js/lib/particles.min.js",

    /* scrollDetector */
    // "src/js/lib/lodash.min.js",
    // "src/js/lib/scrollDetector.js",

    /* Lottie */
    // "src/js/lib/lottie.min.js",

    /* Greensock */
    "src/js/lib/TweenMax.min.js",
    "src/js/lib/TimelineMax.min.js",

    /* Greensock plugin: GSAP */
    "src/js/lib/jquery.gsap.min.js",

    /* Greensock plugin: Draw SVG Plugin */
    // "src/js/lib/drawsvgplugin.js",

    /* Scrollmagic */
    "src/js/lib/ScrollMagic.min.js",

    /* Scrollmagic plugin: Indicators */
    "src/js/lib/debug.addIndicators.min.js",

    /* Scrollmagic plugin: GSAP */
    "src/js/lib/animation.gsap.min.js",

    /* Scrollmagic plugin: Velocity */
    "src/js/lib/animation.velocity.min.js",

    /* Scrollmagic plugin: jQuery */
    "src/js/lib/jquery.ScrollMagic.min.js",

    /* Owl Carousel */
    // "src/js/lib/owl.carousel.min.js",

    /* Fullpage */
    // "src/js/lib/fullpage.extensions.min.js",
    // "src/js/lib/fullpage.scrollHorizontally.min.js",

    /* transpiled Main in build */
    "build/js/main.js"
  ])
    .pipe(concat('main.js'))
    .pipe(dest(paths.scripts.dest));
}

// Components

function componentsHtml() {
  return src('src/components.html')
    .pipe(dest('build'));
}

// Production tasks

function productionHtml() {
  return src('build/*.html')
    .pipe(replace('media/', paths.production.images.dest))
    .pipe(replace('{URL}', paths.production.url.dest))
    .pipe(replace('{SUBJECT}', paths.production.title.dest))
    .pipe(htmlmin({
      collapseWhitespace: false,
      removeComments: true
    }))
    .pipe(dest(paths.production.dest));
}

function productionJs() {
  return src('build/js/main.js')
    .pipe(replace('media/', paths.production.images.dest))
    .pipe(uglify({
      compress: {
        drop_console: true // don't let console.log('pepe') or any console.log go into production env
      }
    }))
    .pipe(dest(paths.production.dest));
}

function productionCss() {
  return src('./build/css/main.css')
    .pipe(replace('../media/', paths.production.images.dest))
    .pipe(dest(paths.production.dest));
}

function productionSvg() {
  let definition = '<?xml version="1.0" encoding="UTF - 8"?>';
  return src('./build/media/**/*.svg')
    .pipe(map((file, cb) => {
      let fileContents = file.contents.toString();

      if (!fileContents.startsWith('<?xml')) {
        fileContents = definition + fileContents;
      }

      file.contents = new Buffer(fileContents);
      cb(null, file);
    }))
    .pipe(dest(paths.production.dest + '/images'));
}

// Engine

async function init(cb) {
  const answer = await enquirer.prompt({
    type: 'select',
    name: 'engine',
    message: 'Pick your flavor',
    choices: ['HTML', 'Handlebars']
  });

  const engine = answer.engine.toLowerCase();

  fs.writeFile('.engine', engine, (err) => {
    if (err) throw err;

    if (engine === 'handlebars') {
      fse.removeSync('./src/index.html');
      fse.copySync('./hbs_base_template', './src')
    }

    fse.removeSync('./hbs_base_template');

    console.log('Environment set with engine', engine);

    cb();
  });
}

// Init task

function start(cb) {
  if (fs.existsSync('.engine')) {
    const engine = fs.readFileSync('.engine', {
      'encoding': 'utf8'
    });

    if (engine === 'handlebars') {
      series(hbs, images, css, js, staticFiles, faviconTask, serve, watchTask)(cb);
    } else {
      series(html, images, css, js, staticFiles, faviconTask, serve, watchTask)(cb);
    }
  } else {
    notifier.notify({
      title: 'Environment not set',
      message: 'Run gulp init',
      sound: true,
      type: 'error'
    });

    console.error('--------------------');
    console.error('Environment not set');
    console.error('Run gulp init');
    console.error('--------------------');

  }
  cb();
}

// Run task

function run(cb) {
  if (fs.existsSync('.engine')) {
    const engine = fs.readFileSync('.engine', {
      'encoding': 'utf8'
    });

    if (engine === 'handlebars') {
      parallel(hbs, images, css, js, staticFiles, faviconTask)(cb);
    } else {
      parallel(html, images, css, js, staticFiles, faviconTask)(cb);
    }
  } else {
    notifier.notify({
      title: 'Environment not set',
      message: 'Run gulp init',
      sound: true,
      type: 'error'
    });

    console.error('--------------------');
    console.error('Environment not set');
    console.error('Run gulp init');
    console.error('--------------------');
  }
  cb();
}

// Friendly var names for Development tasks to use with Exports below

const html = compileHtml;
const css = compileCss;
const js = series(transpileJs, compileJs);
const hbs = compileHbs;

// Exports
// Publicly accesible to the command line, e.g. gulp init

exports.init = init;
exports.staticFiles = staticFiles;
exports.html = html
exports.css = css;
exports.js = js;
exports.hbs = hbs;
exports.serve = series(parallel(html, css, js),serve, watchTask);
exports.buildProduction = series(productionCss, productionHtml, productionJs, productionSvg, componentsHtml);

exports.run = run;

exports.default = start;
