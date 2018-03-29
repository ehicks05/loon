const path = require('path');

// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
//     template: './src/main/webapp/js/dev/index.html',
//     filename: '../../webroot/index.html',
//     inject: 'body'
// })

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
    // plugins: [HtmlWebpackPluginConfig]
}