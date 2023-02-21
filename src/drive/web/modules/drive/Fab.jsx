import React from 'react'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import UiFab from 'cozy-ui/transpiled/react/Fab'

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    right: '1rem',
    bottom: ({ noSidebar }) =>
      noSidebar ? '1rem' : 'calc(var(--sidebarHeight) + 1rem)'
  }
}))

const Fab = ({ noSidebar, children, ...rest }) => {
  const styles = useStyles({ noSidebar })

  return (
    <UiFab className={styles.root} {...rest}>
      {children}
    </UiFab>
  )
}

export default React.memo(Fab)
