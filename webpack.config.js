const path = require('path')
const webpack = require('webpack')
const express = require('express')
const app = express()
const apiRoutes = express.Router()
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { dirname } = require('path')

const cfg = {
    entry: {
        'bundle': ['./src/js/app.js']
    } ,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: "development",
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)(\?.+)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    devServer: {
        contentBase: __dirname,
        port: 8080,
        before: (app, server) => {
            app.get('/api/config', function(req, res) {
                const countersData = fs.readFileSync(path.resolve('./src/json/app.config.json'))
                res.json(JSON.parse(countersData));
            });
        },
        https: false,
        publicPath: '/dist'
    },
    plugins: [
        new MiniCssExtractPlugin(),
    ]
}

module.exports = cfg