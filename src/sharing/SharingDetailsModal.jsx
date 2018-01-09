import styles from './share.styl'

import React, { Component } from 'react'
import { cozyConnect, fetchSharings } from 'cozy-client'
import { UserAvatar } from './components/Recipient'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

const Owner = UserAvatar

export class SharingDetailsModal extends Component {
  render() {
    const { t, f } = this.context
    const { onClose, sharing, document, documentType = 'Document' } = this.props
    return (
      <Modal
        title={t(`${documentType}.share.details.title`)}
        secondaryAction={onClose}
      >
        <ModalContent>
          <Owner name={t(`${documentType}.share.sharedWithMe`)} />
          <div className={styles['share-details-created']}>
            {t(`${documentType}.share.details.createdAt`, {
              date: f(document.created_at || null, 'Do MMMM YYYY')
            })}
          </div>
          <div className={styles['share-details-perm']}>
            {t(
              `${documentType}.share.details.${
                sharing.sharingType === 'one-way' ? 'ro' : 'rw'
              }`
            )}
          </div>
        </ModalContent>
      </Modal>
    )
  }
}

export default cozyConnect(ownProps => ({
  sharing: fetchSharings(ownProps.document._type, ownProps.document._id)
}))(SharingDetailsModal)
