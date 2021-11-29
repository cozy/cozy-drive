import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import UiFab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    right: '1rem',
    bottom: ({ noSidebar }) =>
      noSidebar
        ? '1rem'
        : 'calc(var(--sidebarHeight) + env(safe-area-inset-bottom) + 1rem)'
  }
}))

// TODO: should be in cozy-ui
const Fab = ({ noSidebar, icon, ...rest }) => {
  const styles = useStyles({ noSidebar })

  return (
    <UiFab className={styles.root} {...rest}>
      <Icon icon={icon} />
    </UiFab>
  )
}

export default React.memo(Fab)
