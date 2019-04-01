import styles from './share.styl'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { UserAvatar as Owner } from './components/Recipient'
import WhoHasAccess from './components/WhoHasAccess'

import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import { getDisplayName } from '.'

export class SharingDetailsModal extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
    f: PropTypes.object.isRequired
  }
  render() {
    const { t, f } = this.context
    const {
      onClose,
      sharingType,
      owner,
      recipients,
      document,
      documentType = 'Document',
      onRevoke
    } = this.props
    return (
      <Modal
        title={t(`${documentType}.share.details.title`)}
        secondaryAction={onClose}
        className={styles['share-modal']}
        into="body"
        size="small"
        mobileFullscreen
      >
        <ModalContent className={styles['share-modal-content']}>
          <div className={styles['share-details']}>
            <Owner
              name={t(`${documentType}.share.sharedBy`, {
                name: getDisplayName(owner)
              })}
              url={owner.instance}
            />
            <div className={styles['share-details-created']}>
              {t(`${documentType}.share.details.createdAt`, {
                date: f(document.created_at || null, 'Do MMMM YYYY')
              })}
            </div>
            <div className={styles['share-details-perm']}>
              {t(
                `${documentType}.share.details.${
                  sharingType === 'one-way' ? 'ro' : 'rw'
                }`
              )}
            </div>
            <div className={styles['share-details-perm-desc']}>
              {t(
                `${documentType}.share.details.desc.${
                  sharingType === 'one-way' ? 'ro' : 'rw'
                }`
              )}
            </div>
          </div>
          <hr className={styles['divider']} />
          <WhoHasAccess
            title={t('Share.recipients.accessCount', {
              count: recipients.length
            })}
            recipients={recipients}
            document={document}
            documentType={documentType}
            onRevoke={onRevoke}
          />
        </ModalContent>
      </Modal>
    )
  }
}
