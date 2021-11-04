const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
  mode: 'production',
  entry: [path.resolve(__dirname, '/public/static/js/index.js')],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
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
                'css-loader',
                'sass-loader',
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
};
