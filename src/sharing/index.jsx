import React, { Component } from 'react'
import createReactContext from 'create-react-context'
import { Query } from 'cozy-client'
import { getTracker } from 'cozy-ui/react/helpers/tracker'

import reducer, {
  receiveSharings,
  addSharing,
  addSharingLink,
  revokeSharingLink,
  revokeRecipient,
  revokeSelf,
  isOwner,
  getOwner,
  getRecipients,
  getSharingForRecipient,
  getSharingForSelf,
  getSharingType,
  getSharingLink,
  getDocumentPermissions
} from './state'

import { default as DumbSharedBadge } from './components/SharedBadge'
import {
  default as DumbShareButton,
  SharedByMeButton,
  SharedWithMeButton
} from './components/ShareButton'
import { default as DumbShareModal } from './ShareModal'
import { SharingDetailsModal } from './SharingDetailsModal'
import { RecipientsAvatars } from './components/Recipient'

const getPrimaryOrFirst = property => obj => {
  if (!obj[property] || obj[property].length === 0) return ''
  return obj[property].find(property => property.primary) || obj[property][0]
}

export const getDisplayName = ({ name, public_name, email }) =>
  name || public_name || email

// TODO: sadly we have different versions of contacts' doctype to handle...
// A migration tool on the stack side is needed here
export const getPrimaryEmail = contact =>
  Array.isArray(contact.email)
    ? getPrimaryOrFirst('email')(contact).address
    : contact.email

export const getPrimaryCozy = contact =>
  Array.isArray(contact.cozy)
    ? getPrimaryOrFirst('cozy')(contact).url
    : contact.url

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
const isFile = ({ _type }) => _type === 'io.cozy.files'

const SharingContext = createReactContext()

export default class SharingProvider extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      byDocId: {},
      sharings: [],
      permissions: [],
      documentType: props.documentType || 'Document',
      isOwner: docId => isOwner(this.state, docId),
      getOwner: docId => getOwner(this.state, docId),
      getSharingType: docId => getSharingType(this.state, docId),
      getRecipients: docId => getRecipients(this.state, docId),
      getSharingLink: document => getSharingLink(this.state, document),
      share: this.share,
      revoke: this.revoke,
      revokeSelf: this.revokeSelf,
      shareByLink: this.shareByLink,
      revokeSharingLink: this.revokeSharingLink
    }
  }

  dispatch = action =>
    this.setState(state => ({ ...state, ...reducer(state, action) }))

  componentDidMount() {
    Promise.all([
      this.context.client
        .collection('io.cozy.sharings')
        .findByDoctype(this.props.doctype),
      this.context.client
        .collection('io.cozy.permissions')
        .findLinksByDoctype(this.props.doctype),
      this.context.client.collection('io.cozy.permissions').findApps()
    ]).then(([sharings, permissions, apps]) =>
      this.dispatch(
        receiveSharings({
          sharings: sharings.data,
          permissions: permissions.data,
          apps: apps.data
        })
      )
    )
  }

  share = async (document, recipients, sharingType, description) => {
    const resp = await this.context.client
      .collection('io.cozy.sharings')
      .share(document, recipients, sharingType, description)
    this.dispatch(addSharing(resp.data))
    return resp.data
  }

  revoke = async (document, recipientEmail) => {
    const sharing = getSharingForRecipient(
      this.state,
      document.id,
      recipientEmail
    )
    await this.context.client
      .collection('io.cozy.sharings')
      .revokeRecipient(sharing, recipientEmail)
    this.dispatch(revokeRecipient(sharing, recipientEmail))
  }

  revokeSelf = async document => {
    const sharing = getSharingForSelf(this.state, document.id)
    await this.context.client.collection('io.cozy.sharings').revokeSelf(sharing)
    this.dispatch(revokeSelf(sharing))
  }

  shareByLink = async document => {
    trackSharingByLink(document)
    const resp = await this.context.client
      .collection('io.cozy.permissions')
      .createSharingLink(document)
    this.dispatch(addSharingLink(resp.data))
    return resp
  }

  revokeSharingLink = async document => {
    // Because some duplicate links have been created in the past, we must ensure
    // we revoke all of them
    const perms = getDocumentPermissions(this.state, document.id)
    await Promise.all(
      perms.map(p =>
        this.context.client.collection('io.cozy.permissions').destroy(p)
      )
    )
    this.dispatch(revokeSharingLink(perms))
  }

  render() {
    // WARN: whe shouldn't do this (https://reactjs.org/docs/context.html#caveats)
    // but if we don't, consumers don't rerender when the state changes after loading the sharings,
    // probably because the state object remains the same...
    return (
      <SharingContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </SharingContext.Provider>
    )
  }
}

export const SharedDocument = ({ docId, children }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner, getSharingType, revokeSelf } = {}) =>
      children({
        hasWriteAccess:
          !byDocId ||
          !byDocId[docId] ||
          isOwner(docId) ||
          getSharingType(docId) === 'two-way',
        isShared: byDocId !== undefined && byDocId[docId],
        isSharedByMe: byDocId !== undefined && byDocId[docId] && isOwner(docId),
        isSharedWithMe:
          byDocId !== undefined && byDocId[docId] && !isOwner(docId),
        onLeave: revokeSelf
      })
    }}
  </SharingContext.Consumer>
)

export const SharedStatus = ({ docId, className }, { t }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner } = {}) => (
      <span className={className}>
        {!byDocId || !byDocId[docId]
          ? '—'
          : isOwner(docId)
            ? t('Files.share.sharedByMe')
            : t('Files.share.sharedWithMe')}
      </span>
    )}}
  </SharingContext.Consumer>
)

export const SharedBadge = ({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner } = {}) =>
      !byDocId || !byDocId[docId] ? null : (
        <DumbSharedBadge byMe={isOwner(docId)} {...rest} />
      )
    }}
  </SharingContext.Consumer>
)

export const SharedRecipients = ({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, getRecipients } = {}) =>
      !byDocId || !byDocId[docId] ? null : (
        <RecipientsAvatars recipients={getRecipients(docId).reverse()} />
      )
    }}
  </SharingContext.Consumer>
)

export const ShareButton = ({ docId, ...rest }, { t }) => (
  <SharingContext.Consumer>
    {({ byDocId, documentType, isOwner }) =>
      !byDocId[docId] ? (
        <DumbShareButton label={t(`${documentType}.share.cta`)} {...rest} />
      ) : isOwner(docId) ? (
        <SharedByMeButton
          label={t(`${documentType}.share.sharedByMe`)}
          {...rest}
        />
      ) : (
        <SharedWithMeButton
          label={t(`${documentType}.share.sharedWithMe`)}
          {...rest}
        />
      )
    }
  </SharingContext.Consumer>
)

const OwnerSharingModal = ({ document, ...rest }) => (
  <SharingContext.Consumer>
    {({
      documentType,
      getRecipients,
      getSharingLink,
      share,
      revoke,
      shareByLink,
      revokeSharingLink,
      byDocId
    }) => (
      <Query query={cozy => cozy.all('io.cozy.contacts')}>
        {({ data }, { createDocument: createContact }) => (
          <DumbShareModal
            document={document}
            documentType={documentType}
            contacts={data}
            createContact={createContact}
            recipients={getRecipients(document.id)}
            link={getSharingLink(document)}
            isShared={byDocId[document.id] !== undefined}
            onShare={share}
            onRevoke={revoke}
            onShareByLink={shareByLink}
            onRevokeLink={revokeSharingLink}
            {...rest}
          />
        )}
      </Query>
    )}
  </SharingContext.Consumer>
)

const SharingModal = ({ document, ...rest }) => (
  <SharingContext.Consumer>
    {({
      documentType,
      getOwner,
      getSharingType,
      getRecipients,
      revokeSelf
    }) => (
      <SharingDetailsModal
        document={document}
        documentType={documentType}
        owner={getOwner(document.id)}
        sharingType={getSharingType(document.id)}
        recipients={getRecipients(document.id)}
        onRevoke={revokeSelf}
        {...rest}
      />
    )}
  </SharingContext.Consumer>
)

export const ShareModal = ({ document, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner }) =>
      !byDocId[document.id] || isOwner(document.id) ? (
        <OwnerSharingModal document={document} {...rest} />
      ) : (
        <SharingModal document={document} {...rest} />
      )
    }
  </SharingContext.Consumer>
)
