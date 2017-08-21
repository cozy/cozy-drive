import styles from './share.styl'

import React, { Component } from 'react'
import Modal from 'cozy-ui/react/Modal'
import { Tab, Tabs, TabList, TabPanels, TabPanel } from 'cozy-ui/react/Tabs'

import ShareByLink from './components/ShareByLink'
import ShareByEmail from './components/ShareByEmail'

export class ShareModal extends Component {
  render () {
    const { t } = this.context
    const { onClose, documentType = 'Document' } = this.props
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
              <ShareByEmail document={this.props.document} documentType={documentType} />
            </TabPanel>
            <TabPanel name='link'>
              <ShareByLink document={this.props.document} documentType={documentType} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Modal>
    )
  }
}

export default ShareModal
