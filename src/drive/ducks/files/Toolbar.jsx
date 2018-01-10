/* global cozy */
import styles from '../../styles/toolbar'

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { ROOT_DIR_ID } from '../../constants/config'
import { alertShow } from 'cozy-ui/react/Alerter'
import { translate } from 'cozy-ui/react/I18n'

import { MoreButton } from 'components/Button'
import Toolbar, { ToolbarAction } from 'components/Toolbar'

import { IntentButton } from '../../components/Intent'
import QuotaAlert from '../../components/QuotaAlert'
import UploadButton from '../../components/UploadButton'

import { alert } from '../../lib/confirm'
import { addToUploadQueue } from '../upload'
import { uploadedFile, downloadFiles, trashFiles } from '../../actions'
import {
  ShareButton,
  SharedWithMeButton,
  SharedByMeButton,
  ShareModal,
  SharingDetailsModal
} from 'sharing'
import { leave, getSharingDetails } from 'cozy-client'

const ALERT_LEVEL_INFO = 'info'
const ALERT_LEVEL_ERROR = 'error'
const ALERT_LEVEL_SUCCESS = 'success'

const ActionShare = props => {
  const { highlighted, shared, onClick, t } = props
  let label, Component

  if (shared.withMe) {
    label = 'Files.share.sharedWithMe'
    Component = SharedWithMeButton
  } else if (shared.byMe) {
    label = 'Files.share.sharedByMe'
    Component = SharedByMeButton
  } else {
    label = 'toolbar.share'
    Component = ShareButton
  }

  return highlighted ? (
    <Component label={t(label)} onClick={onClick} />
  ) : (
    <a className={styles['fil-action-share']} onClick={onClick}>
      {t(label)}
    </a>
  )
}

const ActionUpload = props => {
  const { highlighted, disabled, onUpload, t } = props
  const label = highlighted ? 'toolbar.item_upload' : 'toolbar.menu_upload'
  const className = highlighted ? 'c-btn' : 'fil-action-upload'

  return (
    <UploadButton
      disabled={disabled}
      onUpload={onUpload}
      label={t(label)}
      className={styles[className]}
    />
  )
}

class FilesToolbar extends Component {
  state = {
    showShareModal: false
  }

  toggleShowShareModal = () => {
    this.setState(state => ({
      ...state,
      showShareModal: !state.showShareModal
    }))
  }

  render() {
    const cozyDev = cozy.client._url === 'http://cozy.tools:8080'
    const cozyRecette = cozy.client._url === 'https://recette.cozy.works'
    const {
      t,
      disabled,
      shared,
      displayedFolder,
      actions,
      onSelectItemsClick,
      canUpload,
      uploadFiles,
      downloadAll,
      leaveFolder
    } = this.props
    const notRootfolder = displayedFolder && displayedFolder.id !== ROOT_DIR_ID
    const hasWriteAccess =
      canUpload && (!shared.withMe || shared.sharingType === 'two-way')

    return (
      <div className={styles['fil-toolbar-files']}>
        <Toolbar
          moreMenuTitle={t('toolbar.item_more')}
          moreMenuDisabled={disabled}
          moreMenuClassName={styles['fil-toolbar-menu']}
          moreMenuButton={<MoreButton>{t('Toolbar.more')}</MoreButton>}
        >
          <ToolbarAction
            visible={!shared.withMe && (cozyDev || cozyRecette)}
            highlighted
          >
            <IntentButton
              className={classNames(styles['c-btn'], styles['u-hide--mob'])}
              action="CREATE"
              docType="io.cozy.accounts"
              data={{
                dataType: 'bill',
                closeable: false
              }}
            >
              {t('service.bills')}
            </IntentButton>
          </ToolbarAction>
          <ToolbarAction visible={hasWriteAccess} highlighted={!shared.shared}>
            <ActionUpload
              t={t}
              disabled={disabled}
              onUpload={files => uploadFiles(files, displayedFolder)}
            />
          </ToolbarAction>
          <ToolbarAction visible={notRootfolder} highlighted>
            <ActionShare
              t={t}
              shared={shared}
              onClick={this.toggleShowShareModal}
            />
          </ToolbarAction>
          <ToolbarAction visible={notRootfolder} highlighted={false}>
            <a
              className={styles['fil-action-download']}
              onClick={() => downloadAll([displayedFolder])}
            >
              {t('toolbar.menu_download_folder')}
            </a>
          </ToolbarAction>
          <ToolbarAction
            visible={actions.addFolder && hasWriteAccess}
            highlighted={false}
          >
            <a
              className={styles['fil-action-newfolder']}
              onClick={actions.addFolder}
            >
              {t('toolbar.menu_new_folder')}
            </a>
          </ToolbarAction>
          <ToolbarAction visible highlighted={false}>
            <a
              className={styles['fil-action-select']}
              onClick={onSelectItemsClick}
            >
              {t('toolbar.menu_select')}
            </a>
          </ToolbarAction>
          <ToolbarAction visible={shared.withMe} highlighted={false}>
            <hr />
          </ToolbarAction>
          <ToolbarAction visible={shared.withMe} highlighted={false}>
            <a
              className={styles['fil-action-delete']}
              onClick={() => leaveFolder(displayedFolder)}
            >
              {t('toolbar.leave')}
            </a>
          </ToolbarAction>
        </Toolbar>

        {this.state.showShareModal &&
          !shared.withMe && (
            <ShareModal
              document={displayedFolder}
              documentType="Files"
              sharingDesc={displayedFolder.name}
              onClose={this.toggleShowShareModal}
            />
          )}
        {this.state.showShareModal &&
          shared.withMe && (
            <SharingDetailsModal
              document={displayedFolder}
              documentType="Files"
              sharing={shared}
              onClose={this.toggleShowShareModal}
            />
          )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  displayedFolder: state.view.displayedFolder,
  shared: getSharingDetails(state, 'io.cozy.files', ownProps.folderId)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadFiles: (files, displayedFolder) => {
    dispatch(
      addToUploadQueue(
        files,
        displayedFolder.id,
        file => uploadedFile(file),
        (loaded, quotas, conflicts, errors) => {
          let action = { type: '' } // dummy action, we only use it to trigger an alert notification

          if (quotas.length > 0) {
            // quota errors have their own modal instead of a notification
            alert(<QuotaAlert t={ownProps.t} />)
          } else if (conflicts.length > 0) {
            action.alert = alertShow(
              'upload.alert.success_conflicts',
              { smart_count: loaded.length, conflictNumber: conflicts.length },
              ALERT_LEVEL_INFO
            )
          } else if (errors.length > 0) {
            action.alert = alertShow(
              'upload.alert.errors',
              null,
              ALERT_LEVEL_ERROR
            )
          } else {
            action.alert = alertShow(
              'upload.alert.success',
              { smart_count: loaded.length },
              ALERT_LEVEL_SUCCESS
            )
          }

          return action
        }
      )
    )
  },
  downloadAll: folder => dispatch(downloadFiles(folder)),
  leaveFolder: folder =>
    dispatch(leave(folder))
      .then(() => dispatch(trashFiles([folder])))
      .then(() => ownProps.router.push(`/folder/${folder.parent.id}`))
})

export default translate()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesToolbar))
)
