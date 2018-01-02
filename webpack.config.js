let webpack = require('webpack');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');

const extractSass = new ExtractTextPlugin({
    filename: "css/main.css",
});

module.exports = {
    // context: path.join(__dirname, 'app'),
    devtool: 'eval',
    entry: [
        './src/js/routes.js'
    ],
    output: {
        filename: 'js/app.js',
        path: path.resolve(__dirname, 'public')
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './src/index.html'},
            {from: './src/tablefilter', to: './tablefilter'},
        ]),
        extractSass,
        new WebpackNotifierPlugin({title: 'Webpack',alwaysNotify: true})
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src/components/'),
        }
    },
    target: 'node-webkit',
    module: {
        exprContextCritical: false,
        rules: [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                        plugins: ["transform-object-rest-spread"]
                    }
                }
            },
            {
                test: /\.vue/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'babel-loader?presets[]=es2015' // Pass parameters as options
                    },
                    postLoaders: {
                        html: 'babel-loader',
                        css: 'sass-loader'
                    },
                    excludedPreLoaders: /(eslint-loader)/
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: path.relative(__dirname, './images/[name].[ext]?[hash]').replace('\\','/'),
                    publicPath: '../',
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    name: path.relative(__dirname, './fonts/[name].[ext]?[hash]').replace('\\','/'),
                    publicPath: '../',
                }
            }
        ],
    }
};