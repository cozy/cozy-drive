import React, { useContext, useMemo } from 'react'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { SharingBannerPlugin } from 'cozy-sharing'
import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/Divider'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import { showSharingBanner } from 'drive/web/modules/views/OnlyOffice/helpers'
import Toolbar from 'drive/web/modules/views/OnlyOffice/Toolbar'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '3.5rem',
    backgroundColor: theme.palette.background.paper
  }
}))

const Title = () => {
  const { isMobile } = useBreakpoints()
  const { isPublic, isFromSharing, isInSharedFolder, isEditorModeView } =
    useContext(OnlyOfficeContext)
  const styles = useStyles()

  const showBanner = useMemo(
    () =>
      showSharingBanner({
        isPublic,
        isFromSharing,
        isInSharedFolder
      }),
    [isPublic, isFromSharing, isInSharedFolder]
  )

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
      {showBanner && <SharingBannerPlugin />}
    </div>
  )
}

export default React.memo(Title)
