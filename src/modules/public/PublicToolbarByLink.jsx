import { useDisplayedFolder } from 'hooks'
import React from 'react'

import { useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { BarRightOnMobile } from 'components/Bar'
import { HOME_LINK_HREF } from 'constants/config'
import {
  addItems,
  download,
  hr,
  openExternalLink,
  select
} from 'modules/actions'
import AddMenuProvider from 'modules/drive/AddMenu/AddMenuProvider'
import AddButton from 'modules/drive/Toolbar/components/AddButton'
import { DownloadFilesButton } from 'modules/public/DownloadFilesButton'
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
  const { t } = useI18n()
  const { showAlert } = useAlert()
  const client = useClient()
  const vaultClient = useVaultClient()

  const isMoreMenuDisplayed = files.length > 1

  const actions = makeActions(
    [
      isMobile && download,
      files.length > 1 && select,
      addItems,
      isMobile && (files.length > 1 || hasWriteAccess) && hr,
      isMobile && openExternalLink
    ],
    {
      t,
      showAlert,
      client,
      vaultClient,
      showSelectionBar,
      link: HOME_LINK_HREF,
      hasWriteAccess
    }
  )

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
            actions={actions}
          />
        )}
      </AddMenuProvider>
    </BarRightOnMobile>
  )
}

export default PublicToolbarByLink
