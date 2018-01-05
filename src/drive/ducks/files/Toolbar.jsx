/* global cozy */
import styles from '../../styles/toolbar'

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { ROOT_DIR_ID } from '../../constants/config'
import { alertShow } from 'cozy-ui/react/Alerter'
import { translate } from 'cozy-ui/react/I18n'
import { withBreakpoints } from 'cozy-ui/react'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'

import { IntentButton } from '../../components/Intent'
import QuotaAlert from '../../components/QuotaAlert'
import UploadButton from '../../components/UploadButton'

import { alert } from '../../lib/confirm'
import { addToUploadQueue } from '../upload'
import { uploadedFile, downloadFiles, trashFiles } from '../../actions'
import {
  ShareButton,
  SharedWithMeButton,
  ShareModal,
  SharingDetailsModal
} from 'sharing'
import { leave, getSharingDetails } from 'cozy-client'

const { BarRight } = cozy.bar

const toggleShowShareModal = state => ({
  ...state,
  showShareModal: !state.showShareModal
})

const ALERT_LEVEL_INFO = 'info'
const ALERT_LEVEL_ERROR = 'error'
const ALERT_LEVEL_SUCCESS = 'success'

class Toolbar extends Component {
  state = {
    showShareModal: false
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
      leaveFolder,
      breakpoints: { isMobile }
    } = this.props
    const notRootfolder = displayedFolder && displayedFolder.id !== ROOT_DIR_ID
    const hasWriteAccess =
      canUpload && (!shared.withMe || shared.sharingType === 'master-master')

    const MoreMenu = (
      <Menu
        title={t('toolbar.item_more')}
        disabled={disabled}
        className={styles['fil-toolbar-menu']}
        button={<MoreButton>{t('Toolbar.more')}</MoreButton>}
      >
        {notRootfolder &&
          !shared.withMe && (
            <Item>
              <a
                className={styles['fil-action-share']}
                onClick={() => this.setState(toggleShowShareModal)}
              >
                {t('toolbar.share')}
              </a>
            </Item>
          )}
        {shared.withMe && (
          <Item>
            <a
              className={styles['fil-action-share']}
              onClick={() => this.setState(toggleShowShareModal)}
            >
              {t('Files.share.sharedWithMe')}
            </a>
          </Item>
        )}
        {hasWriteAccess && (
          <Item>
            <UploadButton
              onUpload={files => uploadFiles(files, displayedFolder)}
              label={t('toolbar.menu_upload')}
              className={styles['fil-action-upload']}
            />
          </Item>
        )}
        {actions.addFolder &&
          hasWriteAccess && (
            <Item>
              <a
                className={styles['fil-action-newfolder']}
                onClick={actions.addFolder}
              >
                {t('toolbar.menu_new_folder')}
              </a>
            </Item>
          )}
        {notRootfolder && (
          <Item>
            <a
              className={styles['fil-action-download']}
              onClick={() => downloadAll([displayedFolder])}
            >
              {t('toolbar.menu_download_folder')}
            </a>
          </Item>
        )}
        <Item>
          <a
            className={styles['fil-action-select']}
            onClick={onSelectItemsClick}
          >
            {t('toolbar.menu_select')}
          </a>
        </Item>
        {shared.withMe && <hr />}
        {shared.withMe && (
          <Item>
            <a
              className={classNames(styles['fil-action-delete'])}
              onClick={() => leaveFolder(displayedFolder)}
            >
              {t('toolbar.leave')}
            </a>
          </Item>
        )}
      </Menu>
    )

    return (
      <div className={styles['fil-toolbar-files']} role="toolbar">
        {!shared.withMe &&
          (cozyDev || cozyRecette
            ? (console.warn('IntentButton is displayed only on dev or recette'),
              (
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
              ))
            : null)}
        {hasWriteAccess && (
          <UploadButton
            disabled={disabled}
            onUpload={files => uploadFiles(files, displayedFolder)}
            label={t('toolbar.item_upload')}
            className={classNames(styles['c-btn'], styles['u-hide--mob'])}
          />
        )}
        {notRootfolder &&
          !shared.withMe && (
            <ShareButton
              disabled={disabled}
              onClick={() => this.setState(toggleShowShareModal)}
              label={t('toolbar.share')}
              className={styles['u-hide--mob']}
            />
          )}
        {shared.withMe && (
          <SharedWithMeButton
            label={t('Files.share.sharedWithMe')}
            onClick={() => this.setState(toggleShowShareModal)}
            className={styles['u-hide--mob']}
          />
        )}

        {isMobile ? <BarRight>{MoreMenu}</BarRight> : MoreMenu}

        {this.state.showShareModal &&
          !shared.withMe && (
            <ShareModal
              document={displayedFolder}
              documentType="Files"
              sharingDesc={displayedFolder.name}
              onClose={() => this.setState(toggleShowShareModal)}
            />
          )}
        {this.state.showShareModal &&
          shared.withMe && (
            <SharingDetailsModal
              document={displayedFolder}
              documentType="Files"
              sharing={shared}
              onClose={() => this.setState(toggleShowShareModal)}
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
  withRouter(
    withBreakpoints()(connect(mapStateToProps, mapDispatchToProps)(Toolbar))
  )
)
