/* global cozy */
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { ROOT_DIR_ID } from 'drive/constants/config'
import { translate } from 'cozy-ui/react/I18n'
import { withBreakpoints } from 'cozy-ui/react'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'

import { IntentButton } from 'drive/web/modules/services/components/Intent'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import { SharedRecipients, SharedDocument } from 'sharing'

import styles from 'drive/styles/toolbar'

import NotRootFolder from 'drive/web/modules/drive/Toolbar/components/NotRootFolder'
import DeleteButton from './Toolbar/components/DeleteButton'
import SelectableItem from './Toolbar/components/SelectableItem'
import AddFolder from './Toolbar/components/AddFolder'
import UploadButtonItem from './Toolbar/components/UploadButtonItem'
import DownloadButtonItem from './Toolbar/components/DownloadButtonItem'
import ShareButtonItem from './Toolbar/components/ShareButtonItem'
import ShareButtonBig from './Toolbar/components/ShareButtonBig'
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
            <ShareButtonItem />
          </Item>
        </NotRootFolder>
        {canUpload &&
          hasWriteAccess && (
            <Item>
              <UploadButtonItem insideMoreMenu disabled={isDisabled} />
            </Item>
          )}
        {canCreateFolder &&
          hasWriteAccess && (
            <Item>
              <AddFolder />
            </Item>
          )}
        <NotRootFolder>
          <Item>
            <DownloadButtonItem />
          </Item>
        </NotRootFolder>
        <SelectableItem>
          <a className={styles['fil-action-select']}>
            {t('toolbar.menu_select')}
          </a>
        </SelectableItem>
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
          hasWriteAccess && <UploadButtonItem disabled={isDisabled} />}
        {notRootfolder && <SharedRecipients docId={displayedFolder.id} />}
        {notRootfolder && <ShareButtonBig isDisabled={isDisabled} />}

        {isMobile ? <BarRight>{MoreMenu}</BarRight> : MoreMenu}
      </div>
    )
  }
}
const mapStateToProps = (state, ownProps) => ({
  displayedFolder: state.view.displayedFolder,
  selectionModeActive: isSelectionBarVisible(state)
})

const ToolbarWithSharingContext = props =>
  !props.displayedFolder ? (
    <Toolbar {...props} />
  ) : (
    <SharedDocument docId={props.displayedFolder.id}>
      {({ isShared, hasWriteAccess }) => (
        <Toolbar
          {...props}
          hasWriteAccess={hasWriteAccess}
          isShared={isShared}
        />
      )}
    </SharedDocument>
  )
export default translate()(
  withRouter(
    withBreakpoints()(connect(mapStateToProps, null)(ToolbarWithSharingContext))
  )
)
