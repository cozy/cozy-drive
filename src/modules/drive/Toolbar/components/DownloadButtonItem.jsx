import React from 'react'

import { useClient } from 'cozy-client'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { downloadFiles } from 'modules/actions/utils'

const DownloadButtonItem = ({ files }) => {
  const { showAlert } = useAlert()
  const { t } = useI18n()
  const client = useClient()

  const handleClick = () => {
    downloadFiles(client, files, { showAlert, t })
  }

  return (
    <ActionsMenuItem isListItem onClick={handleClick}>
      <ListItemIcon>
        <Icon icon={DownloadIcon} />
      </ListItemIcon>
      <ListItemText primary={t('toolbar.menu_download_folder')} />
    </ActionsMenuItem>
  )
}

export default DownloadButtonItem
