import React, { useContext, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import SharingBanner from 'drive/web/modules/public/SharingBanner'
import { useSharingInfos } from 'drive/web/modules/public/useSharingInfos'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import { showSharingBanner } from 'drive/web/modules/views/OnlyOffice/helpers'
import Toolbar from 'drive/web/modules/views/OnlyOffice/Toolbar'

const useStyles = makeStyles(() => ({
  root: {
    width: 'calc(100% - 1rem)',
    height: '3.5rem'
  }
}))

const Title = () => {
  const { isPublic, isFromSharing, isInSharedFolder } = useContext(
    OnlyOfficeContext
  )
  const sharingInfos = useSharingInfos()
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

  return (
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
      {showBanner && <SharingBanner sharingInfos={sharingInfos} />}
    </>
  )
}

export default React.memo(Title)
