let webpack                = require('webpack');
let path                   = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let CopyWebpackPlugin      = require('copy-webpack-plugin');
let WebpackNotifierPlugin  = require('webpack-notifier');
const {VueLoaderPlugin}    = require('vue-loader');

const {
        NODE_ENV = 'development'
      } = process.env;

const IS_DEVELOPMENT = NODE_ENV === 'development';

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: [["es2015", {modules: false}]],
    plugins: ["syntax-async-functions", "transform-object-rest-spread", "transform-regenerator"]
  }
};

module.exports = {
  // context: path.join(__dirname, 'app'),
  devtool: IS_DEVELOPMENT ? 'eval-cheap-module-source-map' : '',
  mode: NODE_ENV,
  entry: [
    './app/js/main.js',
    './app/assets/sass/main.scss',
  ],
  output: {
    filename: 'bundle/[name].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public/',
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: './app/static', to: './'},
      {from: './node_modules/material-design-lite/material.js', to: './bundle/mdl.js'},
    ]),
    new MiniCssExtractPlugin({
      filename: "bundle/[name].css",
      chunkFilename: "bundle/[id].css"
    }),
    new VueLoaderPlugin(),
    new WebpackNotifierPlugin({title: 'Webpack', alwaysNotify: true}),
    new webpack.DefinePlugin({
      IS_DEVELOPMENT: JSON.stringify(IS_DEVELOPMENT),
    }),
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
      '~api': path.resolve(__dirname, 'app/api'),
      '~store': path.resolve(__dirname, 'app/store'),
      '~node_modules': path.resolve(__dirname, 'node_modules'),
    }
  },
  target: 'node-webkit',
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.(css|scss)/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
      /*{
        test: /\.scss$/,
        use: [
          IS_DEVELOPMENT ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader',
        }
      },*/
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
          name: path.relative(__dirname, './images/[name].[ext]?[hash]').replace('\\', '/'),
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: path.relative(__dirname, './fonts/[name].[ext]?[hash]').replace('\\', '/'),
        }
      }
    ],
  }
};