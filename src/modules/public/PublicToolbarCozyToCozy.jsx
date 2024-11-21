import React from 'react'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { BarRightOnMobile } from 'components/Bar'
import { download, openExternalLink } from 'modules/actions'
import SelectableItem from 'modules/drive/Toolbar/selectable/SelectableItem'
import { DownloadFilesButton } from 'modules/public/DownloadButton'
import PublicToolbarMoreMenu from 'modules/public/PublicToolbarMoreMenu'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

const PublicToolbarCozyToCozy = ({
  isSharingShortcutCreated,
  discoveryLink,
  files
}) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const { showSelectionBar } = useSelectionContext()
  const client = useClient()
  const { showAlert } = useAlert()

  const actionOptions = {
    client,
    t,
    showAlert,
    isPublic: true,
    isSharingShortcutCreated,
    link: discoveryLink
  }
  const actions = makeActions(
    [isMobile && files.length > 0 && download, openExternalLink],
    actionOptions
  )

  return (
    <BarRightOnMobile>
      {!isMobile && files.length > 0 && <DownloadFilesButton files={files} />}
      <PublicToolbarMoreMenu
        files={files}
        showSelectionBar={showSelectionBar}
        actions={actions}
      >
        {files.length > 1 && <SelectableItem onClick={showSelectionBar} />}
      </PublicToolbarMoreMenu>
    </BarRightOnMobile>
  )
}

export default PublicToolbarCozyToCozy
