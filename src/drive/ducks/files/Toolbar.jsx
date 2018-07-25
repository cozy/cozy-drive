/* global cozy */
import styles from '../../styles/toolbar'

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { showModal } from 'react-cozy-helpers'

import { ROOT_DIR_ID } from '../../constants/config'
import { translate } from 'cozy-ui/react/I18n'
import { withBreakpoints } from 'cozy-ui/react'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'

import { IntentButton } from '../../components/Intent'
import UploadButton from '../../components/UploadButton'

import { addToUploadQueue } from '../upload'
import {
  uploadedFile,
  uploadQueueProcessed,
  downloadFiles,
  trashFiles
} from '../../actions'
import {
  ShareButton,
  ShareModal,
  SharedDocument,
  SharedRecipients
} from 'sharing'

const { BarRight } = cozy.bar

class Toolbar extends Component {
  render() {
    const cozyDev = cozy.client._url === 'http://cozy.tools:8080'
    const cozyRecette = cozy.client._url === 'https://recette.cozy.works'
    const {
      t,
      disabled,
      displayedFolder,
      actions,
      onSelectItemsClick,
      canUpload,
      hasWriteAccess,
      isShared,
      isSharedWithMe,
      uploadFiles,
      share,
      downloadAll,
      trashFolder,
      onLeave,
      breakpoints: { isMobile }
    } = this.props

    const notRootfolder = displayedFolder && displayedFolder.id !== ROOT_DIR_ID

    const MoreMenu = (
      <Menu
        title={t('toolbar.item_more')}
        disabled={disabled}
        className={styles['fil-toolbar-menu']}
        button={<MoreButton>{t('Toolbar.more')}</MoreButton>}
      >
        {notRootfolder && (
          <Item>
            <a
              className={styles['fil-action-share']}
              onClick={() => share(displayedFolder)}
            >
              {t(isSharedWithMe ? 'Files.share.sharedWithMe' : 'toolbar.share')}
            </a>
          </Item>
        )}
        {canUpload &&
          hasWriteAccess && (
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
        {notRootfolder && <hr />}
        {notRootfolder &&
          (isSharedWithMe ? (
            <Item>
              <a
                className={classNames(styles['fil-action-delete'])}
                onClick={() =>
                  onLeave(displayedFolder).then(() =>
                    trashFolder(displayedFolder)
                  )
                }
              >
                {t('toolbar.leave')}
              </a>
            </Item>
          ) : (
            <Item>
              <a
                className={classNames(styles['fil-action-delete'])}
                onClick={() => trashFolder(displayedFolder)}
              >
                {t('toolbar.trash')}
              </a>
            </Item>
          ))}
      </Menu>
    )

    return (
      <div className={styles['fil-toolbar-files']} role="toolbar">
        {!isShared &&
          (cozyDev || cozyRecette ? (
            <IntentButton
              className={styles['u-hide--mob']}
              action="CREATE"
              docType="io.cozy.accounts"
              data={{
                dataType: 'bill',
                closeable: false
              }}
              label={t('service.bills')}
            />
          ) : null)}
        {!isShared &&
          canUpload &&
          hasWriteAccess && (
            <UploadButton
              disabled={disabled}
              onUpload={files => uploadFiles(files, displayedFolder)}
              label={t('toolbar.item_upload')}
              className={classNames(styles['c-btn'], styles['u-hide--mob'])}
            />
          )}
        {notRootfolder && <SharedRecipients docId={displayedFolder.id} />}
        {notRootfolder && (
          <ShareButton
            docId={displayedFolder.id}
            disabled={disabled}
            onClick={() => share(displayedFolder)}
            className={styles['u-hide--mob']}
          />
        )}

        {isMobile ? <BarRight>{MoreMenu}</BarRight> : MoreMenu}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  displayedFolder: state.view.displayedFolder
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadFiles: (files, displayedFolder) => {
    dispatch(
      addToUploadQueue(
        files,
        displayedFolder.id,
        file => dispatch(uploadedFile(file)),
        (loaded, quotas, conflicts, networkErrors, errors) =>
          uploadQueueProcessed(
            loaded,
            quotas,
            conflicts,
            networkErrors,
            errors,
            ownProps.t
          )
      )
    )
  },
  share: displayedFolder =>
    dispatch({
      ...showModal(
        <ShareModal
          document={displayedFolder}
          documentType="Files"
          sharingDesc={displayedFolder.name}
        />
      ),
      meta: {
        hideActionMenu: true
      }
    }),
  downloadAll: folder => dispatch(downloadFiles(folder)),
  trashFolder: folder =>
    dispatch(trashFiles([folder])).then(() => {
      ownProps.router.push(`/folder/${folder.parent.id}`)
    })
})

const ToolbarWithSharingContext = props =>
  !props.displayedFolder ? (
    <Toolbar {...props} />
  ) : (
    <SharedDocument docId={props.displayedFolder.id}>
      {({ isShared, isSharedWithMe, hasWriteAccess, onLeave }) => (
        <Toolbar
          {...props}
          hasWriteAccess={hasWriteAccess}
          isShared={isShared}
          isSharedWithMe={isSharedWithMe}
          onLeave={onLeave}
        />
      )}
    </SharedDocument>
  )

export default translate()(
  withRouter(
    withBreakpoints()(
      connect(mapStateToProps, mapDispatchToProps)(ToolbarWithSharingContext)
    )
  )
)
