import { useState, useEffect } from 'react'

import { useClient, models } from 'cozy-client'
import { getQueryParameter } from 'react-cozy-helpers'

import logger from 'lib/logger'
import { buildSharingsByIdQuery } from 'drive/web/modules/queries'

const getSharingId = permission => {
  const sourceId = permission.data.attributes.source_id
  const sharingId = sourceId.split('/')[1]
  return sharingId
}

export const useSharingInfos = () => {
  const client = useClient()

  const [discoveryLink, setDiscoveryLink] = useState()
  const [isSharingShortcutCreated, setIsSharingSharingcutCreated] = useState(
    false
  )
  const [sharing, setSharing] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(
    () => {
      const loadSharingDiscoveryLink = async () => {
        setLoading(true)
        try {
          const response = await client
            .collection('io.cozy.permissions')
            .fetchOwnPermissions()

          const isSharingShortcutCreated = models.permission.isShortcutCreatedOnTheRecipientCozy(
            response
          )
          const sharingId = getSharingId(response)
          const { sharecode } = getQueryParameter()

          const link = client
            .collection('io.cozy.sharings')
            .getDiscoveryLink(sharingId, sharecode)
          const sharingsByIdQuery = buildSharingsByIdQuery(sharingId)
          const { data: sharing } = await client.query(
            sharingsByIdQuery.definition
          )

          setDiscoveryLink(link)
          setIsSharingSharingcutCreated(isSharingShortcutCreated)
          setSharing(sharing)
        } catch (e) {
          logger.warn('Failed to load sharing discovery link', e)
        } finally {
          setLoading(false)
        }
      }

      if (window.location.pathname === '/preview') {
        loadSharingDiscoveryLink()
      } else {
        setLoading(false)
      }
    },
    [client]
  )

  return {
    sharing,
    loading,
    discoveryLink,
    isSharingShortcutCreated
  }
}
