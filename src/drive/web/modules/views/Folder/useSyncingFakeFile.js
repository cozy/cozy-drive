import { useContext, useMemo } from 'react'

import AcceptingSharingContext from 'drive/lib/AcceptingSharingContext'
import { getSharingIdFromUrl } from 'drive/web/modules/navigation/duck'
import { computeSyncingFakeFile } from './syncHelpers'

export const useSyncingFakeFile = ({ isEmpty, queryResults }) => {
  const { sharingsValue, setSharingsValue, fileValue } = useContext(
    AcceptingSharingContext
  )
  const isSharingContextEmpty = useMemo(
    () => Object.keys(sharingsValue).length <= 0,
    [sharingsValue]
  )
  const sharingId = getSharingIdFromUrl(window.location)

  const syncingFakeFile = computeSyncingFakeFile({
    isEmpty,
    isSharingContextEmpty,
    queryResults,
    sharingId,
    sharingsValue,
    setSharingsValue,
    fileValue
  })

  return { syncingFakeFile }
}
