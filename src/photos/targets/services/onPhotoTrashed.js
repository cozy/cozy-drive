import fetch from 'node-fetch'
global.fetch = fetch

import CozyClient from 'cozy-client'
import { Document } from 'cozy-doctypes'
import log from 'cozy-logger'

import { onPhotoTrashed } from 'photos/lib/onPhotoTrashed'

const attachProcessEventHandlers = () => {
  process.on('uncaughtException', err => {
    log('warn', JSON.stringify(err.stack))
  })

  process.on('unhandledRejection', err => {
    log('warn', JSON.stringify(err.stack))
  })
}

const main = async () => {
  attachProcessEventHandlers()
  const client = CozyClient.fromEnv(process.env)
  Document.registerClient(client)
  await onPhotoTrashed(client)
}

main().catch(e => {
  log('critical', e)
  process.exit(1)
})
