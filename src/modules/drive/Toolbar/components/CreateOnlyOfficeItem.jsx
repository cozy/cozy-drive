import React, { useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ROOT_DIR_ID } from '@/constants/config'
import {
  makeOnlyOfficeIconByClass,
  canWriteOfficeDocument
} from '@/modules/views/OnlyOffice/helpers'

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
    <ActionsMenuItem onClick={handleClick}>
      <ListItemIcon>
        <Icon icon={ClassIcon} />
      </ListItemIcon>
      <ListItemText primary={t(`toolbar.menu_onlyOffice.${fileClass}`)} />
    </ActionsMenuItem>
  )
}

export default React.memo(CreateOnlyOfficeItem)
