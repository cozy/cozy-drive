/* global cozy */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import SharingProvider, { SharedDocument } from 'sharing'

import { translate } from 'cozy-ui/react/I18n'
import { withBreakpoints } from 'cozy-ui/react'
import { BarContextProvider } from 'react-cozy-helpers'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

import styles from 'drive/styles/toolbar'

import NotRootFolder from 'drive/web/modules/drive/Toolbar/components/NotRootFolder'

import DeleteItem from './Toolbar/delete/DeleteItem'
import SelectableItem from './Toolbar/selectable/SelectableItem'
import AddFolderItem from './Toolbar/components/AddFolderItem'
import UploadItem from './Toolbar/components/UploadItem'
import DownloadButtonItem from './Toolbar/components/DownloadButtonItem'
import ShareItem from './Toolbar/share/ShareItem'
import ShareButton from './Toolbar/share/ShareButton'
import SharedRecipients from './Toolbar/share/SharedRecipients'
const { BarRight } = cozy.bar

class Toolbar extends Component {
  render() {
    const {
      t,
      disabled,
      selectionModeActive,
      canUpload,
      canCreateFolder,
      hasWriteAccess,
      isShared,
      breakpoints: { isMobile }
    } = this.props

    const isDisabled = disabled || selectionModeActive

    const MoreMenu = (
      <Menu
        title={t('toolbar.item_more')}
        disabled={isDisabled}
        className={styles['fil-toolbar-menu']}
        innerClassName={styles['fil-toolbar-inner-menu']}
        button={<MoreButton />}
      >
        <NotRootFolder>
          <Item>
            <ShareItem />
          </Item>
        </NotRootFolder>
        {canUpload &&
          hasWriteAccess && (
            <Item>
              <UploadItem insideMoreMenu disabled={isDisabled} />
            </Item>
          )}
        {canCreateFolder &&
          hasWriteAccess && (
            <Item>
              <AddFolderItem />
            </Item>
          )}
        <NotRootFolder>
          <Item>
            <DownloadButtonItem />
          </Item>
        </NotRootFolder>
        <Item>
          <SelectableItem>
            <a className={styles['fil-action-select']}>
              {t('toolbar.menu_select')}
            </a>
          </SelectableItem>
        </Item>
        <NotRootFolder>
          <hr />
        </NotRootFolder>
        <NotRootFolder>
          <Item>
            <DeleteItem />
          </Item>
        </NotRootFolder>
      </Menu>
    )

    return (
      <div
        data-test-id="fil-toolbar-files"
        className={styles['fil-toolbar-files']}
        role="toolbar"
      >
        {!isShared &&
          canUpload &&
          hasWriteAccess && <UploadItem disabled={isDisabled} />}
        <NotRootFolder>
          <SharedRecipients />
        </NotRootFolder>
        <NotRootFolder>
          <ShareButton isDisabled={isDisabled} />
        </NotRootFolder>

        {isMobile ? (
          <BarRight>
            <BarContextProvider
              client={this.context.client}
              store={this.context.store}
              t={this.context.t}
            >
              <SharingProvider doctype="io.cozy.files" documentType="Files">
                {MoreMenu}
              </SharingProvider>
            </BarContextProvider>
          </BarRight>
        ) : (
          MoreMenu
        )}
      </div>
    )
  }
}
const mapStateToProps = state => ({
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
  withBreakpoints()(
    connect(
      mapStateToProps,
      null
    )(ToolbarWithSharingContext)
  )
)
