import styles from './share.styl'

import React, { Component } from 'react'
import Recipient from './components/Recipient'
import Modal from 'cozy-ui/react/Modal'

const Owner = Recipient

export class SharingDetailsModal extends Component {
  render () {
    const { t, f } = this.context
    const { onClose, sharing, documentType = 'Document' } = this.props
    return (
      <Modal
        title={t(`${documentType}.share.details.title`)}
        secondaryAction={onClose}
      >
        <div className={styles['pho-share-modal-content']}>
          <Owner name={t(`${documentType}.share.sharedWithMe`)} url={sharing.sharer.url} />
          <div className={styles['pho-share-details-created']}>
            {t(`${documentType}.share.details.createdAt`, { date: f(sharing.sharer.createdAt, 'Do MMMM YYYY') })}
          </div>
          <div className={styles['pho-share-details-perm']}>
            {t(`${documentType}.share.details.${sharing.sharer.sharingType === 'master-slave' ? 'ro' : 'rw'}`)}
          </div>
        </div>
      </Modal>
    )
  }
}

export default SharingDetailsModal
