import log from 'cozy-logger'
import fetch from 'node-fetch'
import { run } from 'lib/dacc/dacc-run'

global.fetch = fetch

run().catch(e => {
  log('critical', e)
  process.exit(1)
})
