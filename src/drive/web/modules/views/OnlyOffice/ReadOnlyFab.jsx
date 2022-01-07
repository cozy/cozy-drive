import React, { useContext, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'

import Fab from 'drive/web/modules/drive/Fab'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  }
}))

const ReadOnlyFab = () => {
  const styles = useStyles()
  const { isEditorForcedReadOnly, setIsEditorForcedReadOnly } = useContext(
    OnlyOfficeContext
  )

  const handleClick = useCallback(() => {
    setIsEditorForcedReadOnly(v => !v)
  }, [setIsEditorForcedReadOnly])

  return (
    <Fab
      data-testid="onlyoffice-readonlyfab"
      classes={{ root: styles.root }}
      noSidebar={true}
      icon={isEditorForcedReadOnly ? RenameIcon : CheckIcon}
      onClick={handleClick}
    />
  )
}

export default React.memo(ReadOnlyFab)
