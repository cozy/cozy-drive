import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { getRsbuildConfig } from 'rsbuild-config-cozy-app'

const config = getRsbuildConfig({
  title: 'Cozy Drive',
  hasServices: true,
  hasPublic: true,
  hasIntents: true
})

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
          {
            test: /react-spring/,
            sideEffects: true
          }
        ]
      }
    }
  }
})

export default defineConfig(mergedConfig)
