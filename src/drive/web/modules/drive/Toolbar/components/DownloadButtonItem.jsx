import React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/flowRight'
import { withClient } from 'cozy-client'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { downloadFiles as downloadFilesV2 } from 'drive/web/modules/actions/utils'

import toolbarContainer from '../toolbar'

const DownloadButtonItem = ({ t, displayedFolder, downloadAll }) => {
  return (
    <ActionMenuItem
      left={<Icon icon="download" />}
      onClick={() => downloadAll([displayedFolder])}
    >
      {t('toolbar.menu_download_folder')}
    </ActionMenuItem>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  downloadAll: folder => {
    const client = ownProps.client
    return downloadFilesV2(client, folder)
  }
})

export default compose(
  withClient,
  translate(),
  connect(
    null,
    mapDispatchToProps
  ),
  toolbarContainer
)(DownloadButtonItem)
