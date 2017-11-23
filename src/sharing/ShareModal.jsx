import styles from './share.styl'

import React, { Component } from 'react'
import {
  cozyConnect,
  fetchSharings,
  fetchContacts,
  fetchApps,
  share,
  unshare,
  shareByLink,
  revokeLink
} from 'cozy-client'
import Modal from 'cozy-ui/react/Modal'
import { Tab, Tabs, TabList, TabPanels, TabPanel } from 'cozy-ui/react/Tabs'

import ShareByLink from './components/ShareByLink'
import ShareByEmail from './components/ShareByEmail'

export class ShareModal extends Component {
  render() {
    const { t } = this.context
    const {
      onClose,
      sharing,
      sharingDesc,
      share,
      unshare,
      shareByLink,
      revokeLink,
      contacts,
      documentType = 'Document'
    } = this.props
    // TODO: temporary
    const loaded = contacts.fetchStatus === 'loaded'

    const enableEmailSharing = window.location.search
      .toLowerCase()
      .includes('sharingiscaring')

    const tabs = [
      <Tab name="link">{t(`${documentType}.share.shareByLink.title`)}</Tab>
    ]
    const tabPanels = [
      <TabPanel name="link">
        <ShareByLink
          document={this.props.document}
          documentType={documentType}
          checked={!!sharing.sharingLink}
          link={sharing.sharingLink}
          onEnable={shareByLink}
          onDisable={revokeLink}
        />
      </TabPanel>
    ]

    if (enableEmailSharing) {
      tabs.push(
        <Tab name="email">{t(`${documentType}.share.shareByEmail.title`)}</Tab>
      )
      tabPanels.push(
        <TabPanel name="email">
          {loaded && (
            <ShareByEmail
              document={this.props.document}
              documentType={documentType}
              recipients={sharing.recipients}
              contacts={contacts.data}
              sharingDesc={sharingDesc}
              onShare={share}
              onUnshare={unshare}
            />
          )}
        </TabPanel>
      )
    }

    return (
      <Modal title={t(`${documentType}.share.title`)} secondaryAction={onClose}>
        <Tabs initialActiveTab="link">
          <TabList className={styles['pho-share-modal-tabs']}>{tabs}</TabList>
          <TabPanels className={styles['pho-share-modal-content']}>
            {tabPanels}
          </TabPanels>
        </Tabs>
      </Modal>
    )
  }
}

export default cozyConnect(
  ownProps => ({
    sharing: fetchSharings(ownProps.document._type, ownProps.document._id, {
      include: ['recipients']
    }),
    // TODO: we shouldn't have to fetch contacts manually, it should be handled
    // automatically when using the include: ['recipients'] option
    contacts: fetchContacts()
  }),
  (dispatch, ownProps) => ({
    share: (document, recipients, sharingType, sharingDesc) =>
      dispatch(share(document, recipients, sharingType, sharingDesc)),
    unshare: (document, recipient) => dispatch(unshare(document, recipient)),
    shareByLink: document => dispatch(shareByLink(document)),
    revokeLink: document => dispatch(revokeLink(document))
  })
)(ShareModal)
