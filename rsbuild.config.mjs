import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { getRsbuildConfig } from 'rsbuild-config-cozy-app'

const config = getRsbuildConfig({
  title: 'Cozy Drive',
  hasServices: true,
  hasPublic: true,
  hasIntents: true
})

const environment = 'production'

const mergedConfig = mergeRsbuildConfig(config, {
  environments: {
    main: {
      output: {
        copy: [
          {
            from: 'src/assets/onlyOffice',
            to: 'onlyOffice'
          },
          {
            from: 'icon-type-*.svg',
            to: 'assets/icons',
            context: 'src/assets/icons'
          }
        ]
      }
    }
  },
  resolve: {
    alias: {
      'react-pdf$': 'react-pdf/dist/esm/entry.webpack'
    }
  },
  tools: {
    rspack: {
      module: {
        rules: [
          // {
          //   test: /\.svg$/,
          //   include: /(\/|\\)(sprites|icons)(\/|\\)/,
          //   loader: 'svg-sprite-loader',
          //   // type: 'asset/inline',
          //   options: {
          //     symbolId: '[name]_[hash]'
          //   }
          // },
          {
            test: /\.(png|gif|jpe?g|svg)$/i,
            exclude: /(\/|\\)(sprites|icons|public)(\/|\\)/,
            type: 'asset/resource',
            options: {
              // mobile app needs relative path since it uses file://
              outputPath: 'img/',
              publicPath: '/img',
              name: `[name]${environment === 'production' ? '.[hash]' : ''}.[ext]`
            }
          },
          // We want to keep static images used by cozy-ui inside components
          {
            test: /\.(png|jpe?g|gif)$/i,
            include: /cozy-ui\/transpiled\/react(\/|\\)/,
            type: 'asset/resource'
          },
          // We want to keep static images used by cozy-dataproxy-lib inside components
          {
            test: /\.(png|jpe?g|gif)$/i,
            include: /cozy-dataproxy-lib\/dist\/assets(\/|\\)/,
            type: 'asset/resource'
          },
          /*
            For public pages, we need to have all used assets into the build/public
            folder in order to be served by cozy-stack in the public pages
          */
          {
            test: /\.(png|gif|jpe?g|svg)$/i,
            include: /public/,
            type: 'asset/resource',
            options: {
              // mobile app needs relative path since it uses file://
              outputPath: 'public/img',
              publicPath: '/public/img',
              name: `[name]${environment === 'production' ? '.[hash]' : ''}.[ext]`
            }
          }
        ]
      }
    }
  }
})

export default defineConfig(mergedConfig)
