import React, { useContext, useCallback } from 'react'

import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

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
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const { isEditorForcedReadOnly, setIsEditorForcedReadOnly } =
    useContext(OnlyOfficeContext)

  const handleClick = useCallback(() => {
    setIsEditorForcedReadOnly(v => !v)
  }, [setIsEditorForcedReadOnly])

  const label = isEditorForcedReadOnly
    ? t('OnlyOffice.actions.edit')
    : t('OnlyOffice.actions.validate')

  const fabProps = isMobile
    ? {
        classes: {
          root: styles.root
        },
        'aria-label': label
      }
    : {
        color: 'primary',
        variant: 'extended'
      }

  return (
    <Fab noSidebar={true} onClick={handleClick} {...fabProps}>
      <Icon
        icon={isEditorForcedReadOnly ? RenameIcon : CheckIcon}
        className={!isMobile ? 'u-mr-half' : ''}
        aria-hidden="true"
      />
      {!isMobile && label}
    </Fab>
  )
}

export default React.memo(ReadOnlyFab)
