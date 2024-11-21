import compose from 'lodash/flowRight'
import React from 'react'
import { connect } from 'react-redux'

import { withClient } from 'cozy-client'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import { downloadFiles } from 'modules/actions/utils'

const DownloadButtonItem = ({ t, downloadAll, displayedFolder }) => {
  const { showAlert } = useAlert()

  return (
    <ActionsMenuItem
      isListItem
      onClick={() => downloadAll([displayedFolder], showAlert, t)}
    >
      <ListItemIcon>
        <Icon icon={DownloadIcon} />
      </ListItemIcon>
      <ListItemText primary={t('toolbar.menu_download_folder')} />
    </ActionsMenuItem>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  downloadAll: (folder, showAlert, t) => {
    const client = ownProps.client
    return downloadFiles(client, folder, { showAlert, t })
  }
})

export default compose(
  withClient,
  translate(),
  connect(null, mapDispatchToProps)
)(DownloadButtonItem)
