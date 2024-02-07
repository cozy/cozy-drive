import { memo, useEffect } from 'react'

import { useClient, Mutations } from 'cozy-client'
import { ensureFilePath } from 'cozy-client/dist/models/file'
import { receiveMutationResult } from 'cozy-client/dist/store'

import { buildFileByIdQuery } from 'modules/queries'

/**
 * Normalizes an object representing a CouchDB document
 *
 * Ensures existence of `_type`
 *
 * @public
 * @param {CouchDBDocument} couchDBDoc - object representing the document
 * @returns {CozyClientDocument} full normalized document
 */
const normalizeDoc = (couchDBDoc, doctype) => {
  return {
    id: couchDBDoc._id,
    _type: doctype,
    ...couchDBDoc
  }
}

/**
 * DispatchChange
 *
 * @param {CozyClient} client CozyClient instane
 * @param {Doctype} doctype Doctype of the document to update
 * @param {CouchDBDocument} couchDBDoc Document to update
 * @param {Mutation} mutationDefinitionCreator Mutation to apply
 */
const dispatchChange = async (
  client,
  doctype,
  couchDBDoc,
  mutationDefinitionCreator,
  computeDocBeforeDispatch
) => {
  const normDoc = normalizeDoc(couchDBDoc, doctype)
  const data =
    typeof computeDocBeforeDispatch === 'function'
      ? await computeDocBeforeDispatch(normDoc, client)
      : normDoc

  const response = {
    data
  }
  const options = {}
  client.dispatch(
    receiveMutationResult(
      client.generateRandomId(),
      response,
      options,
      mutationDefinitionCreator(data)
    )
  )
}

const ensureFileHasPath = async (doc, client) => {
  if (doc.path) return doc

  const parentQuery = buildFileByIdQuery(doc.dir_id)
  const parentResult = await client.fetchQueryAndGetFromState({
    definition: parentQuery.definition(),
    options: parentQuery.options
  })

  return ensureFilePath(doc, parentResult.data)
}

/**
 * Component that subscribes to io.cozy.files document changes and keep the
 * internal store updated. This is a copy of RealTimeQueries from cozy-client
 * with a tweak to merge the changes with the existing document from the store.
 * You can have more detail on the problematic we are solving here:
 * https://github.com/cozy/cozy-client/issues/1412
 *
 * @param  {object} options - Options
 * @param  {Doctype} options.doctype - The doctype to watch
 * @returns {null} The component does not display anything.
 */
const FilesRealTimeQueries = ({
  doctype = 'io.cozy.files',
  computeDocBeforeDispatchCreate = ensureFileHasPath,
  computeDocBeforeDispatchUpdate = ensureFileHasPath,
  computeDocBeforeDispatchDelete = (doc, client) =>
    ensureFileHasPath({ ...doc, _deleted: true }, client)
}) => {
  const client = useClient()

  useEffect(() => {
    const realtime = client.plugins.realtime

    if (!realtime) {
      throw new Error(
        'You must include the realtime plugin to use RealTimeQueries'
      )
    }

    const dispatchCreate = couchDBDoc => {
      dispatchChange(
        client,
        doctype,
        couchDBDoc,
        Mutations.createDocument,
        computeDocBeforeDispatchCreate
      )
    }
    const dispatchUpdate = couchDBDoc => {
      dispatchChange(
        client,
        doctype,
        couchDBDoc,
        Mutations.updateDocument,
        computeDocBeforeDispatchUpdate
      )
    }
    const dispatchDelete = couchDBDoc => {
      dispatchChange(
        client,
        doctype,
        couchDBDoc,
        Mutations.deleteDocument,
        computeDocBeforeDispatchDelete
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
  }, [
    client,
    computeDocBeforeDispatchCreate,
    computeDocBeforeDispatchDelete,
    computeDocBeforeDispatchUpdate,
    doctype
  ])

  return null
}

export default memo(FilesRealTimeQueries)
