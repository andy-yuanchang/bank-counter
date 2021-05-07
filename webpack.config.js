const path = require('path')
const webpack = require('webpack')
const express = require('express')
const app = express()
const apiRoutes = express.Router()
const fs = require('fs')


const devMode = process.env.NODE_ENV !== 'production'

const cfg = {
    entry: './src/js/app.js',
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
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
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
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
        port: 8080,
        before: (app, server) => {
            app.get('/api/config', function(req, res) {
                const countersData = fs.readFileSync(path.resolve('./src/json/app.config.json'))
                res.json(JSON.parse(countersData));
            });
        },
        https: false
    }
}

if (!devMode) {

}

module.exports = cfg