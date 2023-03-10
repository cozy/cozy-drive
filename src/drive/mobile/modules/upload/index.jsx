import React, { Component } from 'react'
import localforage from 'localforage'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Query, withClient } from 'cozy-client'
import { withVaultClient } from 'cozy-keys-lib'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { translate } from 'cozy-ui/transpiled/react'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import { uploadFilesFromNative } from 'drive/web/modules/upload'
import { ROOT_DIR_ID } from 'drive/constants/config'
import Header from 'drive/web/modules/move/Header'
import Explorer from 'drive/web/modules/move/Explorer'
import FileList from 'drive/web/modules/move/FileList'
import Loader from 'drive/web/modules/move/Loader'
import LoadMore from 'drive/web/modules/move/LoadMore'
import Footer from 'drive/web/modules/move/Footer'
import Topbar from 'drive/web/modules/move/Topbar'
import {
  startMediaBackup,
  cancelMediaBackup
} from 'drive/mobile/modules/mediaBackup/duck'
import {
  buildMoveOrImportQuery,
  buildOnlyFolderQuery
} from 'drive/web/modules/queries'

export const generateForQueue = files => {
  const filesForQueue = []
  files.map(file => {
    filesForQueue.push({ file: file, isDirectory: false })
  })
  return filesForQueue
}

export class DumbUpload extends Component {
  state = {
    items: [],
    folder: { _id: ROOT_DIR_ID }
  }
  async componentDidMount() {
    const { stopMediaBackup } = this.props
    stopMediaBackup()
    const items = await localforage.getItem('importedFiles')
    this.setState({ items: items || [] })
  }

  async uploadFiles() {
    const { items, folder } = this.state
    const { router, uploadFilesFromNative, client, vaultClient } = this.props

    const filesForQueue = generateForQueue(items)
    uploadFilesFromNative(filesForQueue, folder._id, this.callbackSuccess, {
      client,
      vaultClient
    })
    // just to be sure that first dispatch of uploadFilesFromNative was done
    // we replace the URL to be sure that even with the back button on Android
    // we don't arrive on this component
    setTimeout(() => router.replace(`/folder/${folder._id}`), 50)
  }

  callbackSuccess = () => {
    const { items } = this.state
    const { t, startMediaBackup } = this.props
    Alerter.success(t('ImportToDrive.success', { smart_count: items.length }))
    localforage.removeItem('importedFiles')
    startMediaBackup()
  }

  navigateTo = folder => {
    this.setState({ folder: folder || { _id: ROOT_DIR_ID } })
  }

  onClose = () => {
    const { router } = this.props
    localforage.removeItem('importedFiles')
    // we replace the URL to be sure that even with the back button on Android
    // we don't arrive on this component
    router.replace('/')
  }

  render() {
    const { items, folder, uploadInProgress } = this.state
    const { t } = this.props
    const contentQuery = buildMoveOrImportQuery(folder._id)
    const folderQuery = buildOnlyFolderQuery(folder._id)

    return (
      <FixedDialog
        open
        onClose={this.onClose}
        size="large"
        classes={{ paper: 'u-h-100' }}
        title={
          <>
            <Header
              entries={items}
              title={t('ImportToDrive.title', { smart_count: items.length })}
              subTitle={t('ImportToDrive.to')}
            />
            <Query
              query={folderQuery.definition()}
              fetchPolicy={folderQuery.options.fetchPolicy}
              as={folderQuery.options.as}
              key={`breadcrumb-${folder._id}`}
            >
              {({ data, fetchStatus }) => (
                <Topbar
                  navigateTo={this.navigateTo}
                  currentDir={data}
                  fetchStatus={fetchStatus}
                />
              )}
            </Query>
          </>
        }
        content={
          <Query
            key={`content-${folder._id}`}
            query={contentQuery.definition()}
            fetchPolicy={contentQuery.options.fetchPolicy}
            as={contentQuery.options.as}
          >
            {({ data, fetchStatus, hasMore, fetchMore }) => {
              return (
                <Explorer>
                  <Loader
                    fetchStatus={fetchStatus}
                    hasNoData={data.length === 0}
                  >
                    <div>
                      <FileList
                        folder={folder}
                        files={data}
                        targets={items}
                        navigateTo={this.navigateTo}
                      />
                      <LoadMore hasMore={hasMore} fetchMore={fetchMore} />
                    </div>
                  </Loader>
                </Explorer>
              )
            }}
          </Query>
        }
        actions={
          <Footer
            onConfirm={() => this.uploadFiles()}
            onClose={this.onClose}
            targets={items}
            currentDirId={folder._id}
            isMoving={uploadInProgress}
            primaryTextAction={t('ImportToDrive.action')}
            secondaryTextAction={t('ImportToDrive.cancel')}
          />
        }
      />
    )
  }
}

DumbUpload.propTypes = {
  t: PropTypes.func.isRequired,
  router: PropTypes.func.isRequired,
  uploadFilesFromNative: PropTypes.func.isRequired
}
const mapDispatchToProps = dispatch => ({
  uploadFilesFromNative: (
    files,
    folderId,
    successCallback,
    { client, vaultClient }
  ) =>
    dispatch(
      uploadFilesFromNative(files, folderId, successCallback, {
        client,
        vaultClient
      })
    ),
  stopMediaBackup: () => dispatch(cancelMediaBackup()),
  startMediaBackup: () => dispatch(startMediaBackup())
})

export default compose(
  translate(),
  withClient,
  withVaultClient,
  connect(null, mapDispatchToProps)
)(DumbUpload)
