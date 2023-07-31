import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import SharingProvider, { SharedDocument } from 'cozy-sharing'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useCurrentFolderId } from 'drive/hooks'
import AddButton from 'drive/web/modules/drive/Toolbar/components/AddButton'
import InsideRegularFolder from 'drive/web/modules/drive/Toolbar/components/InsideRegularFolder'
import MoreMenu from 'drive/web/modules/drive/Toolbar/components/MoreMenu'
import ShareButton from 'drive/web/modules/drive/Toolbar/share/ShareButton'
import SharedRecipients from 'drive/web/modules/drive/Toolbar/share/SharedRecipients'
import AddMenuProvider from 'drive/web/modules/drive/AddMenu/AddMenuProvider'
import SearchButton from 'drive/web/modules/drive/Toolbar/components/SearchButton'
import { useDisplayedFolder } from 'drive/hooks'
import { useSelectionContext } from 'drive/web/modules/selection/SelectionProvider'
import { BarRightWithProvider } from 'components/Bar'

import styles from 'drive/styles/toolbar.styl'

class Toolbar extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static defaultProps = {
    canUpload: false,
    canCreateFolder: false,
    hasWriteAccess: false
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.disabled !== this.props.disabled ||
      nextProps.isSelectionBarVisible !== this.props.isSelectionBarVisible ||
      nextProps.canUpload !== this.props.canUpload ||
      nextProps.canCreateFolder !== this.props.canCreateFolder ||
      nextProps.hasWriteAccess !== this.props.hasWriteAccess ||
      nextProps.isShared !== this.props.isShared ||
      nextProps.breakpoints.isMobile !== this.props.breakpoints.isMobile
    ) {
      return true
    }
    return false
  }

  render() {
    const {
      disabled,
      canUpload,
      canCreateFolder,
      hasWriteAccess,
      breakpoints: { isMobile },
      navigate,
      pathname,
      params,
      folderId,
      displayedFolder,
      showSelectionBar,
      isSelectionBarVisible
    } = this.props

    const isDisabled = disabled || isSelectionBarVisible
    if (disabled) {
      return null
    }

    return (
      <div
        data-testid="fil-toolbar-files"
        className={cx(styles['fil-toolbar-files'], 'u-flex-items-center')}
        role="toolbar"
      >
        <InsideRegularFolder
          displayedFolder={displayedFolder}
          folderId={folderId}
        >
          <SharedRecipients />
        </InsideRegularFolder>
        <InsideRegularFolder
          displayedFolder={displayedFolder}
          folderId={folderId}
        >
          <ShareButton isDisabled={isDisabled} />
        </InsideRegularFolder>

        {hasWriteAccess && (
          <AddMenuProvider
            canCreateFolder={canCreateFolder}
            canUpload={canUpload}
            disabled={isDisabled}
            navigate={navigate}
            params={params}
            displayedFolder={displayedFolder}
            isSelectionBarVisible={isSelectionBarVisible}
          >
            <AddButton />
          </AddMenuProvider>
        )}

        <BarRightWithProvider store={this.context.store}>
          {isMobile && <SearchButton navigate={navigate} pathname={pathname} />}
          <SharingProvider doctype="io.cozy.files" documentType="Files">
            <MoreMenu
              isDisabled={isDisabled}
              hasWriteAccess={hasWriteAccess}
              canCreateFolder={canCreateFolder}
              canUpload={canUpload}
              navigate={navigate}
              params={params}
              folderId={folderId}
              displayedFolder={displayedFolder}
              showSelectionBar={showSelectionBar}
              isSelectionBarVisible={isSelectionBarVisible}
              pathname={pathname}
            />
          </SharingProvider>
        </BarRightWithProvider>
      </div>
    )
  }
}

/**
 * Provides the Toolbar with sharing properties of the current folder.
 *
 * In views where the displayed folder is virtual (eg: Recent files, Sharings),
 * no sharing information is provided to the Toolbar.
 */
const ToolbarWithSharingContext = props => {
  const folderId = useCurrentFolderId()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const params = useParams()
  const displayedFolder = useDisplayedFolder()
  const breakpoints = useBreakpoints()
  const { showSelectionBar, isSelectionBarVisible } = useSelectionContext()

  const toolbarProps = {
    ...props,
    navigate,
    pathname,
    params,
    displayedFolder,
    folderId,
    breakpoints,
    showSelectionBar,
    isSelectionBarVisible
  }

  return !folderId ? (
    <Toolbar {...toolbarProps} />
  ) : (
    <SharedDocument docId={folderId}>
      {sharingProps => {
        const { hasWriteAccess } = sharingProps
        return <Toolbar {...toolbarProps} hasWriteAccess={hasWriteAccess} />
      }}
    </SharedDocument>
  )
}

ToolbarWithSharingContext.displayName = 'ToolbarWithSharingContext'

export default ToolbarWithSharingContext
