import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'

import { BarRightWithProvider } from 'components/Bar'
import { DownloadFilesButton } from 'drive/web/modules/public/DownloadButton'
import {
  isFilesIsFile,
  openExternalLink
} from 'drive/web/modules/public/helpers'
import PublicToolbarMoreMenu from 'drive/web/modules/public/PublicToolbarMoreMenu'

const PublicToolbarCozyToCozy = ({
  isSharingShortcutCreated,
  discoveryLink,
  files
}) => {
  const isFile = isFilesIsFile(files)
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  const shouldDisplayMoreMenu = isMobile || (!isFile && files.length > 0)

  return (
    <BarRightWithProvider>
      {!isMobile && files.length > 0 && <DownloadFilesButton files={files} />}
      {shouldDisplayMoreMenu && (
        <PublicToolbarMoreMenu files={files}>
          <ActionMenuItem
            onClick={() => openExternalLink(discoveryLink)}
            left={
              <Icon icon={isSharingShortcutCreated ? 'sync' : 'to-the-cloud'} />
            }
          >
            {isSharingShortcutCreated
              ? t('toolbar.menu_sync_cozy')
              : t('toolbar.add_to_mine')}
          </ActionMenuItem>
        </PublicToolbarMoreMenu>
      )}
    </BarRightWithProvider>
  )
}

export default PublicToolbarCozyToCozy
