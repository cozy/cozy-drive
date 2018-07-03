import styles from './share.styl'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'cozy-ui/react/Modal'

import { default as DumbShareByLink } from './components/ShareByLink'
import { default as DumbShareByEmail } from './components/ShareByEmail'
import WhoHasAccess from './components/WhoHasAccess'

require('url-polyfill')

const shunt = (cond, BaseComponent, OtherComponent) => props =>
  cond() ? <BaseComponent {...props} /> : <OtherComponent {...props} />

const ComingSoon = ({ documentType }, { t }) => (
  <div className={styles['coz-form-group']}>
    <h3>{t(`${documentType}.share.shareByEmail.subtitle`)}</h3>
    <p
      className={styles['coz-form-desc']}
      style={
        {
          maxWidth: '30rem'
        } /* no need for a class as it is temporary screen */
      }
    >
      {t(`${documentType}.share.shareByEmail.comingsoon`)}
    </p>
  </div>
)

const displayShareEmail = () =>
  new URL(window.location).searchParams.get('sharingiscaring') !== null

const ShareByEmailComingSoon = shunt(
  displayShareEmail,
  DumbShareByEmail,
  ComingSoon
)

// TODO: implements
const isSearchParam = value => {
  const searchParam = new URL(window.location).searchParams.get(
    'shareSpecialCase'
  )
  return searchParam ? searchParam.includes(value) : false
}

const hasSharedFolder = id => isSearchParam('hasSharedFolder')
const isInSharedFolder = id => isSearchParam('isInSharedFolder')
const getSpecialCase = id => {
  const specialCase1 = new URL(window.location)
  specialCase1.search = '?shareSpecialCase=isInSharedFolder'
  const specialCase2 = new URL(window.location)
  specialCase2.search = '?shareSpecialCase=hasSharedFolder'
  console.warn(
    `Check the sharing special cases with a query parameter, for instance: ${
      specialCase1.href
    } or ${specialCase2.href}`
  )
  if (hasSharedFolder(id)) {
    return 'hasSharedFolder'
  }
  if (isInSharedFolder(id)) {
    return 'isInSharedFolder'
  }
}

const ShareSpecialCase = ({ documentType, type, specialCase, t }) => (
  <div style={{ margin: 0, backgroundColor: '#f5f6f7' }}>
    <hr className={styles['divider']} />
    <div style={{ padding: '8px 1.5em 1.5em' }}>
      {t(`${documentType}.share.specialCase.base`, { type })}{' '}
      <b>{t(`${documentType}.share.specialCase.${specialCase}`)}</b>
    </div>
  </div>
)

ShareSpecialCase.propTypes = {
  documentType: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  specialCase: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
}

const withSharingCheck = ({ id, type }, documentType, t) => BaseComponent => {
  const specialCase = getSpecialCase(id)
  return specialCase ? (
    <ShareSpecialCase
      documentType={documentType}
      type={type}
      specialCase={specialCase}
      t={t}
    />
  ) : (
    BaseComponent
  )
}

export default class ShareModal extends Component {
  render() {
    const { t } = this.context
    const {
      document,
      sharingDesc,
      contacts,
      createContact,
      link,
      recipients,
      documentType = 'Document',
      isShared,
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
        <div className={styles['share-modal-content']}>
          {withSharingCheck(document, documentType, t)(
            <ShareByEmailComingSoon
              document={document}
              documentType={documentType}
              sharingDesc={sharingDesc}
              contacts={contacts}
              createContact={createContact}
              onShare={onShare}
              locked={isShared}
            />
          )}
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
            isOwner
            title={t(`${documentType}.share.whoHasAccess.title`, {
              smart_count: recipients.length
            })}
            recipients={recipients}
            document={document}
            documentType={documentType}
            onRevoke={onRevoke}
          />
        </div>
      </Modal>
    )
  }
}

ShareModal.propTypes = {
  document: PropTypes.object.isRequired,
  sharingDesc: PropTypes.string,
  contacts: PropTypes.array.isRequired,
  createContact: PropTypes.func.isRequired,
  recipients: PropTypes.array.isRequired,
  link: PropTypes.string,
  documentType: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onShareByLink: PropTypes.func.isRequired,
  onRevokeLink: PropTypes.func.isRequired
}
