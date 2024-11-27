import { useDisplayedFolder } from 'hooks'
import React from 'react'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { BarRightOnMobile } from 'components/Bar'
import { HOME_LINK_HREF } from 'constants/config'
import { download, openExternalLink } from 'modules/actions'
import AddMenuProvider from 'modules/drive/AddMenu/AddMenuProvider'
import AddButton from 'modules/drive/Toolbar/components/AddButton'
import AddMenuItem from 'modules/drive/Toolbar/components/AddMenuItem'
import SelectableItem from 'modules/drive/Toolbar/selectable/SelectableItem'
import { DownloadFilesButton } from 'modules/public/DownloadFilesButton'
import PublicToolbarMoreMenu from 'modules/public/PublicToolbarMoreMenu'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

const PublicToolbarByLink = ({
  files,
  hasWriteAccess,
  refreshFolderContent
}) => {
  const { isMobile } = useBreakpoints()
  const client = useClient()
  const { showAlert } = useAlert()
  const { t } = useI18n()
  const { displayedFolder } = useDisplayedFolder()
  const { showSelectionBar, isSelectionBarVisible } = useSelectionContext()

  const actionOptions = {
    client,
    t,
    showAlert,
    isPublic: true,
    link: HOME_LINK_HREF
  }
  const actions = makeActions(
    [isMobile && files.length > 0 && download, isMobile && openExternalLink],
    actionOptions
  )

  const isMoreMenuDisplayed = actions.length > 0 || files.length > 1

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
            {files.length > 0 && (
              <DownloadFilesButton files={files} className="u-mr-half" />
            )}
          </>
        )}
        {isMoreMenuDisplayed && (
          <PublicToolbarMoreMenu
            files={files}
            hasWriteAccess={hasWriteAccess}
            showSelectionBar={showSelectionBar}
            actions={actions}
          >
            {isMobile && hasWriteAccess && <AddMenuItem />}
            {files.length > 1 && <SelectableItem onClick={showSelectionBar} />}
          </PublicToolbarMoreMenu>
        )}
      </AddMenuProvider>
    </BarRightOnMobile>
  )
}

export default PublicToolbarByLink
