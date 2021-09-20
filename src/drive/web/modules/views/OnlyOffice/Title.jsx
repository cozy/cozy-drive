import React, { useContext, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import flag from 'cozy-flags'
import { SharingBannerPlugin } from 'cozy-sharing'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import { showSharingBanner } from 'drive/web/modules/views/OnlyOffice/helpers'
import Toolbar from 'drive/web/modules/views/OnlyOffice/Toolbar'

const useStyles = makeStyles(theme => ({
  root: {
    width: 'calc(100% - 1rem)',
    height: '3.5rem',
    backgroundColor: theme.palette.background.paper
  }
}))

const Title = () => {
  const {
    isPublic,
    isFromSharing,
    isInSharedFolder,
    isEditorForcedReadOnly
  } = useContext(OnlyOfficeContext)
  const styles = useStyles()
  const { isMobile } = useBreakpoints()

  const showBanner = useMemo(
    () =>
      showSharingBanner({
        isPublic,
        isFromSharing,
        isInSharedFolder
      }),
    [isPublic, isFromSharing, isInSharedFolder]
  )

  const hideDialogToolbar =
    (isMobile || flag('drive.onlyoffice.forceReadOnlyOnDesktop')) &&
    !isEditorForcedReadOnly

  return (
    <div style={{ zIndex: 'var(--zIndex-nav)' }}>
      {!hideDialogToolbar && (
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
