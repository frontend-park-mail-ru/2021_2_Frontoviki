const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
  mode: 'production',
  entry: ['@babel/polyfill', path.resolve(__dirname, '/public/static/js/index.ts')],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.sass$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: false,
              reloadAll: false,
            },
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {sourceMap: true, config: { path: 'public/postcss.config.js' }}
          },
          {
            loader: 'sass-loader',
            options: {sourceMap: true}
          }
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
    new HtmlWebpackPlugin({inject: false, template: './public/index.html'}),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'public/sw.js'),
    }),
  ],
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.js', '.ts'],
  },
};
