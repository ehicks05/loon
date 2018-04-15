const path = require('path');
var Visualizer = require('webpack-visualizer-plugin');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
    entry: './src/main/webapp/js/dev/index.js',
    output: {
        path: path.resolve('src/main/webapp/js/dist'),
        filename: 'index_bundle.js'
    },
    module: {
        rules: [
            { test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            },
            { test: /\.(png|jpg|gif|svg|eot|woff2|woff|ttf)/,
                use: [
                    { loader: "url-loader" }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }, {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    },
    plugins: [
        new Visualizer(), new HardSourceWebpackPlugin()
    ]
}