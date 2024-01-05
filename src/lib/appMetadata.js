import manifest from '../targets/manifest.webapp'

const appMetadata = {
  slug: manifest.slug,
  version: manifest.version,
  name: manifest.name,
  prefix: manifest.name_prefix
}

export default appMetadata
