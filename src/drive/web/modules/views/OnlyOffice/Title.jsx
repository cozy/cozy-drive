import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import Toolbar from 'drive/web/modules/views/OnlyOffice/Toolbar'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    padding: '0 1rem'
  }
}))

const Title = () => {
  const styles = useStyles()

  return (
    <>
      <DialogTitle
        data-testid="onlyoffice-title"
        disableTypography
        className="u-ellipsis"
        classes={styles}
      >
        <Toolbar />
      </DialogTitle>
      <Divider />
    </>
  )
}

export default Title
