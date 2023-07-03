import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'

import { BarRightWithProvider } from 'components/Bar'
import { HOME_LINK_HREF } from 'drive/constants/config'
import AddButton from 'drive/web/modules/drive/Toolbar/components/AddButton'
import AddMenuProvider from 'drive/web/modules/drive/AddMenu/AddMenuProvider'
import { DownloadFilesButton } from 'drive/web/modules/public/DownloadButton'
import PublicToolbarMoreMenu from 'drive/web/modules/public/PublicToolbarMoreMenu'
import {
  isFilesIsFile,
  openExternalLink
} from 'drive/web/modules/public/helpers'
import { useDisplayedFolder } from 'drive/hooks'

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
  const displayedFolder = useDisplayedFolder()

  const shouldDisplayMoreMenu = isMobile || (!isFile && files.length > 0)

  return (
    <BarRightWithProvider>
      <AddMenuProvider
        canCreateFolder={hasWriteAccess}
        canUpload={hasWriteAccess}
        refreshFolderContent={refreshFolderContent}
        isPublic={true}
        navigate={navigate}
        params={params}
        displayedFolder={displayedFolder}
      >
        {!isMobile && (
          <>
            {hasWriteAccess && <AddButton />}
            {files.length > 0 && <DownloadFilesButton files={files} />}
          </>
        )}
        {shouldDisplayMoreMenu && (
          <PublicToolbarMoreMenu files={files} hasWriteAccess={hasWriteAccess}>
            {isMobile && (
              <ActionMenuItem
                onClick={() => openExternalLink(HOME_LINK_HREF)}
                left={<Icon icon={'to-the-cloud'} />}
              >
                {t('Share.create-cozy')}
              </ActionMenuItem>
            )}
          </PublicToolbarMoreMenu>
        )}
      </AddMenuProvider>
    </BarRightWithProvider>
  )
}

export default PublicToolbarByLink
