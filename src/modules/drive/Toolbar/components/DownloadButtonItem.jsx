import compose from 'lodash/flowRight'
import React from 'react'
import { connect } from 'react-redux'

import { withClient } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import { downloadFiles } from 'modules/actions/utils'

const DownloadButtonItem = ({ t, downloadAll, displayedFolder }) => {
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
  connect(null, mapDispatchToProps)
)(DownloadButtonItem)
