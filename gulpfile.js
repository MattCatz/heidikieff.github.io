const path = require('path');
const { parallel, series, src, dest } = require('gulp');
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
  stats: false,
  silent: true, 
}

const sqip_config = {
  numberOfPrimitives: 15,
}

function transform_path(new_path) {
  const extension = path.extname(new_path);
  const dirname = path.dirname(new_path);
  const basename = path.basename(new_path, extension);
  const file_name = basename + '-medium' + extension;
  return path.join(dirname, file_name);
}

function resize_png() {
  const DEST = '_site/assets/img/';
  return src('assets/img/*.png')
    .pipe(changed(DEST,{extension:'.png', transformPath: transform_path}))
    .pipe(responsive(img_sizes, responsive_options))
    .pipe(dest('_site/assets/img/'));
}

function resize_jpg() {
  const DEST = '_site/assets/img/';
  return src('assets/img/*.jpeg')
    .pipe(changed(DEST,{extension:'.jpeg', transformPath: transform_path}))
    .pipe(responsive(img_sizes, responsive_options))
    .pipe(dest('_site/assets/img/'));
}

function convert_webp() {
  const DEST = '_site/assets/img/';
  return src('assets/img/*.{jpeg,png}')
    .pipe(changed(DEST,{extension:'.webp', transformPath: transform_path}))
    .pipe(responsive(webp_sizes, responsive_options))
    .pipe(dest('_site/assets/img/'));
}

function generate_placeholders_PNG() {
  const CACHE = '/opt/build/cache/sqip/';
  return src('assets/img/*.png')
    .pipe(changed(CACHE,{extension:'.svg'}))
    .pipe(responsive({'*':{width:128}}, responsive_options))
    .pipe(sqip(sqip_config))
    .pipe(dest(CACHE));
}

function generate_placeholders_JPEG() {
  const CACHE = '/opt/build/cache/sqip/';
  return src('assets/img/*.jpeg')
    .pipe(changed(CACHE,{extension:'.svg'}))
    .pipe(responsive({'*':{width:128}}, responsive_options))
    .pipe(sqip(sqip_config))
    .pipe(dest(CACHE));
}

function get_from_cache() {
  const CACHE = '/opt/build/cache/sqip/';
  const DEST = '_site/assets/placeholders/';
  return src(CACHE + '*.svg')
    .pipe(dest(DEST));
}

const resize_pictures = parallel(resize_png, resize_jpg);
//const convert_pictures = convert_webp;
//const generate_placeholders = series(parallel(generate_placeholders_PNG,generate_placeholders_JPEG), get_from_cache);

exports.resize_pictures = resize_pictures;
//exports.convert_pictures = convert_pictures;
//exports.generate_placeholders = generate_placeholders;

exports.test = resize_png;

exports.default = resize_pictures;//parallel(resize_pictures, convert_pictures, generate_placeholders);

