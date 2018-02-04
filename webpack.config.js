let webpack = require('webpack');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let WebpackNotifierPlugin = require('webpack-notifier');

const extractSass = new ExtractTextPlugin({
    filename: "css/main.css",
});


const babelLoader = {
    loader: 'babel-loader',
    options: {
        presets: [[ "es2015", { modules: false } ]],
        plugins: ["syntax-async-functions", "transform-object-rest-spread", "transform-regenerator"]
    }
};

module.exports = {
    // context: path.join(__dirname, 'app'),
    devtool: 'eval',
    entry: [
        './src/routes.js'
    ],
    output: {
        filename: 'js/app.js',
        path: path.resolve(__dirname, 'public')
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './src/index.html'},
            {from: './node_modules/tablefilter/dist/tablefilter', to: './tablefilter'},
        ]),
        extractSass,
        new WebpackNotifierPlugin({title: 'Webpack',alwaysNotify: true})
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '/': path.resolve(__dirname, ''),
            '@': path.resolve(__dirname, 'src/components/'),
            'core': path.resolve(__dirname, 'src/core'),
            'src': path.resolve(__dirname, 'src'),
            'models': path.resolve(__dirname, 'src/models'),
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
                test: /\.css$/,
                use: {
                    loader: 'css-loader',
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: babelLoader
            },
            {
                test: /\.vue/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: babelLoader // Pass parameters as options
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