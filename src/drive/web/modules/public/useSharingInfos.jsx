import { useState, useEffect } from 'react'

import { useClient, Q } from 'cozy-client'

import logger from 'lib/logger'
import { getQueryParameter } from 'react-cozy-helpers'

const isShortcutCreatedOnTheRecipientCozy = included => {
  const sharingMember = included.find(
    item => item.type === 'io.cozy.sharings.members'
  )
  if (sharingMember && sharingMember.attributes.instance) {
    return true
  }
  return false
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
            .getOwnPermissions()
          const isSharingShortcutCreated = isShortcutCreatedOnTheRecipientCozy(
            response.included
          )
          const sourceId = response.data.attributes.source_id
          const sharingId = sourceId.split('/')[1]
          const { sharecode } = getQueryParameter()

          const link = client
            .collection('io.cozy.sharings')
            .getDiscoveryLink(sharingId, sharecode)
          const { data: sharing } = await client.query(
            Q('io.cozy.sharings').getById(sharingId)
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
