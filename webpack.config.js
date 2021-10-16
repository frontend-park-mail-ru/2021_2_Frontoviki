const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: [path.resolve(__dirname, '/public/static/js/index.js')],
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'public/'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js'],
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
            },
        }]
    },
    
    plugins: [
        new ServiceWorkerWebpackPlugin({
            entry: path.join(__dirname, 'public/sw.js'),
        }),
    ]
};