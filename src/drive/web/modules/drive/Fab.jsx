import React from 'react'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import UiFab from 'cozy-ui/transpiled/react/Fab'

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    right: ({ right }) => (right ? right : '1rem'),
    bottom: ({ bottom }) => (bottom ? bottom : '1rem')
  }
}))

const Fab = ({ right, bottom, children, ...rest }) => {
  const styles = useStyles({ right, bottom })

  return (
    <UiFab className={styles.root} {...rest}>
      {children}
    </UiFab>
  )
}

export default React.memo(Fab)
