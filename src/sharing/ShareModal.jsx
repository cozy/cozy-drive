import styles from './share.styl'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'cozy-ui/react/Modal'
import { getTracker } from 'cozy-ui/react/helpers/tracker'

import { default as DumbShareByLink } from './components/ShareByLink'
import { default as DumbShareByEmail } from './components/ShareByEmail'

require('url-polyfill')

const isFile = ({ _type }) => _type === 'io.cozy.files'

const track = (document, action) => {
  const tracker = getTracker()
  if (!tracker) {
    return
  }
  tracker.push([
    'trackEvent',
    isFile(document) ? 'Drive' : 'Photos',
    action,
    `${action}${isFile(document) ? 'File' : 'Album'}`
  ])
}
const trackSharingByLink = document => track(document, 'shareByLink')

const shunt = (cond, BaseComponent, OtherComponent) => props =>
  cond() ? <BaseComponent {...props} /> : <OtherComponent {...props} />

const ComingSoon = (props, context) => (
  <div className={styles['coz-form-group']}>
    <h3>{context.t(`${props.documentType}.share.shareByEmail.subtitle`)}</h3>
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

class ShareByLink extends Component {
  state = {
    link: null,
    status: 'pending'
  }

  componentDidMount() {
    const { document } = this.props
    this.setState(state => ({ ...state, status: 'loading' }))
    this.collection(document)
      .getSharingLink(document)
      .then(link =>
        this.setState(state => ({
          ...state,
          status: 'loaded',
          link
        }))
      )
      .catch(() => this.setState(state => ({ ...state, status: 'failed' })))
  }

  share = document => {
    trackSharingByLink(document)
    return this.collection(document)
      .createSharingLink(document)
      .then(link =>
        this.setState(state => ({
          ...state,
          link
        }))
      )
      .catch(() => this.setState(state => ({ ...state, status: 'failed' })))
  }

  revoke = document => {
    return this.collection(document)
      .revokeSharingLink(document)
      .then(link =>
        this.setState(state => ({
          ...state,
          link: null
        }))
      )
      .catch(() => this.setState(state => ({ ...state, status: 'failed' })))
  }

  collection(document) {
    return this.context.client.collection(document._type)
  }

  render() {
    const { document, documentType } = this.props
    const { link, status } = this.state
    if (status !== 'loaded') return null
    return (
      <DumbShareByLink
        document={document}
        documentType={documentType}
        checked={link !== null}
        link={link}
        onEnable={this.share}
        onDisable={this.revoke}
      />
    )
  }
}

// TODO: wrap it into a Query when the sharing is ready
const ShareByEmail = ({
  document,
  documentType,
  sharingDesc,
  share = () => {},
  unshare = () => {},
  recipients = [],
  contacts = { data: [] }
}) => (
  <DumbShareByEmail
    document={document}
    documentType={documentType}
    recipients={recipients}
    contacts={contacts.data}
    sharingDesc={sharingDesc}
    onShare={share}
    onUnshare={unshare}
  />
)

const ShareByEmailComingSoon = shunt(
  displayShareEmail,
  ShareByEmail,
  ComingSoon
)

class ModalContent extends Component {
  render() {
    const { t } = this.context
    const { sharingDesc, document, documentType = 'Document' } = this.props

    return (
      <div className={styles['share-modal-content']}>
        <ShareByLink document={document} documentType={documentType} />
        <hr className={styles['divider']} />
        {withSharingCheck(document, documentType, t)(
          <ShareByEmailComingSoon
            document={document}
            documentType={documentType}
            sharingDesc={sharingDesc}
          />
        )}
      </div>
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

export class ShareModal extends Component {
  render() {
    const { t } = this.context
    const { onClose, document, documentType = 'Document' } = this.props

    return (
      <Modal
        title={t(`${documentType}.share.title`)}
        dismissAction={onClose}
        className={styles['share-modal']}
        into="body"
      >
        <ModalContent document={document} documentType={documentType} />
      </Modal>
    )
  }
}

export default ShareModal
