import { useEffect } from 'react'
import { useClient, Mutations } from 'cozy-client'
import { receiveMutationResult } from 'cozy-client/dist/store'

const RealTimeQueries = ({ doctype }) => {
  const client = useClient()

  const dispatchChange = (document, mutationDefinitionCreator) => {
    const response = { data: { ...document, _type: doctype } }
    const options = {}
    client.dispatch(
      receiveMutationResult(
        client.generateId(),
        response,
        options,
        mutationDefinitionCreator(document)
      )
    )
  }

  useEffect(
    () => {
      const realtime = client.plugins.realtime

      const dispatchCreate = document => {
        dispatchChange(document, Mutations.createDocument)
      }
      const dispatchUpdate = document => {
        dispatchChange(document, Mutations.updateDocument)
      }
      const dispatchDelete = document => {
        dispatchChange(
          { ...document, _deleted: true },
          Mutations.deleteDocument
        )
      }

      const subscribe = async () => {
        await realtime.subscribe('created', doctype, dispatchCreate)
        await realtime.subscribe('updated', doctype, dispatchUpdate)
        await realtime.subscribe('deleted', doctype, dispatchDelete)
      }
      subscribe()

      return () => {
        realtime.unsubscribe('created', doctype, dispatchCreate)
        realtime.unsubscribe('updated', doctype, dispatchUpdate)
        realtime.unsubscribe('deleted', doctype, dispatchDelete)
      }
    },
    [client, dispatchChange]
  )

  return null
}

export default RealTimeQueries
