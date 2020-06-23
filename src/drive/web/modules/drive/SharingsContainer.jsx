import React from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import Empty from 'cozy-ui/transpiled/react/Empty'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { compose } from 'redux'
import Container from 'drive/web/modules/drive/Container'
import {
  FETCH_SHARINGS,
  FETCH_SHARINGS_SUCCESS,
  FETCH_SHARINGS_FAILURE,
  OPEN_FOLDER_FROM_SHARINGS,
  OPEN_FOLDER_FROM_SHARINGS_SUCCESS,
  OPEN_FOLDER_FROM_SHARINGS_FAILURE
} from 'drive/web/modules/navigation/duck/actions'
import SharedDocuments from 'cozy-sharing/dist/components/SharedDocuments'

import { cancelable as makeCancelable } from 'cozy-client/dist/utils'
import { withClient } from 'cozy-client'
import { openFolder, getFolderUrl } from 'drive/web/modules/navigation/duck'

export class SharingFetcher extends React.Component {
  state = {
    error: null
  }

  constructor(props) {
    super(props)
    this.fetchSharedFiles = null
    this.fetchSharedParents = null
  }
  async fetchSharedDocuments() {
    //!TODO Cozy-Sharing should return all the needed information
    //not just path. We should not run again the request to get the
    // shared stuff
    const { sharedDocuments, client } = this.props

    try {
      this.props.startFetch()
      this.setState({ error: null })
      this.fetchSharedFiles = makeCancelable(
        client.collection('io.cozy.files').all({ keys: sharedDocuments })
      )

      const resp = await this.fetchSharedFiles
      const parentIds = resp.data.map(f => f.dir_id)
      this.fetchSharedParents = makeCancelable(
        client.collection('io.cozy.files').all({
          keys: parentIds
        })
      )
      const parentsResp = await this.fetchSharedParents
      const parents = parentsResp.data
      const files = resp.data.filter(f => !f.trashed).sort((a, b) => {
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
      // if the error is a cancelable promise, don't use setState since the component is not mounted anymore
      if (e.canceled !== true) {
        this.setState({ error: e })
        this.props.fetchFailure(e)
      }
    }
  }

  componentDidMount() {
    if (!get(this.props, 'params.folderId')) {
      if (this.props.hasLoadedAtLeastOnePage) this.fetchSharedDocuments()
    } else {
      this.props.onFolderOpen(this.props.params.folderId, false)
    }
  }
  componentWillUnmount() {
    //In order to not dispatch fetch success, we cancel the promises
    if (this.fetchSharedFiles) this.fetchSharedFiles.cancel()
    if (this.fetchSharedParents) this.fetchSharedParents.cancel()
  }

  async componentDidUpdate(prevProps) {
    const { sharedDocuments, hasLoadedAtLeastOnePage } = this.props
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
      if (hasLoadedAtLeastOnePage) this.fetchSharedDocuments()
    } else if (movedToSharedRoot) {
      // if we start the navigation inside a folder in the sharing view, and navigate back to the root, we need to load the root content again
      this.fetchSharedDocuments()
    } else if (movedAwayFromSharedRoot) {
      // in case we open a folder from the root to the sharing view
      this.props.onFolderOpen(this.props.params.folderId)
    }
  }

  render() {
    const { t, ...otherProps } = this.props
    const { error } = this.state
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

const ConnectedSharingFetcher = compose(
  translate(),
  withClient,
  connect(
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
  )
)(SharingFetcher)

const SharingsContainer = props => (
  <SharedDocuments>
    {({ sharedDocuments, hasLoadedAtLeastOnePage }) => (
      <ConnectedSharingFetcher
        {...props}
        sharedDocuments={sharedDocuments}
        hasLoadedAtLeastOnePage={hasLoadedAtLeastOnePage}
      />
    )}
  </SharedDocuments>
)

export default SharingsContainer
