import { useContext, useMemo } from 'react'

import { computeSyncingFakeFile } from './syncHelpers'
import AcceptingSharingContext from 'lib/AcceptingSharingContext'
import { getSharingIdFromUrl } from 'modules/navigation/duck'

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
