/* global cozy */
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { showModal } from 'react-cozy-helpers'

import { ROOT_DIR_ID } from 'drive/constants/config'
import { translate } from 'cozy-ui/react/I18n'
import { withBreakpoints } from 'cozy-ui/react'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'

import { IntentButton } from 'drive/web/modules/services/components/Intent'
import UploadButton from 'drive/web/modules/upload/UploadButton'

import {
  downloadFiles,
  trashFiles,
  uploadFiles
} from 'drive/web/modules/navigation/duck'
import {
  showSelectionBar,
  isSelectionBarVisible
} from 'drive/web/modules/selection/duck'
import { showNewFolderInput } from 'drive/web/modules/filelist/duck'
import {
  ShareButton,
  ShareModal,
  SharedDocument,
  SharedRecipients
} from 'sharing'
import { RecipientsAvatars } from 'sharing/components/Recipient'

import styles from 'drive/styles/toolbar'

import NotRootFolder from 'drive/web/modules/drive/Toolbar/components/NotRootFolder'
import DeleteButton from './Toolbar/components/DeleteButton'

const { BarRight } = cozy.bar

class Toolbar extends Component {
  render() {
    const cozyDev = cozy.client._url === 'http://cozy.tools:8080'
    const cozyRecette = cozy.client._url === 'https://recette.cozy.works'
    const {
      t,
      disabled,
      selectionModeActive,
      displayedFolder,
      canUpload,
      canCreateFolder,
      hasWriteAccess,
      isShared,
      isSharedWithMe,
      sharingRecipients,
      sharingLink,
      showSelectionBar,
      addFolder,
      uploadFiles,
      share,
      downloadAll,
      breakpoints: { isMobile }
    } = this.props

    const notRootfolder = displayedFolder && displayedFolder.id !== ROOT_DIR_ID

    const isDisabled = disabled || selectionModeActive

    const MoreMenu = (
      <Menu
        title={t('toolbar.item_more')}
        disabled={isDisabled}
        className={styles['fil-toolbar-menu']}
        innerClassName={styles['fil-toolbar-inner-menu']}
        button={<MoreButton>{t('Toolbar.more')}</MoreButton>}
      >
        <NotRootFolder>
          <Item>
            <a
              className={styles['fil-action-share']}
              onClick={() => share(displayedFolder)}
            >
              {t(isSharedWithMe ? 'Files.share.sharedWithMe' : 'toolbar.share')}
              <RecipientsAvatars
                className={styles['fil-toolbar-menu-recipients']}
                recipients={sharingRecipients}
                link={sharingLink}
                size="small"
              />
            </a>
          </Item>
        </NotRootFolder>
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
        {canCreateFolder &&
          hasWriteAccess && (
            <Item>
              <a className={styles['fil-action-newfolder']} onClick={addFolder}>
                {t('toolbar.menu_new_folder')}
              </a>
            </Item>
          )}
        <NotRootFolder>
          <Item>
            <a
              className={styles['fil-action-download']}
              onClick={() => downloadAll([displayedFolder])}
            >
              {t('toolbar.menu_download_folder')}
            </a>
          </Item>
        </NotRootFolder>
        <Item>
          <a className={styles['fil-action-select']} onClick={showSelectionBar}>
            {t('toolbar.menu_select')}
          </a>
        </Item>
        <NotRootFolder>
          <hr />
        </NotRootFolder>
        <NotRootFolder>
          <DeleteButton />
        </NotRootFolder>
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
              disabled={isDisabled}
              onUpload={files => uploadFiles(files, displayedFolder)}
              label={t('toolbar.item_upload')}
              className={classNames(styles['c-btn'], styles['u-hide--mob'])}
            />
          )}
        {notRootfolder && <SharedRecipients docId={displayedFolder.id} />}
        {notRootfolder && (
          <ShareButton
            docId={displayedFolder.id}
            disabled={isDisabled}
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
  displayedFolder: state.view.displayedFolder,
  selectionModeActive: isSelectionBarVisible(state)
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  addFolder: () => dispatch(showNewFolderInput()),
  showSelectionBar: () => dispatch(showSelectionBar()),
  uploadFiles: (files, displayedFolder) => {
    dispatch(uploadFiles(files, displayedFolder.id))
  },
  share: displayedFolder =>
    dispatch(
      showModal(
        <ShareModal
          document={displayedFolder}
          documentType="Files"
          sharingDesc={displayedFolder.name}
        />
      )
    ),
  downloadAll: folder => dispatch(downloadFiles(folder))
})

const ToolbarWithSharingContext = props =>
  !props.displayedFolder ? (
    <Toolbar {...props} />
  ) : (
    <SharedDocument docId={props.displayedFolder.id}>
      {({
        isShared,
        isSharedWithMe,
        hasWriteAccess,
        recipients,
        link,
        onLeave
      }) => (
        <Toolbar
          {...props}
          hasWriteAccess={hasWriteAccess}
          isShared={isShared}
          isSharedWithMe={isSharedWithMe}
          sharingRecipients={recipients}
          sharingLink={link}
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
