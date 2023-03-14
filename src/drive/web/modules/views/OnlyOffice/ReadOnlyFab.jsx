import React, { useContext, useCallback } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Fab from 'drive/web/modules/drive/Fab'
import { useRouter } from 'drive/lib/RouterContext'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import { canWriteOfficeDocument } from 'drive/web/modules/views/OnlyOffice/helpers'

const ReadOnlyFab = () => {
  const { router } = useRouter()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const { isEditorModeView, editorMode, setEditorMode } =
    useContext(OnlyOfficeContext)

  const handleClick = useCallback(() => {
    if (canWriteOfficeDocument()) {
      setEditorMode(editorMode === 'view' ? 'edit' : 'view')
    } else {
      router.push(`${router.location.pathname}/paywall`)
    }
  }, [editorMode, setEditorMode, router])

  const label = isEditorModeView
    ? t('OnlyOffice.actions.edit')
    : t('OnlyOffice.actions.validate')

  const fabProps = isMobile
    ? { 'aria-label': label }
    : { variant: 'extended', right: '30px', bottom: '55px' }

  return (
    <Fab color="primary" onClick={handleClick} {...fabProps}>
      <Icon
        icon={isEditorModeView ? RenameIcon : CheckIcon}
        className={!isMobile ? 'u-mr-half' : ''}
        aria-hidden="true"
      />
      {!isMobile && label}
    </Fab>
  )
}

export default React.memo(ReadOnlyFab)
