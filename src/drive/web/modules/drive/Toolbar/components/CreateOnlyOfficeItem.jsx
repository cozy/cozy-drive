import React, { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { ROOT_DIR_ID } from 'drive/constants/config'
import {
  makeOnlyOfficeIconByClass,
  canWriteOfficeDocument
} from 'drive/web/modules/views/OnlyOffice/helpers'

const CreateOnlyOfficeItem = ({ fileClass }) => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { folderId = ROOT_DIR_ID } = useParams()

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
