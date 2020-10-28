import React from 'react'
import PropTypes from 'prop-types'
import logger from 'lib/logger'
import { withClient } from 'cozy-client'

import { getQueryParameter } from 'react-cozy-helpers'

import PublicToolbarByLink from './PublicToolbarByLink'
import PublicToolbarCozyToCozy from './PublicToolbarCozyToCozy'

/**
 * Returns if the shortcut for the sharing is created on the recipient's cozy
 *
 * To check that, if the `instance` attribute is set to the sharing member then
 * we know that the shortcut is already created
 *
 * @param {Array} included
 */
const hasSharingShorcutCreated = included => {
  const sharingMember = included.find(
    item => item.type === 'io.cozy.sharings.members'
  )
  if (sharingMember && sharingMember.attributes.instance) {
    return true
  }
  return false
}
class PublicToolbar extends React.Component {
  state = {
    discoveryLink: null,
    isSharingShortcutCreated: false
  }

  componentDidMount() {
    if (window.location.pathname === '/preview') this.loadSharingDiscoveryLink()
  }

  async loadSharingDiscoveryLink() {
    try {
      const { client } = this.props
      const response = await client
        .collection('io.cozy.permissions')
        .getOwnPermissions()

      const isSharingShortcutCreated = hasSharingShorcutCreated(
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
      this.setState({ discoveryLink: link, isSharingShortcutCreated, sharing })
    } catch (err) {
      logger.warn('Failed to load sharing discovery link', err)
    }
  }

  render() {
    const { hasWriteAccess, refreshFolderContent, files } = this.props
    const { discoveryLink, isSharingShortcutCreated, sharing } = this.state
    // If there is no DiscoveryLink, it means we're on a sharing by link
    if (!discoveryLink) {
      return (
        <PublicToolbarByLink
          files={files}
          hasWriteAccess={hasWriteAccess}
          refreshFolderContent={refreshFolderContent}
        />
      )
    }

    return (
      <PublicToolbarCozyToCozy
        onDownload={this.downloadFiles}
        discoveryLink={discoveryLink}
        files={files}
        isSharingShortcutCreated={isSharingShortcutCreated}
        sharing={sharing}
      />
    )
  }
}
PublicToolbar.propTypes = {
  files: PropTypes.array.isRequired,
  // hasWriteAccess is only required if we're in a sharing by link
  hasWriteAccess: PropTypes.bool,
  // refreshFolderContent is not required if we're displaying only one file or in a cozy to cozy sharing
  refreshFolderContent: PropTypes.func
}

export default withClient(PublicToolbar)
