// note: npm install postcss-loader autoprefixer css-mqpacker cssnano --save-dev
/*
autoprefixer - проставляет префиксы стилям
css-mqpacker - сжимает медиа запросы
cssnano - максимально минифицирует исходные стили
*/
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('css-mqpacker'),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
