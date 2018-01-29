import styles from './share.styl'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  cozyConnect,
  fetchSharings,
  fetchContacts,
  share,
  unshare,
  shareByLink,
  revokeLink
} from 'cozy-client'
import Modal from 'cozy-ui/react/Modal'

import ShareByLink from './components/ShareByLink'
import ShareByEmail from './components/ShareByEmail'

const shunt = (cond, BaseComponent, OtherComponent) => props =>
  cond() ? <BaseComponent {...props} /> : <OtherComponent {...props} />

const ComingSoon = (props, context) => (
  <div className={styles['coz-form-group']}>
    <p
      className={styles['coz-form-desc']}
      style={
        {
          maxWidth: '30rem'
        } /* no need for a class as it is temporary screen */
      }
    >
      {context.t(`${props.documentType}.share.shareByEmail.comingsoon`)}
    </p>
  </div>
)

const displayShareEmail = () =>
  new URL(window.location).searchParams.get('sharingiscaring') !== null

const ShareByEmailComingSoon = shunt(
  displayShareEmail,
  ShareByEmail,
  ComingSoon
)

export class ShareModal extends Component {
  render() {
    const { t } = this.context
    const {
      onClose,
      sharing,
      sharingDesc,
      share,
      unshare,
      shareByLink,
      revokeLink,
      contacts,
      document,
      documentType = 'Document'
    } = this.props

    return (
      <Modal
        title={t(`${documentType}.share.title`)}
        dismissAction={onClose}
        className={styles['share-modal']}
        into="body"
      >
        <div className={styles['share-modal-content']}>
          {withSharingCheck(document, documentType, t)(
            <ShareByEmailComingSoon
              document={document}
              documentType={documentType}
              recipients={sharing.recipients}
              contacts={contacts.data}
              sharingDesc={sharingDesc}
              onShare={share}
              onUnshare={unshare}
            />
          )}
          <hr className={styles['divider']} />
          <ShareByLink
            document={this.props.document}
            documentType={documentType}
            checked={!!sharing.sharingLink}
            link={sharing.sharingLink}
            onEnable={shareByLink}
            onDisable={revokeLink}
          />
        </div>
      </Modal>
    )
  }
}

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

export default cozyConnect(
  ownProps => ({
    sharing: fetchSharings(ownProps.document._type, ownProps.document._id, {
      include: ['recipients']
    }),
    contacts: fetchContacts() // TODO: we shouldn't have to fetch contacts manually, it should be handled automatically when using the include: ['recipients'] option
  }),
  (dispatch, ownProps) => ({
    share: (document, recipients, sharingType, sharingDesc) =>
      dispatch(share(document, recipients, sharingType, sharingDesc)),
    unshare: (document, recipient) => dispatch(unshare(document, recipient)),
    shareByLink: document => dispatch(shareByLink(document)),
    revokeLink: document => dispatch(revokeLink(document))
  })
)(ShareModal)
