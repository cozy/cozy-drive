import { useDisplayedFolder } from 'hooks'
import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { BarRightOnMobile } from 'components/Bar'
import { HOME_LINK_HREF } from 'constants/config'
import AddMenuProvider from 'modules/drive/AddMenu/AddMenuProvider'
import AddButton from 'modules/drive/Toolbar/components/AddButton'
import AddMenuItem from 'modules/drive/Toolbar/components/AddMenuItem'
import DownloadButtonItem from 'modules/drive/Toolbar/components/DownloadButtonItem'
import SelectableItem from 'modules/drive/Toolbar/selectable/SelectableItem'
import { DownloadFilesButton } from 'modules/public/DownloadFilesButton'
import OpenExternalLinkItem from 'modules/public/OpenExternalLinkItem'
import PublicToolbarMoreMenu from 'modules/public/PublicToolbarMoreMenu'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

const PublicToolbarByLink = ({
  files,
  hasWriteAccess,
  refreshFolderContent
}) => {
  const { isMobile } = useBreakpoints()
  const { displayedFolder } = useDisplayedFolder()
  const { showSelectionBar, isSelectionBarVisible } = useSelectionContext()

  const isMoreMenuDisplayed = files.length > 1

  return (
    <BarRightOnMobile>
      <AddMenuProvider
        canCreateFolder={hasWriteAccess}
        canUpload={hasWriteAccess}
        refreshFolderContent={refreshFolderContent}
        isPublic={true}
        displayedFolder={displayedFolder}
        isSelectionBarVisible={isSelectionBarVisible}
      >
        {!isMobile && (
          <>
            {hasWriteAccess && <AddButton className="u-mr-half" />}
            {files.length > 0 && <DownloadFilesButton files={files} />}
          </>
        )}
        {isMoreMenuDisplayed && (
          <PublicToolbarMoreMenu
            files={files}
            hasWriteAccess={hasWriteAccess}
            showSelectionBar={showSelectionBar}
            actions={[]}
          >
            {isMobile && <OpenExternalLinkItem link={HOME_LINK_HREF} />}
            {isMobile && files.length > 0 && (
              <DownloadButtonItem files={files} />
            )}
            {isMobile && hasWriteAccess && <AddMenuItem />}
            {files.length > 1 && <SelectableItem onClick={showSelectionBar} />}
          </PublicToolbarMoreMenu>
        )}
      </AddMenuProvider>
    </BarRightOnMobile>
  )
}

export default PublicToolbarByLink
