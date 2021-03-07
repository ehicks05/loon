const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: './src/main/resources/static/js/dev/index.js',
    output: {
        path: path.resolve('src/main/resources/static/js/dist'),
        filename: 'index_bundle.js',
        publicPath: '/js/dist/',
        chunkFilename: '[name].bundle.js'
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
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    cache: false,
                    configFile: '.eslintrc.js'
                },
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin({analyzerMode: 'disabled', openAnalyzer: false}),
        // new BundleAnalyzerPlugin({analyzerMode: 'static', openAnalyzer: false}),
    ],
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json']
    },
    // log warnings were in yellow and hard to see on white bg.
    stats: {colors: {yellow: '\u001b[1m\u001b[35m'}}
}