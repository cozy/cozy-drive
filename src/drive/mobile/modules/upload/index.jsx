import React, { Component } from 'react'
import localforage from 'localforage'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { Query, withClient } from 'cozy-client'

import { translate } from 'cozy-ui/transpiled/react'
import { Modal } from 'cozy-ui/transpiled/react'

import { uploadFilesFromNative } from 'drive/web/modules/upload'

import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import Header from 'drive/web/modules/move/Header'
import Explorer from 'drive/web/modules/move/Explorer'
import FileList from 'drive/web/modules/move/FileList'
import Loader from 'drive/web/modules/move/Loader'
import LoadMore from 'drive/web/modules/move/LoadMore'
import Footer from 'drive/web/modules/move/Footer'
import Topbar from 'drive/web/modules/move/Topbar'

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
    folderId: ROOT_DIR_ID
  }
  async componentDidMount() {
    const items = await localforage.getItem('importedFiles')
    this.setState({ items })
  }

  async uploadFiles() {
    const { items, folderId } = this.state
    const { router, uploadFilesFromNative } = this.props
    const filesForQueue = generateForQueue(items)
    uploadFilesFromNative(filesForQueue, folderId, this.callbackSuccess)
    //just to be sure that first dispatch of uploadFilesFromNative was done
    setTimeout(() => router.push(`/folder/${folderId}`), 50)
  }

  callbackSuccess = () => {
    const { items } = this.state
    const { t } = this.props
    Alerter.success(t('ImportToDrive.success', { smart_count: items.length }))
    localforage.removeItem('importedFiles')
  }

  navigateTo = folder => {
    this.setState({ folderId: folder.id })
  }

  contentQuery = client => {
    return client
      .find('io.cozy.files')
      .where({
        dir_id: this.state.folderId,
        _id: {
          $ne: TRASH_DIR_ID
        }
      })
      .indexFields(['dir_id', 'type', 'name', '_id'])
      .sortBy([{ dir_id: 'asc' }, { type: 'asc' }, { name: 'asc' }])
  }
  breadcrumbQuery = client => {
    return client.get('io.cozy.files', this.state.folderId)
  }
  onClose = () => {
    const { router } = this.props
    localforage.removeItem('importedFiles')
    router.push('/')
  }

  render() {
    const { items, folderId, uploadInProgress } = this.state
    const { t } = this.props
    return (
      <Modal
        size={'xlarge'}
        closable={false}
        overflowHidden
        mobileFullscreen
        into="body"
        aria-label={t('Move.modalTitle')}
        className={'u-mih-100'}
      >
        <Header
          entries={items}
          onClose={this.onClose}
          title={t('ImportToDrive.title', { smart_count: items.length })}
          subTitle={t('ImportToDrive.to')}
        />
        <Query query={this.breadcrumbQuery} key={`breadcrumb-${folderId}`}>
          {({ data, fetchStatus }) => (
            <Topbar
              navigateTo={this.navigateTo}
              currentDir={data}
              fetchStatus={fetchStatus}
            />
          )}
        </Query>
        <Query query={this.contentQuery} key={`content-${folderId}`}>
          {({ data, fetchStatus, hasMore, fetchMore }) => {
            return (
              <Explorer>
                <Loader fetchStatus={fetchStatus} hasNoData={data.length === 0}>
                  <div>
                    <FileList
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
        <Footer
          onConfirm={() => this.uploadFiles()}
          onClose={this.onClose}
          targets={items}
          currentDirId={folderId}
          isMoving={uploadInProgress}
          primaryTextAction={t('ImportToDrive.action')}
          secondaryTextAction={t('ImportToDrive.cancel')}
        />
      </Modal>
    )
  }
}

DumbUpload.propTypes = {
  t: PropTypes.func.isRequired,
  router: PropTypes.func.isRequired,
  uploadFilesFromNative: PropTypes.func.isRequired
}
const mapDispatchToProps = dispatch => ({
  uploadFilesFromNative: (files, folderId, successCallback) =>
    dispatch(uploadFilesFromNative(files, folderId, successCallback))
})

export default compose(
  translate(),
  withClient,
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(DumbUpload)
