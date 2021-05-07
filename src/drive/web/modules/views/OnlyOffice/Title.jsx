import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import SharingBanner from 'drive/web/modules/public/SharingBanner'
import { useSharingInfos } from 'drive/web/modules/public/useSharingInfos'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import Toolbar from 'drive/web/modules/views/OnlyOffice/Toolbar'

const useStyles = makeStyles(() => ({
  root: {
    width: 'calc(100% - 1rem)',
    height: '3.5rem'
  }
}))

const Title = () => {
  const { isPublic } = useContext(OnlyOfficeContext)
  const sharingInfos = useSharingInfos()
  const styles = useStyles()

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
      {isPublic && <SharingBanner sharingInfos={sharingInfos} />}
    </>
  )
}

export default Title
