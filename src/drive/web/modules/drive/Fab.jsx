import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import UiFab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import { AddMenuContext } from 'drive/web/modules/drive/AddMenu/AddMenuProvider'

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    right: '1rem',
    bottom: 'calc(var(--sidebarHeight) + 1rem)'
  }
}))

export const Fab = () => {
  const styles = useStyles()
  const { anchorRef, handleToggle, isDisabled } = useContext(AddMenuContext)

  return (
    <UiFab
      ref={anchorRef}
      classes={{ root: styles.root }}
      color="primary"
      aria-label="add"
      onClick={handleToggle}
      disabled={isDisabled}
    >
      <Icon icon={PlusIcon} />
    </UiFab>
  )
}

export default React.memo(Fab)
