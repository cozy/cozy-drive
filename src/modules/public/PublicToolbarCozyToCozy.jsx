import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { BarRightWithProvider } from 'components/Bar'
import { DownloadFilesButton } from 'modules/public/DownloadButton'
import PublicToolbarMoreMenu from 'modules/public/PublicToolbarMoreMenu'
import { isFilesIsFile, openExternalLink } from 'modules/public/helpers'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

const PublicToolbarCozyToCozy = ({
  isSharingShortcutCreated,
  discoveryLink,
  files
}) => {
  const isFile = isFilesIsFile(files)
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const { showSelectionBar } = useSelectionContext()

  const shouldDisplayMoreMenu = isMobile || (!isFile && files.length > 0)

  return (
    <BarRightWithProvider>
      {!isMobile && files.length > 0 && <DownloadFilesButton files={files} />}
      {shouldDisplayMoreMenu && (
        <PublicToolbarMoreMenu
          files={files}
          showSelectionBar={showSelectionBar}
        >
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
