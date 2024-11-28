import React from 'react'

import { useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { BarRightOnMobile } from 'components/Bar'
import { download, hr, openExternalLink, select } from 'modules/actions'
import { DownloadFilesButton } from 'modules/public/DownloadFilesButton'
import { OpenExternalLinkButton } from 'modules/public/OpenExternalLinkButton'
import PublicToolbarMoreMenu from 'modules/public/PublicToolbarMoreMenu'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

const PublicToolbarCozyToCozy = ({
  isSharingShortcutCreated,
  discoveryLink,
  files
}) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const { showAlert } = useAlert()
  const client = useClient()
  const { showSelectionBar } = useSelectionContext()
  const vaultClient = useVaultClient()

  const actions = makeActions(
    [
      isMobile && download,
      select,
      ((isMobile && files.length > 0) || files.length > 1) && hr,
      openExternalLink
    ],
    {
      t,
      showAlert,
      client,
      vaultClient,
      showSelectionBar,
      isSharingShortcutCreated,
      link: discoveryLink
    }
  )

  return (
    <BarRightOnMobile>
      {!isMobile && files.length > 0 && <DownloadFilesButton files={files} />}
      {!isMobile && !isSharingShortcutCreated && (
        <OpenExternalLinkButton
          className="u-ml-half"
          link={discoveryLink}
          isSharingShortcutCreated={isSharingShortcutCreated}
        />
      )}
      <PublicToolbarMoreMenu
        files={files}
        showSelectionBar={showSelectionBar}
        actions={actions}
      />
    </BarRightOnMobile>
  )
}

export default PublicToolbarCozyToCozy
