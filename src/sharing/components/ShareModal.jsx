import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Contact, Group } from 'models'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import styles from 'sharing/share.styl'

import { default as DumbShareByLink } from 'sharing/components/ShareByLink'
import { default as DumbShareByEmail } from 'sharing/components/ShareByEmail'
import WhoHasAccess from 'sharing/components/WhoHasAccess'

require('url-polyfill')

export default class ShareModal extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired
  }
  render() {
    const { t } = this.context
    const {
      document,
      isOwner,
      sharingDesc,
      contacts,
      groups,
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
        spacing="small"
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
        <ModalContent
          className={cx(
            styles['share-modal-content'],
            styles['share-moral-override-bottom']
          )}
        >
          {documentType !== 'Albums' &&
            !hasSharedParent &&
            !hasSharedChild && (
              <DumbShareByEmail
                document={document}
                documentType={documentType}
                sharingDesc={sharingDesc}
                contacts={contacts}
                groups={groups}
                createContact={createContact}
                onShare={onShare}
                needsContactsPermission={needsContactsPermission}
              />
            )}
          <div className={styles['share-modal-separator']} />
          <div className={styles['share-modal-secondary']}>
            <div className={cx(styles['share-modal-margins'], 'u-pb-1')}>
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
                  className={'u-mt-1'}
                  isOwner={isOwner}
                  recipients={recipients}
                  document={document}
                  documentType={documentType}
                  onRevoke={onRevoke}
                />
              )}
            </div>
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
  contacts: PropTypes.arrayOf(Contact.propType).isRequired,
  groups: PropTypes.arrayOf(Group.propType).isRequired,
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
