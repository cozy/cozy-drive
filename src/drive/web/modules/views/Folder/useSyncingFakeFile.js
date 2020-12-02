import { useContext, useMemo } from 'react'

import SharingsContext from 'drive/lib/SharingsContext'
import { getSharingIdFromUrl } from 'drive/web/modules/navigation/duck'
import { computeSyncingFakeFile } from './syncHelpers'

export const useSyncingFakeFile = ({ isEmpty, queryResults }) => {
  const { sharingsValue, setSharingsValue, fileValue } = useContext(
    SharingsContext
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
