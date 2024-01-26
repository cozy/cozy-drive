import { useDisplayedFolder } from 'hooks'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { BarRightOnMobile } from 'components/Bar'
import { HOME_LINK_HREF } from 'constants/config'
import AddMenuProvider from 'modules/drive/AddMenu/AddMenuProvider'
import AddButton from 'modules/drive/Toolbar/components/AddButton'
import { DownloadFilesButton } from 'modules/public/DownloadButton'
import PublicToolbarMoreMenu from 'modules/public/PublicToolbarMoreMenu'
import { isFilesIsFile, openExternalLink } from 'modules/public/helpers'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

const PublicToolbarByLink = ({
  files,
  hasWriteAccess,
  refreshFolderContent
}) => {
  const isFile = isFilesIsFile(files)
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const navigate = useNavigate()
  const params = useParams()
  const { displayedFolder } = useDisplayedFolder()
  const { showSelectionBar, isSelectionBarVisible } = useSelectionContext()

  const shouldDisplayMoreMenu = isMobile || (!isFile && files.length > 0)

  return (
    <BarRightOnMobile>
      <AddMenuProvider
        canCreateFolder={hasWriteAccess}
        canUpload={hasWriteAccess}
        refreshFolderContent={refreshFolderContent}
        isPublic={true}
        navigate={navigate}
        params={params}
        displayedFolder={displayedFolder}
        isSelectionBarVisible={isSelectionBarVisible}
      >
        {!isMobile && (
          <>
            {hasWriteAccess && <AddButton />}
            {files.length > 0 && <DownloadFilesButton files={files} />}
          </>
        )}
        {shouldDisplayMoreMenu && (
          <PublicToolbarMoreMenu
            files={files}
            hasWriteAccess={hasWriteAccess}
            showSelectionBar={showSelectionBar}
          >
            {isMobile && (
              <ActionMenuItem
                onClick={() => openExternalLink(HOME_LINK_HREF)}
                left={<Icon icon="to-the-cloud" />}
              >
                {t('Share.create-cozy')}
              </ActionMenuItem>
            )}
          </PublicToolbarMoreMenu>
        )}
      </AddMenuProvider>
    </BarRightOnMobile>
  )
}

export default PublicToolbarByLink
