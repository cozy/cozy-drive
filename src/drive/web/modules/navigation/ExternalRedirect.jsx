import React from 'react'
import { withClient } from 'cozy-client'
import useFetchShortcut from 'drive/web/modules/filelist/useFetchShortcut'
const ExternalRedirect = ({ client, params: { fileId } }) => {
  console.log('fileId', fileId)
  const { shortcutInfos } = useFetchShortcut(client, {
    id: fileId
  })
  console.log('shortcutInfos', shortcutInfos)
  if (shortcutInfos) {
    window.location.href = shortcutInfos.data.attributes.url
  }
  //
  return null
}

export default withClient(ExternalRedirect)
