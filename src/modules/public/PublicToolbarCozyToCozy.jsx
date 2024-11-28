import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { BarRightOnMobile } from 'components/Bar'
import DownloadButtonItem from 'modules/drive/Toolbar/components/DownloadButtonItem'
import SelectableItem from 'modules/drive/Toolbar/selectable/SelectableItem'
import { DownloadFilesButton } from 'modules/public/DownloadFilesButton'
import { OpenExternalLinkButton } from 'modules/public/OpenExternalLinkButton'
import OpenExternalLinkItem from 'modules/public/OpenExternalLinkItem'
import PublicToolbarMoreMenu from 'modules/public/PublicToolbarMoreMenu'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

const PublicToolbarCozyToCozy = ({
  isSharingShortcutCreated,
  discoveryLink,
  files
}) => {
  const { isMobile } = useBreakpoints()
  const { showSelectionBar } = useSelectionContext()

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
        actions={[]}
      >
        <OpenExternalLinkItem
          isSharingShortcutCreated={isSharingShortcutCreated}
          link={discoveryLink}
        />
        {isMobile && files.length > 0 && <DownloadButtonItem files={files} />}
        {files.length > 1 && <SelectableItem onClick={showSelectionBar} />}
      </PublicToolbarMoreMenu>
    </BarRightOnMobile>
  )
}

export default PublicToolbarCozyToCozy
