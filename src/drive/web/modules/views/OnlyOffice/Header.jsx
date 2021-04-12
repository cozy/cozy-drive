import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    padding: '0 1rem'
  }
}))

const Header = () => {
  const styles = useStyles()

  return (
    <>
      <DialogTitle
        data-testid="onlyoffice-toolbar"
        disableTypography
        className="u-ellipsis"
        classes={styles}
      >
        {/* TODO: to be modified with real stuff */}
        <div>title</div>
      </DialogTitle>
      <Divider />
    </>
  )
}

export default Header
