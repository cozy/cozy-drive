import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { Empty } from 'cozy-ui/react'

import Container from 'drive/web/modules/drive/Container'
import {
  FETCH_SHARINGS,
  FETCH_SHARINGS_SUCCESS,
  FETCH_SHARINGS_FAILURE
} from 'drive/web/modules/navigation/duck/actions'
import SharedDocuments from 'sharing/components/SharedDocuments'

import { makeCancelable } from 'lib/promise'

import { openFolder, getFolderUrl } from 'drive/web/modules/navigation/duck'

export class SharingFetcher extends React.Component {
  state = {
    error: null
  }

  static contextTypes = {
    client: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.fetchSharedFiles = null
    this.fetSharedParents = null
  }
  async fetchSharedDocuments() {
    const { sharedDocuments } = this.props
    const { client } = this.context

    try {
      this.props.startFetch()
      this.setState({ error: null })

      this.fetchSharedFiles = makeCancelable(
        client.collection('io.cozy.files').all({ keys: sharedDocuments })
      )

      const resp = await this.fetchSharedFiles.promise
      const parentIds = resp.data.map(f => f.dir_id)
      this.fetSharedParents = makeCancelable(
        client.collection('io.cozy.files').all({
          keys: parentIds
        })
      )
      const parentsResp = await this.fetSharedParents.promise
      const parents = parentsResp.data
      const files = resp.data.sort((a, b) => {
        if (a.type === 'directory' && b.type !== 'directory') return -1
        else if (a.type !== 'directory' && b.type === 'directory') return 1
        else return a.name.localeCompare(b.name)
      })

      const filesWithPath = files.map(file => ({
        ...file,
        path: parents.find(d => d.id === file.dir_id).path
      }))
      this.props.fetchSuccess(filesWithPath)
    } catch (e) {
      /*
      If the error is a cancelable promise, don't use setState sinnce the
      component is not mounted anymore
      */
      if (e.isCanceled !== true) {
        this.setState({ error: e })
        this.props.fetchFailure(e)
      }
    }
  }

  componentDidMount() {
    if (!get(this.props, 'params.folderId')) {
      this.fetchSharedDocuments()
    } else {
      this.props.onFolderOpen(this.props.params.folderId, false)
    }
  }
  componentWillUnmount() {
    //In order to not dispatch fetch sucess, we cancel the promises
    if (this.fetchSharedFiles) this.fetchSharedFiles.cancel()
    if (this.fetSharedParents) this.fetSharedParents.cancel()
  }


  async componentDidUpdate(prevProps) {
    const { sharedDocuments } = this.props

    const hasNewSharings =
      sharedDocuments.length !== prevProps.sharedDocuments.length ||
      sharedDocuments.find(id => !prevProps.sharedDocuments.includes(id)) !==
        undefined
    const isOnSharingsRoot = !this.props.params.folderId
    const wasOnSharingsRoot = !prevProps.params.folderId

    const movedToSharedRoot = isOnSharingsRoot && !wasOnSharingsRoot
    const movedAwayFromSharedRoot = !isOnSharingsRoot && wasOnSharingsRoot

    if (isOnSharingsRoot && hasNewSharings) {
      // in case the list of sharings changes while we're on the sharings view root
      this.fetchSharedDocuments()
    }
    else if (movedToSharedRoot) {
      // if we start the navigation inside a folder in the saring view, and navigate back to the root, we need to load the root content again
      this.fetchSharedDocuments()
    }
    else if (movedAwayFromSharedRoot) {
      // in case we open a folder from the root fo the sharing view
      this.props.onFolderOpen(this.props.params.folderId)
    }
  }

  render() {
    const { ...otherProps } = this.props
    const { error } = this.state
    const { t } = this.context
    return error ? (
      <Empty
        icon="cozy"
        title={t('Sharings.unavailable.title')}
        text={t('Sharings.unavailable.message')}
      />
    ) : (
      <Container
        isTrashContext={false}
        canSort={false}
        canDrop={false}
        canUpload={false}
        canCreateFolder={false}
        canMove={false}
        withFilePath
        {...otherProps}
      />
    )
  }
}

const ConnectedSharingFetcher = connect(
  null,
  (dispatch, ownProps) => ({
    startFetch: () =>
      dispatch({
        type: FETCH_SHARINGS,
        meta: {
          cancelSelection: true
        }
      }),
    fetchSuccess: files =>
      dispatch({
        type: FETCH_SHARINGS_SUCCESS,
        fileCount: files.length,
        files
      }),
    fetchFailure: e =>
      dispatch({
        type: FETCH_SHARINGS_FAILURE,
        error: e
      }),
    onFolderOpen: (folderId, forceRoutePush = true) => {
      dispatch(
        openFolder(
          folderId,
          OPEN_FOLDER_FROM_SHARINGS,
          OPEN_FOLDER_FROM_SHARINGS_SUCCESS,
          OPEN_FOLDER_FROM_SHARINGS_FAILURE
        )
      )
      if (forceRoutePush)
        ownProps.router.push(getFolderUrl(folderId, ownProps.location))
    }
  })
)(SharingFetcher)

const SharingsContainer = props => (
  <SharedDocuments>
    {({ sharedDocuments }) => (
      <ConnectedSharingFetcher {...props} sharedDocuments={sharedDocuments} />
    )}
  </SharedDocuments>
)
export const OPEN_FOLDER_FROM_SHARINGS = 'OPEN_FOLDER_FROM_SHARINGS'
export const OPEN_FOLDER_FROM_SHARINGS_SUCCESS =
  'OPEN_FOLDER_FROM_SHARINGS_SUCCESS'
export const OPEN_FOLDER_FROM_SHARINGS_FAILURE =
  'OPEN_FOLDER_FROM_SHARINGS_FAILURE'
export default SharingsContainer
