import React, { Component } from 'react'
import PropTypes from 'prop-types'
import createReactContext from 'create-react-context'
import { Query } from 'cozy-client'
import { getTracker } from 'cozy-ui/react/helpers/tracker'

import reducer, {
  receiveSharings,
  addSharing,
  updateSharing,
  addSharingLink,
  revokeSharingLink,
  revokeRecipient,
  revokeSelf,
  receivePaths,
  isOwner,
  canReshare,
  getOwner,
  getRecipients,
  getSharingById,
  getSharingForSelf,
  getSharingType,
  getSharingLink,
  getSharingDocIds,
  getDocumentSharing,
  getDocumentPermissions,
  hasSharedParent,
  hasSharedChild
} from './state'

import { default as DumbSharedBadge } from './components/SharedBadge'
import {
  default as DumbShareButton,
  SharedByMeButton,
  SharedWithMeButton
} from './components/ShareButton'
import { default as DumbShareModal } from './ShareModal'
import { SharingDetailsModal } from './SharingDetailsModal'
import { default as RecipientsList } from './components/WhoHasAccessLight'
import { RecipientsAvatars } from './components/Recipient'
import { default as DumbSharedStatus } from './components/SharedStatus'

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
  static contextTypes = {
    client: PropTypes.object.isRequired
  }
  constructor(props, context) {
    super(props, context)
    const instanceUri = this.context.client.options.uri
    const documentType = props.documentType || 'Document'
    this.state = {
      byDocId: {},
      sharings: [],
      permissions: [],
      sharedFolderPaths: [],
      documentType,
      isOwner: docId => isOwner(this.state, docId),
      canReshare: docId => canReshare(this.state, docId, instanceUri),
      getOwner: docId => getOwner(this.state, docId),
      getSharingType: docId => getSharingType(this.state, docId, instanceUri),
      getRecipients: docId => getRecipients(this.state, docId),
      getSharingLink: docId => getSharingLink(this.state, docId, documentType),
      hasSharedParent: document => hasSharedParent(this.state, document),
      hasSharedChild: document => hasSharedChild(this.state, document),
      share: this.share,
      revoke: this.revoke,
      revokeSelf: this.revokeSelf,
      shareByLink: this.shareByLink,
      revokeSharingLink: this.revokeSharingLink
    }
  }

  dispatch = action =>
    this.setState(state => ({ ...state, ...reducer(state, action) }))

  async componentDidMount() {
    const { client } = this.context
    const { doctype } = this.props
    const [sharings, permissions, apps] = await Promise.all([
      client.collection('io.cozy.sharings').findByDoctype(doctype),
      client.collection('io.cozy.permissions').findLinksByDoctype(doctype),
      client.collection('io.cozy.permissions').findApps()
    ])
    this.dispatch(
      receiveSharings({
        instanceUri: client.options.uri,
        sharings: sharings.data,
        permissions: permissions.data,
        apps: apps.data
      })
    )
    if (doctype !== 'io.cozy.files') return

    const sharedDocIds = sharings.data
      .map(s => getSharingDocIds(s))
      .reduce((acc, val) => acc.concat(val), [])
    const resp = await client.collection(doctype).all({ keys: sharedDocIds })
    const folderPaths = resp.data
      .filter(f => f.type === 'directory')
      .map(f => f.path)
    const filePaths = await this.getFilesPaths(
      resp.data.filter(f => f.type !== 'directory')
    )
    this.dispatch(receivePaths([...folderPaths, ...filePaths]))
  }

  getFilesPaths = async files => {
    const parentDirIds = files
      .map(f => f.dir_id)
      .filter((f, idx, arr) => arr.indexOf(f) === idx)
    const parentDirs = await this.context.client
      .collection(this.props.doctype)
      .all({ keys: parentDirIds })
    const filePaths = files.map(f => {
      const parentDirPath = parentDirs.data.find(d => d.id === f.dir_id).path
      return parentDirPath === '/' ? `/${f.name}` : `${parentDirPath}/${f.name}`
    })
    return filePaths
  }

  share = async (document, recipients, sharingType, description) => {
    const sharing = getDocumentSharing(this.state, document.id)
    if (sharing) return this.addRecipients(sharing, recipients, sharingType)
    const resp = await this.context.client
      .collection('io.cozy.sharings')
      .share(document, recipients, sharingType, description, '/preview')
    this.dispatch(
      addSharing(
        resp.data,
        document.path || (await this.getFilesPaths([document]))
      )
    )
    return resp.data
  }

  addRecipients = async (sharing, recipients, sharingType) => {
    const resp = await this.context.client
      .collection('io.cozy.sharings')
      .addRecipients(sharing, recipients, sharingType)
    this.dispatch(updateSharing(resp.data))
  }

  revoke = async (document, sharingId, recipientIndex) => {
    const sharing = getSharingById(this.state, sharingId)
    await this.context.client
      .collection('io.cozy.sharings')
      .revokeRecipient(sharing, recipientIndex)
    this.dispatch(
      revokeRecipient(
        sharing,
        recipientIndex,
        document.path || (await this.getFilesPaths([document]))
      )
    )
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

export const SharedDocuments = ({ children }) => (
  <SharingContext.Consumer>
    {({ sharings } = { sharings: [] }) =>
      children({
        sharedDocuments: sharings.map(
          sharing => sharing.attributes.rules[0].values[0]
        )
      })
    }
  </SharingContext.Consumer>
)

export const SharedDocument = ({ docId, children }) => (
  <SharingContext.Consumer>
    {({
      byDocId,
      isOwner,
      getSharingType,
      getRecipients,
      getSharingLink,
      revokeSelf
    } = {}) =>
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
        recipients: getRecipients(docId),
        link: getSharingLink(docId) !== null,
        onLeave: revokeSelf
      })
    }
  </SharingContext.Consumer>
)

export const SharedStatus = ({ docId, className }) => (
  <SharingContext.Consumer>
    {({ byDocId, getRecipients, getSharingLink } = {}) =>
      !byDocId || !byDocId[docId] ? (
        <span className={className}>—</span>
      ) : (
        <DumbSharedStatus
          className={className}
          recipients={getRecipients(docId)}
          docId={docId}
          link={getSharingLink(docId) !== null}
        />
      )
    }
  </SharingContext.Consumer>
)

export const SharedBadge = ({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner } = {}) =>
      !byDocId || !byDocId[docId] ? null : (
        <DumbSharedBadge byMe={isOwner(docId)} {...rest} />
      )
    }
  </SharingContext.Consumer>
)

export const SharedRecipients = ({ docId, onClick, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, getRecipients, getSharingLink } = {}) =>
      !byDocId || !byDocId[docId] ? null : (
        <RecipientsAvatars
          recipients={getRecipients(docId)}
          link={getSharingLink(docId) !== null}
          onClick={onClick}
          {...rest}
        />
      )
    }
  </SharingContext.Consumer>
)

export const SharedRecipientsList = ({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner, getRecipients } = {}) =>
      !byDocId || !byDocId[docId] || !isOwner(docId) ? null : (
        <RecipientsList
          recipients={getRecipients(docId).filter(r => r.status !== 'owner')}
          {...rest}
        />
      )
    }
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

const EditableSharingModal = ({ document, ...rest }) => (
  <SharingContext.Consumer>
    {({
      documentType,
      isOwner,
      getRecipients,
      getSharingLink,
      share,
      revoke,
      shareByLink,
      revokeSharingLink,
      hasSharedParent,
      hasSharedChild
    }) => (
      <Query query={cozy => cozy.all('io.cozy.contacts')}>
        {(
          { data, fetchStatus, lastError },
          { createDocument: createContact }
        ) => (
          <DumbShareModal
            document={document}
            documentType={documentType}
            contacts={data}
            createContact={createContact}
            recipients={getRecipients(document.id)}
            link={getSharingLink(document.id)}
            isOwner={isOwner(document.id)}
            needsContactsPermission={
              fetchStatus === 'failed' && lastError.status === 403
            }
            hasSharedParent={hasSharedParent(document)}
            hasSharedChild={hasSharedChild(document)}
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
    {({ byDocId, isOwner, canReshare }) =>
      !byDocId[document.id] ||
      isOwner(document.id) ||
      canReshare(document.id) ? (
        <EditableSharingModal document={document} {...rest} />
      ) : (
        <SharingModal document={document} {...rest} />
      )
    }
  </SharingContext.Consumer>
)
