'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin')

const { production, extractor } = require('./webpack.vars')
const pkg = require(path.resolve(__dirname, '../package.json'))

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/main'),
    'public/app': path.resolve(__dirname, '../src/public/main')
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|cozy-(bar|client-js))/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: extractor.extract('style', [
          'css-loader?importLoaders=1',
          'postcss-loader'
        ])
      }
    ]
  },
  postcss: () => {
    return [
      require('autoprefixer')(['last 2 versions'])
    ]
  },
  plugins: [
    extractor,
    new PostCSSAssetsPlugin({
      test: /\.css$/,
      plugins: [
        require('css-mqpacker'),
        require('postcss-discard-duplicates'),
        require('postcss-discard-empty')
      ].concat(
        production ? require('csswring')({preservehacks: true, removeallcomments: true}) : []
      )
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      title: pkg.name,
      inject: false,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      template: 'src/public/index.ejs',
      filename: 'public/index.html',
      title: pkg.name,
      inject: false,
      minify: {
        collapseWhitespace: true
      }
    })
  ]
}
