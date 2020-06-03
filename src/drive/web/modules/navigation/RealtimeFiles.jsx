/* global cozy */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { withClient } from 'cozy-client'
import CozyRealtime from 'cozy-realtime'
import PropTypes from 'prop-types'

import {
  getOpenedFolderId,
  getVisibleFiles,
  addFile,
  updateFile,
  deleteFile
} from 'drive/web/modules/navigation/duck'
import { updateOfflineFileCopyIfNecessary } from 'drive/mobile/modules/offline/duck'
import logger from 'lib/logger'

export class RealtimeFiles extends React.Component {
  realtimeListener = null
  pouchListener = null

  componentDidMount() {
    const { client } = this.props
    this.realtime = new CozyRealtime({ client })
    this.realtime.subscribe('created', 'io.cozy.files', this.onDocumentChange)
    this.realtime.subscribe('updated', 'io.cozy.files', this.onDocumentChange)
    this.realtime.subscribe('deleted', 'io.cozy.files', this.onDocumentChange)
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
          logger.warn('Pouch changefeed error', err)
        })
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
      const { client } = this.props
      this.props.updateOfflineFileCopyIfNecessary(doc, previousDoc, client)
    }
  }

  onDocumentDeletion = doc => {
    this.props.deleteFile(this.normalizeId(doc))
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
    if (this.realtime) {
      this.realtime.unsubscribe(
        'created',
        'io.cozy.files',
        this.onDocumentChange
      )
      this.realtime.unsubscribe(
        'updated',
        'io.cozy.files',
        this.onDocumentChange
      )
      this.realtime.unsubscribe(
        'deleted',
        'io.cozy.files',
        this.onDocumentChange
      )
    }
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
  updateOfflineFileCopyIfNecessary: (file, prevFile, client) =>
    dispatch(updateOfflineFileCopyIfNecessary(file, prevFile, client))
})

const RealtimeFilesConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withClient(RealtimeFiles)))

RealtimeFiles.propTypes = {
  client: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired
}
export default RealtimeFilesConnected
