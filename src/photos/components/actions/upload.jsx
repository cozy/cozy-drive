import React, { forwardRef } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ActionMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import UploadButton from '../UploadButton'

const upload = (onUpload, disabled) => () => ({
  name: 'upload',
  // FileInput needs to stay rendered until the onChange event, so we prevent the event from bubbling
  action: e => e.stopPropagation(),
  Component: forwardRef(function Upload(props, ref) {
    const { t } = useI18n()
    return (
      <ActionMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={UploadIcon} />
        </ListItemIcon>
        <UploadButton
          onUpload={onUpload}
          disabled={disabled}
          label={t('Toolbar.menu.photo_upload')}
          inMenu
        />
      </ActionMenuItem>
    )
  })
})

export default upload
