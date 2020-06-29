import { memo, useEffect } from 'react'
import { useClient, Mutations, models } from 'cozy-client'
import { receiveMutationResult } from 'cozy-client/dist/store'

const dispatchChange = (document, mutationDefinitionCreator, client) => {
  const response = {
    data: models.file.normalize(document)
  }
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

const RealTimeQueries = ({ doctype }) => {
  const client = useClient()

  useEffect(
    () => {
      const realtime = client.plugins.realtime

      const dispatchCreate = document => {
        dispatchChange(document, Mutations.createDocument, client)
      }
      const dispatchUpdate = document => {
        dispatchChange(document, Mutations.updateDocument, client)
      }
      const dispatchDelete = document => {
        dispatchChange(
          { ...document, _deleted: true },
          Mutations.deleteDocument,
          client
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
    [client, doctype]
  )

  return null
}

export default memo(RealTimeQueries)
