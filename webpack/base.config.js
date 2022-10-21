'use strict'

const webpack = require('webpack')
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const paths = require('cozy-scripts/utils/paths')
const postCSSLoaderConfig = require('cozy-scripts/config/postcss-loader-config')

const {
  environment,
  isDebugMode,
  getCSSLoader,
  getFilename,
  getEnabledFlags
} = require('cozy-scripts/config/webpack.vars')
const production = environment === 'production'

module.exports = {
  resolve: {
    // It's important that node_modules here is kept relative so that
    // inner node_modules are checked before checking the app node_modules
    modules: [paths.appSrc(), 'node_modules', paths.appNodeModules()],
    extensions: ['.ts', '.tsx', '.js', '.json', '.css'],
    // linked package will still be see as a node_modules package
    symlinks: false,
    alias: {
      src: paths.appSrc(),
      test: paths.appTest()
    }
  },
  bail: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|cozy-(bar|client-js))/,
        loader: require.resolve('cozy-scripts/node_modules/babel-loader'),
        options: {
          cacheDirectory: 'node_modules/.cache/babel-loader/js',
          presets: [['cozy-app', { react: false }]]
        }
      },
      {
        test: /\.css$/,
        use: [
          getCSSLoader(),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1
            }
          },
          postCSSLoaderConfig
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: require.resolve('file-loader'),
        options: {
          name: `[name].[ext]`
        }
      }
    ],
    noParse: [/localforage\/dist/]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${getFilename()}${production ? '.min' : ''}.css`,
      chunkFilename: `${getFilename()}${production ? '.[id].min' : ''}.css`
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional.
      // Slashes in filename are replaced since mobile needs
      // fonts to be in the same directory as the CSS stylesheet.
      filename: `${getFilename().replace(/\//g, '-')}${
        production ? '.min' : ''
      }.css`,
      chunkFilename: `${getFilename().replace(/\//g, '-')}${
        production ? '.[id].min' : ''
      }.css`
    }),
    new PostCSSAssetsPlugin({
      test: /\.css$/,
      log: isDebugMode,
      plugins: [
        require('css-mqpacker'),
        require('postcss-discard-duplicates'),
        require('postcss-discard-empty')
      ].concat(
        production
          ? require('csswring')({
              preservehacks: true,
              removeallcomments: true
            })
          : []
      )
    }),
    new webpack.DefinePlugin({
      __ENABLED_FLAGS__: JSON.stringify(getEnabledFlags())
    })
  ]
}
