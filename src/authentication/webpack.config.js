const path = require('path')
const nodeExternals = require('webpack-node-externals')
const merge = require('webpack-merge')

const uiConfig = ({ production } = {}) => ({
  resolve: {
    extensions: ['.styl']
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        loader: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: !production,
              importLoaders: 1,
              modules: true,
              localIdentName: '[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !production,
              plugins: () => [
                require('autoprefixer')({ browsers: ['last 2 versions'] })
              ]
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: !production,
              use: [require('cozy-ui/stylus')()]
            }
          }
        ]
      }
    ]
  }
})

const preactConfig = {
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules\/(?!(cozy-ui|cozy-client))/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.jsx'],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      'create-react-class': 'preact-compat/lib/create-react-class'
    }
  }
}

module.exports = env => {
  const { production } = env || {}
  return merge(preactConfig, uiConfig(env), {
    entry: {
      index: './src/Standalone.jsx'
    },
    output: {
      path: path.resolve(__dirname, './build'),
      filename: '[name].js',
      libraryTarget: 'commonjs2'
    },
    resolve: {
      extensions: ['.js', '.json', '.css'],
      modules: [path.resolve(__dirname, '..')]
    },
    stats: { chunks: false, modules: false },
    devtool: production ? false : 'source-map',
    externals: [
      nodeExternals({
        modulesDir: path.resolve('../../node_modules'),
        importType: 'commonjs2'
      })
    ]
  })
}
