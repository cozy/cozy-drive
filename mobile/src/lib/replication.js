/* global cozy */
import { revokeClient } from '../actions/authorization'
import { clientRevokedMsg } from './cozy-helper'
import { openFolder, setFirstReplication } from '../../../src/actions'

export const startReplication = (dispatch, getState) => {
  const firstReplicationIsFinished = getState().settings.firstReplication
  if (firstReplicationIsFinished) {
    startRepeatedReplication(dispatch, getState)
  } else {
    startFirstReplication(dispatch, getState)
  }
}

const startRepeatedReplication = (dispatch, getState) => {
  const options = {
    onError: onError(dispatch, getState),
    onComplete: refreshFolder(dispatch, getState)
  }
  cozy.client.offline.startRepeatedReplication('io.cozy.files', 15, options)
}

const startFirstReplication = (dispatch, getState) => {
  const options = {
    onError: onError(dispatch, getState),
    onComplete: () => {
      dispatch(setFirstReplication(true))
      startRepeatedReplication(dispatch, getState)
    }
  }
  cozy.client.offline.replicateFromCozy('io.cozy.files', options).then(() => {
    console.log('End of Replication')
  })
}

export function refreshFolder (dispatch, getState) {
  return result => {
    if (result.docs_written !== 0) {
      dispatch(openFolder(getState().folder.id))
    }
  }
}

export const onError = (dispatch, getState) => (err) => {
  if (err.message === clientRevokedMsg || err.error === 'code=400, message=Invalid JWT token') {
    console.warn(`Your device is no more connected to your server: ${getState().mobile.settings.serverUrl}`)
    dispatch(revokeClient())
  } else if (err.message === 'ETIMEDOUT') {
    console.log('timeout')
  } else {
    console.warn(err)
  }
}
