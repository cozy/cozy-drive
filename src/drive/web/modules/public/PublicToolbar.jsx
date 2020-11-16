import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import logger from 'lib/logger'
import { useClient } from 'cozy-client'

import { getQueryParameter } from 'react-cozy-helpers'

import PublicToolbarByLink from './PublicToolbarByLink'
import PublicToolbarCozyToCozy from './PublicToolbarCozyToCozy'

/**
 * Returns if the shortcut for the sharing is created on the recipient's cozy
 *
 * To know if the shortcut is created on the recipient's cozy, we need to check
 * the presence of the `instance` attribute on the sharing member. (since we
 * are in a cozy to cozy sharing, we have only one member per "token")
 *
 * If this field is setted, it means the stack knows the url of the recipient's
 * cozy. And if the stack knows that, we're sure that the stack has already created
 * the shortcut on the recipient's cozy.
 *
 * @param {Array} included
 */
const isShortcutCreatedOnTheRecipientCozy = included => {
  const sharingMember = included.find(
    item => item.type === 'io.cozy.sharings.members'
  )
  if (sharingMember && sharingMember.attributes.instance) {
    return true
  }
  return false
}

const PublicToolbar = ({ hasWriteAccess, refreshFolderContent, files }) => {
  const [discoveryLink, setDiscoveryLink] = useState()
  const [isSharingShortcutCreated, setIsSharingSharingcutCreated] = useState(
    false
  )
  const [sharing, setSharing] = useState()
  const [loading, setLoading] = useState(true)
  const client = useClient()

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

          const { data: sharing } = await client
            .getStackClient()
            .fetchJSON('GET', `/sharings/${sharingId}`)
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
  return (
    <>
      {loading && null}
      {!loading &&
        !discoveryLink && (
          <PublicToolbarByLink
            files={files}
            hasWriteAccess={hasWriteAccess}
            refreshFolderContent={refreshFolderContent}
          />
        )}

      {!loading &&
        discoveryLink && (
          <PublicToolbarCozyToCozy
            discoveryLink={discoveryLink}
            files={files}
            isSharingShortcutCreated={isSharingShortcutCreated}
            sharing={sharing}
          />
        )}
    </>
  )
}

PublicToolbar.propTypes = {
  files: PropTypes.array.isRequired,
  // hasWriteAccess is only required if we're in a sharing by link
  hasWriteAccess: PropTypes.bool,
  // refreshFolderContent is not required if we're displaying only one file or in a cozy to cozy sharing
  refreshFolderContent: PropTypes.func
}

export default PublicToolbar
