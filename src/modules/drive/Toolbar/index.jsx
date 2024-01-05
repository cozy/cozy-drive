import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import SharingProvider, { SharedDocument } from 'cozy-sharing'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useCurrentFolderId } from 'hooks'
import AddButton from 'modules/drive/Toolbar/components/AddButton'
import InsideRegularFolder from 'modules/drive/Toolbar/components/InsideRegularFolder'
import MoreMenu from 'modules/drive/Toolbar/components/MoreMenu'
import ShareButton from 'modules/drive/Toolbar/share/ShareButton'
import SharedRecipients from 'modules/drive/Toolbar/share/SharedRecipients'
import AddMenuProvider from 'modules/drive/AddMenu/AddMenuProvider'
import SearchButton from 'modules/drive/Toolbar/components/SearchButton'
import { useDisplayedFolder } from 'hooks'
import { useSelectionContext } from 'modules/selection/SelectionProvider'
import { BarRightWithProvider } from 'components/Bar'

import styles from 'styles/toolbar.styl'

const Toolbar = ({
  folderId,
  disabled,
  canUpload,
  canCreateFolder,
  hasWriteAccess
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const params = useParams()
  const { displayedFolder } = useDisplayedFolder()
  const { isMobile } = useBreakpoints()
  const { showSelectionBar, isSelectionBarVisible } = useSelectionContext()

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

      <BarRightWithProvider>
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

Toolbar.propTypes = {
  folderId: PropTypes.string,
  disabled: PropTypes.bool,
  canUpload: PropTypes.bool,
  canCreateFolder: PropTypes.bool,
  hasWriteAccess: PropTypes.bool
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
        const { hasWriteAccess } = sharingProps
        return (
          <Toolbar
            hasWriteAccess={hasWriteAccess}
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
