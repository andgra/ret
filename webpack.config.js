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
        './app/js/main.js'
    ],
    output: {
        filename: 'js/app.js',
        path: path.resolve(__dirname, 'public')
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './app/static', to: './'},
        ]),
        extractSass,
        new WebpackNotifierPlugin({title: 'Webpack',alwaysNotify: true})
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '/': path.resolve(__dirname, ''),
            '@': path.resolve(__dirname, 'app'),
            '~assets': path.resolve(__dirname, 'app/assets/'),
            '~components': path.resolve(__dirname, 'app/components/'),
            '~mixins': path.resolve(__dirname, 'app/mixins/'),
            '~js': path.resolve(__dirname, 'app/js'),
            '~layouts': path.resolve(__dirname, 'app/layouts'),
            '~pages': path.resolve(__dirname, 'app/pages'),
            '~models': path.resolve(__dirname, 'app/models'),
            '~node_modules': path.resolve(__dirname, 'node_modules'),
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
                        js: babelLoader, // Pass parameters as options,
                        scss: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=false', // <style lang="scss">
                        css: 'vue-style-loader!css-loader?indentedSyntax' // <style>
                    },
                    postLoaders: {
                        html: 'babel-loader',
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