import React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/flowRight'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'

import { downloadFiles } from 'drive/web/modules/actions/utils'
import toolbarContainer from '../toolbar'

const DownloadButtonItem = ({ t, displayedFolder, downloadAll }) => {
  return (
    <ActionMenuItem
      left={<Icon icon={DownloadIcon} />}
      onClick={() => downloadAll([displayedFolder])}
    >
      {t('toolbar.menu_download_folder')}
    </ActionMenuItem>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  downloadAll: folder => {
    const client = ownProps.client
    return downloadFiles(client, folder)
  }
})

export default compose(
  withClient,
  translate(),
  connect(null, mapDispatchToProps),
  toolbarContainer
)(DownloadButtonItem)
