'use strict'

const path = require('path')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const SRC_DIR = path.resolve(__dirname, '../src')

module.exports = function (production) {
  return {
    resolve: {
      modules: ['node_modules', SRC_DIR],
      extensions: ['.js', '.json', '.css'],
      alias: {
        // drive: path.resolve(SRC_DIR, './drive/'),
        // photos: path.resolve(SRC_DIR, './photos/'),
        'redux-cozy-client': path.resolve(SRC_DIR, './lib/redux-cozy-client')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|cozy-(bar|client-js))/,
          loader: 'babel-loader'
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  importLoaders: 1
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                  plugins: () => [require('autoprefixer')({ browsers: ['last 2 versions'] })]
                }
              }
            ]
          })
        }
      ],
      noParse: [
        /localforage\/dist/
      ]
    },
    plugins: [
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      }),
      new ExtractTextPlugin(`[name]${production ? '.[hash].min' : ''}.css`),
      new PostCSSAssetsPlugin({
        test: /\.css$/,
        plugins: [
          require('css-mqpacker'),
          require('postcss-discard-duplicates'),
          require('postcss-discard-empty')
        ].concat(
          production ? require('csswring')({preservehacks: true, removeallcomments: true}) : []
        )
      })
    ]
  }
}
