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
      needsContactsPermission,
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
        {(hasSharedParent || hasSharedChild) && (
          <div className={styles['share-byemail-onlybylink']}>
            {t(`${documentType}.share.shareByEmail.onlyByLink`, {
              type: t(
                `${documentType}.share.shareByEmail.type.${
                  document.type === 'directory' ? 'folder' : 'file'
                }`
              )
            })}{' '}
            <strong>
              {t(
                `${documentType}.share.shareByEmail.${
                  hasSharedParent ? 'hasSharedParent' : 'hasSharedChild'
                }`
              )}
            </strong>
          </div>
        )}
        <ModalContent className={styles['share-modal-content']}>
          {documentType !== 'Albums' &&
            !hasSharedParent &&
            !hasSharedChild && (
              <DumbShareByEmail
                document={document}
                documentType={documentType}
                sharingDesc={sharingDesc}
                contacts={contacts}
                createContact={createContact}
                onShare={onShare}
                needsContactsPermission={needsContactsPermission}
              />
            )}
          <hr className={styles['divider']} />
          <div className={styles['share-modal-secondary']}>
            <DumbShareByLink
              document={document}
              documentType={documentType}
              checked={link !== null}
              link={link}
              onEnable={onShareByLink}
              onDisable={onRevokeLink}
            />
            {documentType !== 'Albums' && (
              <WhoHasAccess
                className={styles['share-modal-access']}
                isOwner={isOwner}
                recipients={recipients}
                document={document}
                documentType={documentType}
                onRevoke={onRevoke}
              />
            )}
          </div>
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
  needsContactsPermission: PropTypes.bool,
  hasSharedParent: PropTypes.bool,
  hasSharedChild: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onShareByLink: PropTypes.func.isRequired,
  onRevokeLink: PropTypes.func.isRequired
}
