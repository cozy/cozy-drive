/* global cozy */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import realtime from 'cozy-realtime'
import PropTypes from 'prop-types'

import {
  getOpenedFolderId,
  getVisibleFiles,
  addFile,
  updateFile,
  deleteFile
} from 'drive/web/modules/navigation/duck'
import { updateOfflineFileCopyIfNecessary } from 'drive/mobile/modules/offline/duck'

export class RealtimeFiles extends React.Component {
  realtimeListener = null
  pouchListener = null
  static contextTypes = {
    client: PropTypes.object.isRequired
  }
  componentWillMount() {
    const { stackClient: client } = this.context.client
    const { token, uri } = client
    this.realtimeListener = realtime
      .subscribe(
        {
          token: token.token || token.accessToken,
          url: uri
        },
        'io.cozy.files'
      )
      .onCreate(this.onDocumentChange)
      .onUpdate(this.onDocumentChange)
      .onDelete(this.onDocumentDeletion)
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    if (db) {
      this.pouchListener = db.changes({
        since: 'now',
        live: true,
        include_docs: true
      })
      this.pouchListener
        .on('change', change => {
          if (change.deleted) this.onDocumentDeletion(change.doc)
          else this.onDocumentChange(change.doc)
        })
        .on('error', err => {
          // eslint-disable-next-line no-console
          console.warn('Pouch changefeed error', err)
        })
    }
  }
  /* 
  I know, willReceiveProps is deprecated but we use the old API context
  */
  componentWillReceiveProps(nextProps, nextContext) {
    const { stackClient: client } = nextContext.client
    const { token, uri } = client
    if (token !== this.context.client.stackClient.token) {
      // eslint-disable-next-line no-console
      console.log('Update realtime token')
      if (this.realtimeListener) {
        this.realtimeListener.unsubscribe()
        this.realtimeListener = null
      }
      this.realtimeListener = realtime
        .subscribe(
          {
            token: token.token || token.accessToken,
            url: uri
          },
          'io.cozy.files'
        )
        .onCreate(this.onDocumentChange)
        .onUpdate(this.onDocumentChange)
        .onDelete(this.onDocumentDeletion)
    }
  }
  onDocumentChange = rawDoc => {
    const doc = this.normalizeId(rawDoc)
    const previousDoc = this.props.files.find(f => f.id === doc.id)

    const docIsInCurrentView = this.isInCurrentView(doc)
    const docWasInCurrentView = previousDoc && this.isInCurrentView(previousDoc)

    if (docWasInCurrentView && !docIsInCurrentView) this.props.deleteFile(doc)
    else if (!previousDoc && docIsInCurrentView) this.props.addFile(doc)
    else if (previousDoc && docIsInCurrentView) {
      this.props.updateFile(doc)
      this.props.updateOfflineFileCopyIfNecessary(doc, previousDoc)
    }
  }

  onDocumentDeletion = doc => {
    if (this.isInCurrentView(doc)) this.props.deleteFile(this.normalizeId(doc))
  }

  isInCurrentView(doc) {
    const { location, files, openedFolderId } = this.props

    if (location.pathname.match(/^\/recent/)) {
      const earliest = files[files.length - 1]
      const isMostRecent = earliest
        ? earliest.updated_at < doc.updated_at
        : true
      return doc.type !== 'directory' && isMostRecent
    } else {
      return doc.dir_id === openedFolderId
    }
  }

  normalizeId = doc => ({ ...doc, id: doc._id })

  componentWillUnmount() {
    if (this.realtimeListener) this.realtimeListener.unsubscribe()
    if (this.pouchListener) this.pouchListener.cancel()
  }

  render() {
    return this.props.children ? this.props.children : null
  }
}

const mapStateToProps = state => ({
  openedFolderId: getOpenedFolderId(state),
  files: getVisibleFiles(state)
})

const mapDispatchToProps = dispatch => ({
  addFile: file => dispatch(addFile(file)),
  updateFile: file => dispatch(updateFile(file)),
  deleteFile: file => dispatch(deleteFile(file)),
  updateOfflineFileCopyIfNecessary: (file, prevFile) =>
    dispatch(updateOfflineFileCopyIfNecessary(file, prevFile))
})

const RealtimeFilesConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RealtimeFiles))

export default RealtimeFilesConnected
