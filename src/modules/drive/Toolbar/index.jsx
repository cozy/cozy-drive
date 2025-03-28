import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import { SharedDocument, useSharingContext } from 'cozy-sharing'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import ViewSwitcher from '@/modules/drive/Toolbar/components/ViewSwitcher'

import styles from '@/styles/toolbar.styl'

import { BarRightOnMobile } from '@/components/Bar'
import { useDisplayedFolder, useCurrentFolderId } from '@/hooks'
import InsideRegularFolder from '@/modules/drive/Toolbar/components/InsideRegularFolder'
import MoreMenu from '@/modules/drive/Toolbar/components/MoreMenu'
import SearchButton from '@/modules/drive/Toolbar/components/SearchButton'
import ShareButton from '@/modules/drive/Toolbar/share/ShareButton'
import SharedRecipients from '@/modules/drive/Toolbar/share/SharedRecipients'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'

const Toolbar = ({
  folderId,
  disabled,
  canUpload,
  canCreateFolder,
  hasWriteAccess,
  isSharedWithMe,
  isBigThumbnail,
  toggleThumbnailSize
}) => {
  const { displayedFolder } = useDisplayedFolder()
  const { isMobile } = useBreakpoints()
  const { showSelectionBar, isSelectionBarVisible } = useSelectionContext()
  const { allLoaded } = useSharingContext() // We need to wait for the sharing context to be completely loaded to avoid race conditions

  const isDisabled = disabled || isSelectionBarVisible
  const isSharingDisabled = isDisabled || !allLoaded

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
        <ShareButton isDisabled={isSharingDisabled} className="u-mr-half" />
      </InsideRegularFolder>

      {toggleThumbnailSize && (
        <ViewSwitcher
          isBigThumbnail={isBigThumbnail}
          toggleThumbnailSize={toggleThumbnailSize}
          className="u-mr-half"
        />
      )}


      <BarRightOnMobile>
        {isMobile && <SearchButton />}
        {!isTwakeTheme() && (
          <MoreMenu
            isDisabled={isDisabled}
            hasWriteAccess={hasWriteAccess}
            isSharedWithMe={isSharedWithMe}
            canCreateFolder={canCreateFolder}
            canUpload={canUpload}
            folderId={folderId}
            displayedFolder={displayedFolder}
            showSelectionBar={showSelectionBar}
            isSelectionBarVisible={isSelectionBarVisible}
          />
        )}
      </BarRightOnMobile>
    </div>
  )
}

Toolbar.propTypes = {
  folderId: PropTypes.string,
  disabled: PropTypes.bool,
  canUpload: PropTypes.bool,
  canCreateFolder: PropTypes.bool,
  hasWriteAccess: PropTypes.bool,
  isBigThumbnail: PropTypes.bool,
  toggleThumbnailSize: PropTypes.func
}

Toolbar.defaultProps = {
  canUpload: false,
  canCreateFolder: false,
  hasWriteAccess: false
}

/**
 * Provides the Toolbar with sharing properties of the current folder.
 *
 * In views where the displayed folder is virtual (eg: Recent files, Sharings),
 * no sharing information is provided to the Toolbar.
 */
const ToolbarWithSharingContext = props => {
  const folderId = useCurrentFolderId()

  return !folderId ? (
    <Toolbar {...props} />
  ) : (
    <SharedDocument docId={folderId}>
      {sharingProps => {
        const { hasWriteAccess, isSharedWithMe } = sharingProps
        return (
          <Toolbar
            hasWriteAccess={hasWriteAccess}
            isSharedWithMe={isSharedWithMe}
            folderId={folderId}
            {...props}
          />
        )
      }}
    </SharedDocument>
  )
}

ToolbarWithSharingContext.displayName = 'ToolbarWithSharingContext'

export default ToolbarWithSharingContext
