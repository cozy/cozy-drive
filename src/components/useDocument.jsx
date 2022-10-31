import { useMemo } from 'react'
import { useClient } from 'cozy-client'
import { useSelector } from 'react-redux'
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
