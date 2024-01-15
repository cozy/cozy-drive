import fetch from 'node-fetch'

import log from 'cozy-logger'

import { run } from 'lib/dacc/dacc-run'

global.fetch = fetch

run().catch(e => {
  log('critical', e)
  process.exit(1)
})
