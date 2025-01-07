import { defineConfig } from '@rsbuild/core'
import { getRsbuildConfig } from 'rsbuild-config-cozy-app'

const config = getRsbuildConfig({
  title: 'Cozy Drive',
  hasServices: true,
  hasPublic: true
})

export default defineConfig(config)
