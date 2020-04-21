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

import DeleteItem from './delete/DeleteItem'
import SelectableItem from './selectable/SelectableItem'
import AddFolderItem from './components/AddFolderItem'
import UploadItem from './components/UploadItem'
import CreateNoteItem from './components/CreateNoteItem'
import CreateShortcut from './components/CreateShortcut'

import DownloadButtonItem from './components/DownloadButtonItem'
import ShareItem from './share/ShareItem'
import ShareButton from './share/ShareButton'
import SharedRecipients from './share/SharedRecipients'
import ScanWrapper from './components/ScanWrapper'

class Toolbar extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    const {
      t,
      lang,
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
        {hasWriteAccess && (
          <NotRootFolder>
            <hr />
            <Item>
              <DeleteItem />
            </Item>
          </NotRootFolder>
        )}
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
              lang={lang}
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
