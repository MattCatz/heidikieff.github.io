const { parallel, src, dest } = require('gulp');
const gulpMultiProcess = require('gulp-multi-process');
const responsive = require('gulp-responsive');
const changed = require('gulp-changed');
const sqip = require('gulp-sqip');

const img_sizes = {
  '*': [
    {
      width:800,
      withoutEnlargement: true,
      rename: {suffix:'-thumbnail'},
    },{
      width: 1080,
      withoutEnlargement: true,
      rename: {suffix:'-medium'},
    }
  ]
}

const webp_sizes = {
  '*': [
    {
      width:800,
      withoutEnlargement: true,
      rename: {suffix:'-thumbnail'},
      format: 'webp'
    },{
      width: 1080,
      withoutEnlargement: true,
      rename: {suffix:'-medium'},
      format: 'webp'
    }
  ],
}

const responsive_options = {
  errorOnEnlargement: false,
  errorOnUnusedConfig: false,
}

const sqip_config = {
  numberOfPrimitives: 15,
}

function clean(callback) {
  callback();
}

function resize_png() {
  return src('assets/img/*.png')
    .pipe(responsive(img_sizes, responsive_options))
    .pipe(dest('_site/assets/img/'));
}

function resize_jpg() {
  return src('assets/img/*.jpg')
    .pipe(responsive(img_sizes, responsive_options))
    .pipe(dest('_site/assets/img/'));
}

function convert_webp() {
  return src('assets/img/*.{jpg,png}')
    .pipe(responsive(webp_sizes, responsive_options))
    .pipe(dest('_site/assets/img/'));
}

function generate_placeholders() {
  const DEST = '_site/assets/placeholders/';
  return src('assets/img/*.png')
    .pipe(changed(DEST,{extension:'.svg'}))
    .pipe(responsive({'*':{width:128}}, responsive_options))
    .pipe(sqip(sqip_config))
    .pipe(dest(DEST));
}

function generate_placeholders_J() {
  const DEST = '_site/assets/placeholders/';
  return src('assets/img/*.jpg')
    .pipe(changed(DEST,{extension:'.svg'}))
    .pipe(responsive({'*':{width:128}}, responsive_options))
    .pipe(sqip(sqip_config))
    .pipe(dest(DEST));
}

function multi_task(cb) {
  return gulpMultiProcess(['generate_placeholders','generate_placeholders_J'],cb)
}

exports.resize_png = resize_png
exports.resize_jpg = resize_jpg
exports.convert_webp = convert_webp
exports.generate_placeholders = generate_placeholders
exports.generate_placeholders_J = generate_placeholders_J

exports.resizes = parallel(resize_png, resize_jpg, convert_webp)

// exports.default = parallel(generate_placeholders, resize_png, resize_jpg, convert_webp)
exports.placeholders = generate_placeholders;

exports.default = parallel(resize_png, resize_jpg, convert_webp,multi_task)
