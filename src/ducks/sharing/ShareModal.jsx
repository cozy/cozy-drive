import styles from './share.styl'

import React, { Component } from 'react'
import Modal from 'cozy-ui/react/Modal'
import { Tab, Tabs, TabList, TabPanels, TabPanel } from 'cozy-ui/react/Tabs'

import ShareByLink from './components/ShareByLink'
import ShareByEmail from './components/ShareByEmail'

export class ShareModal extends Component {
  render () {
    const { t } = this.context
    const { onClose } = this.props
    return (
      <Modal
        title={t('Albums.share.title')}
        secondaryAction={onClose}
      >
        <Tabs initialActiveTab='email'>
          <TabList className={styles['pho-share-modal-tabs']}>
            <Tab name='email'>
              {t('Albums.share.shareByEmail.title')}
            </Tab>
            <Tab name='link'>
              {t('Albums.share.shareByLink.title')}
            </Tab>
          </TabList>
          <TabPanels className={styles['pho-share-modal-content']}>
            <TabPanel name='email'>
              <ShareByEmail document={this.props.document} />
            </TabPanel>
            <TabPanel name='link'>
              <ShareByLink document={this.props.document} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Modal>
    )
  }
}

export default ShareModal
