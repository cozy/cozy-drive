import React from 'react'

import { SharingBannerPlugin } from 'cozy-sharing'
import { useSharingInfos } from 'cozy-sharing'
import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/Divider'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { TrashedBanner } from 'components/TrashedBanner'
import { useOnlyOfficeContext } from 'modules/views/OnlyOffice/OnlyOfficeProvider'
import Toolbar from 'modules/views/OnlyOffice/Toolbar'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '3.5rem',
    backgroundColor: theme.palette.background.paper
  }
}))

const Title = () => {
  const { isMobile } = useBreakpoints()
  const { fileId, isPublic, isEditorModeView, isTrashed } =
    useOnlyOfficeContext()
  const sharingInfos = useSharingInfos()
  const { loading, isSharingShortcutCreated } = sharingInfos
  const styles = useStyles()

  // Check if the sharing shortcut has already been created (but not synced)
  const isShareAlreadyAdded = !loading && isSharingShortcutCreated
  // Check if you are sharing Cozy to Cozy (Link sharing is on the `/public` route)
  const isPreview = window.location.pathname === '/preview'
  // Show the sharing banner plugin only on shared links view and cozy to cozy sharing view(not added)
  const isSharingBannerPluginDisplayed =
    isPublic && (!isShareAlreadyAdded || !isPreview)

  const showDialogToolbar = isEditorModeView || !isMobile

  return (
    <div style={{ zIndex: 'var(--zIndex-nav)' }}>
      {showDialogToolbar && (
        <>
          <DialogTitle
            data-testid="onlyoffice-title"
            disableTypography
            className="u-ellipsis u-flex u-flex-items-center u-p-0 u-pr-1"
            classes={styles}
          >
            <Toolbar />
          </DialogTitle>
          <Divider />
        </>
      )}
      {isTrashed ? (
        <div style={{ backgroundColor: 'var(--paperBackgroundColor)' }}>
          <TrashedBanner fileId={fileId} isPublic={isPublic} />
        </div>
      ) : isSharingBannerPluginDisplayed ? (
        <SharingBannerPlugin />
      ) : null}
    </div>
  )
}

export default React.memo(Title)
