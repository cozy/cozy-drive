import { defineConfig } from '@rsbuild/core'
import { getRsbuildConfig } from 'rsbuild-config-cozy-app'

const config = getRsbuildConfig({
  title: 'Cozy Photos',
  hasServices: true,
  hasPublic: true
})

export default defineConfig(config)
