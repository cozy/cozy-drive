import styles from './share.styl'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import { default as DumbShareByLink } from './components/ShareByLink'
import { default as DumbShareByEmail } from './components/ShareByEmail'
import WhoHasAccess from './components/WhoHasAccess'

require('url-polyfill')

export default class ShareModal extends Component {
  render() {
    const { t } = this.context
    const {
      document,
      isOwner,
      sharingDesc,
      contacts,
      createContact,
      link,
      recipients,
      documentType = 'Document',
      hasSharedParent,
      hasSharedChild,
      onClose,
      onShare,
      onRevoke,
      onShareByLink,
      onRevokeLink
    } = this.props
    return (
      <Modal
        title={t(`${documentType}.share.title`)}
        dismissAction={onClose}
        into="body"
        size="small"
        mobileFullscreen
      >
        <ModalContent className={styles['share-modal-content']}>
          <DumbShareByEmail
            document={document}
            documentType={documentType}
            sharingDesc={sharingDesc}
            contacts={contacts}
            createContact={createContact}
            onShare={onShare}
            hasSharedParent={hasSharedParent}
            hasSharedChild={hasSharedChild}
          />
          <hr className={styles['divider']} />
          <DumbShareByLink
            document={document}
            documentType={documentType}
            checked={link !== null}
            link={link}
            onEnable={onShareByLink}
            onDisable={onRevokeLink}
          />
          <WhoHasAccess
            isOwner={isOwner}
            recipients={recipients}
            document={document}
            documentType={documentType}
            onRevoke={onRevoke}
            className={styles['share-modal-access']}
          />
        </ModalContent>
      </Modal>
    )
  }
}

ShareModal.propTypes = {
  document: PropTypes.object.isRequired,
  isOwner: PropTypes.bool,
  sharingDesc: PropTypes.string,
  contacts: PropTypes.array.isRequired,
  createContact: PropTypes.func.isRequired,
  recipients: PropTypes.array.isRequired,
  link: PropTypes.string,
  documentType: PropTypes.string,
  hasSharedParent: PropTypes.bool,
  hasSharedChild: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onShareByLink: PropTypes.func.isRequired,
  onRevokeLink: PropTypes.func.isRequired
}
