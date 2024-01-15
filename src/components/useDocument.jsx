import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useClient } from 'cozy-client'
import { getDocumentFromState } from 'cozy-client/dist/store'

const useDocument = (doctype, id) => {
  const client = useClient()
  const doc = useSelector(state => {
    if (id) return getDocumentFromState(state, doctype, id)
    return undefined
  })
  return useMemo(() => client.hydrateDocument(doc), [client, doc])
}

export default useDocument
