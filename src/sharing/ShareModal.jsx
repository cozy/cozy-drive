import styles from './share.styl'

import React, { Component } from 'react'
import { cozyConnect, fetchCollection, fetchSharings, share, unshare, shareByLink, revokeLink } from 'redux-cozy-client'
import Modal from 'cozy-ui/react/Modal'
import { Tab, Tabs, TabList, TabPanels, TabPanel } from 'cozy-ui/react/Tabs'

import ShareByLink from './components/ShareByLink'
import ShareByEmail from './components/ShareByEmail'

export class ShareModal extends Component {
  render () {
    const { t } = this.context
    const { onClose, sharing, sharingDesc, share, unshare, shareByLink, revokeLink, contacts, documentType = 'Document' } = this.props
    // TODO: temporary
    const loaded = contacts.fetchStatus === 'loaded'
    return (
      <Modal
        title={t(`${documentType}.share.title`)}
        secondaryAction={onClose}
      >
        <Tabs initialActiveTab='email'>
          <TabList className={styles['pho-share-modal-tabs']}>
            <Tab name='email'>
              {t(`${documentType}.share.shareByEmail.title`)}
            </Tab>
            <Tab name='link'>
              {t(`${documentType}.share.shareByLink.title`)}
            </Tab>
          </TabList>
          <TabPanels className={styles['pho-share-modal-content']}>
            <TabPanel name='email'>
              {loaded && <ShareByEmail
                document={this.props.document}
                documentType={documentType}
                recipients={sharing.recipients}
                contacts={contacts.data}
                sharingDesc={sharingDesc}
                onShare={share}
                onUnshare={unshare}
              />}
            </TabPanel>
            <TabPanel name='link'>
              <ShareByLink
                document={this.props.document}
                documentType={documentType}
                checked={!!sharing.sharingLink}
                link={sharing.sharingLink}
                onEnable={shareByLink}
                onDisable={revokeLink}
              />
            </TabPanel>
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
    contacts: fetchCollection('contacts', 'io.cozy.contacts')
  }),
  (dispatch, ownProps) => ({
    share: (document, recipients, sharingType, sharingDesc) => dispatch(share(document, recipients, sharingType, sharingDesc)),
    unshare: (document, recipient) => dispatch(unshare(document, recipient)),
    shareByLink: (document) => dispatch(shareByLink(document)),
    revokeLink: (document) => dispatch(revokeLink(document))
  })
)(ShareModal)
