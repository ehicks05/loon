const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
    entry: './src/main/resources/static/js/dev/index.js',
    output: {
        path: path.resolve('src/main/resources/static/js/dist'),
        filename: 'index_bundle.js',
        publicPath: '/js/dist/'
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
        new BundleAnalyzerPlugin({analyzerMode: 'disabled', openAnalyzer: false}), new HardSourceWebpackPlugin()
        // new BundleAnalyzerPlugin({analyzerMode: 'static', openAnalyzer: false}), new HardSourceWebpackPlugin()
    ]
}