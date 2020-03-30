/* global cozy */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import SharingProvider, { SharedDocument } from 'cozy-sharing'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import BarContextProvider from 'cozy-ui/transpiled/react/BarContextProvider'
import { withClient } from 'cozy-client'
import { isMobileApp } from 'cozy-device-helper'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

import styles from 'drive/styles/toolbar.styl'

import NotRootFolder from 'drive/web/modules/drive/Toolbar/components/NotRootFolder'

import DeleteItem from './Toolbar/delete/DeleteItem'
import SelectableItem from './Toolbar/selectable/SelectableItem'
import AddFolderItem from './Toolbar/components/AddFolderItem'
import UploadItem from './Toolbar/components/UploadItem'
import CreateNoteItem from './Toolbar/components/CreateNoteItem'
import CreateShortcut from './Toolbar/components/CreateShortcut'

import DownloadButtonItem from './Toolbar/components/DownloadButtonItem'
import ShareItem from './Toolbar/share/ShareItem'
import ShareButton from './Toolbar/share/ShareButton'
import SharedRecipients from './Toolbar/share/SharedRecipients'
import ScanWrapper from './Toolbar/components/ScanWrapper'

class Toolbar extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    const {
      t,
      disabled,
      selectionModeActive,
      canUpload,
      canCreateFolder,
      hasWriteAccess,
      isShared,
      breakpoints: { isMobile },
      client
    } = this.props
    const isDisabled = disabled || selectionModeActive
    const { BarRight } = cozy.bar

    const MoreMenu = (
      <Menu
        title={t('toolbar.item_more')}
        disabled={isDisabled}
        className={styles['fil-toolbar-menu']}
        innerClassName={styles['fil-toolbar-inner-menu']}
        button={<MoreButton />}
      >
        {canCreateFolder &&
          hasWriteAccess && (
            <Item>
              <AddFolderItem />
            </Item>
          )}
        {hasWriteAccess && (
          <Item>
            <CreateNoteItem />
          </Item>
        )}
        {hasWriteAccess && (
          <Item>
            <CreateShortcut />
          </Item>
        )}
        {canUpload &&
          hasWriteAccess && (
            <Item>
              <UploadItem insideMoreMenu disabled={isDisabled} />
            </Item>
          )}
        {isMobileApp() &&
          canUpload &&
          hasWriteAccess && (
            <Item>
              <ScanWrapper insideMoreMenu disabled={isDisabled} />
            </Item>
          )}
        {hasWriteAccess && <hr />}
        <NotRootFolder>
          <Item>
            <ShareItem />
          </Item>
        </NotRootFolder>
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
              client={client}
              store={this.context.store}
              t={t}
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
ToolbarWithSharingContext.displayName = 'ToolbarWithSharingContext'

export default compose(
  translate(),
  withClient,
  connect(
    mapStateToProps,
    null
  ),
  withBreakpoints()
)(ToolbarWithSharingContext)
