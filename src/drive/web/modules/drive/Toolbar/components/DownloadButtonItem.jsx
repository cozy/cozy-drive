import React from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { downloadFiles } from 'drive/web/modules/navigation/duck'

import toolbarContainer from '../toolbar'
const DownloadButtonItem = translate()(
  ({ t, displayedFolder, downloadAll }) => {
    return (
      <ActionMenuItem
        left={<Icon icon="download" />}
        onClick={() => downloadAll([displayedFolder])}
      >
        {t('toolbar.menu_download_folder')}
      </ActionMenuItem>
    )
  }
)
const mapDispatchToProps = dispatch => ({
  downloadAll: folder => dispatch(downloadFiles(folder))
})
export default connect(
  null,
  mapDispatchToProps
)(toolbarContainer(DownloadButtonItem))
