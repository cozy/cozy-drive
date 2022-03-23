import React, { useCallback, useMemo } from 'react'
import get from 'lodash/get'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { ROOT_DIR_ID } from 'drive/constants/config'
import { useRouter } from 'drive/lib/RouterContext'
import { makeOnlyOfficeIconByClass } from 'drive/web/modules/views/OnlyOffice/helpers'

const CreateOnlyOfficeItem = ({ fileClass }) => {
  const { t } = useI18n()
  const { router } = useRouter()

  const folderId = useMemo(
    () => get(router, 'params.folderId', ROOT_DIR_ID),
    [router]
  )

  const handleClick = useCallback(
    () => router.push(`/onlyoffice/create/${folderId}/${fileClass}`),
    [router, fileClass, folderId]
  )

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
