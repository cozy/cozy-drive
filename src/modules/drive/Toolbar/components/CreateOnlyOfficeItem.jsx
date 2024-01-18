import React, { useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ROOT_DIR_ID } from 'constants/config'
import {
  makeOnlyOfficeIconByClass,
  canWriteOfficeDocument
} from 'modules/views/OnlyOffice/helpers'

const CreateOnlyOfficeItem = ({ fileClass }) => {
  const { folderId = ROOT_DIR_ID } = useParams()
  const { t } = useI18n()
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    if (canWriteOfficeDocument()) {
      navigate(`/onlyoffice/create/${folderId}/${fileClass}`)
    } else {
      navigate(`/folder/${folderId}/paywall`)
    }
  }, [fileClass, folderId, navigate])

  const ClassIcon = useMemo(
    () => makeOnlyOfficeIconByClass(fileClass),
    [fileClass]
  )

  return (
    <ActionMenuItem onClick={handleClick} left={<Icon icon={ClassIcon} />}>
      {t(`toolbar.menu_onlyOffice.${fileClass}`)}
    </ActionMenuItem>
  )
}

export default React.memo(CreateOnlyOfficeItem)
