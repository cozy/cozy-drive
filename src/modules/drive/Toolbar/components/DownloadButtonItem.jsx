import React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/flowRight'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'

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
