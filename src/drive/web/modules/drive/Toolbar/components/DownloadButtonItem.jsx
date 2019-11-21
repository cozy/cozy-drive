import React from 'react'
import { connect } from 'react-redux'

import styles from 'drive/styles/toolbar.styl'
import { translate } from 'cozy-ui/transpiled/react'
import { downloadFiles } from 'drive/web/modules/navigation/duck'

import toolbarContainer from '../toolbar'
const DownloadButtonItem = translate()(
  ({ t, displayedFolder, downloadAll }) => {
    return (
      <a
        className={styles['fil-action-download']}
        onClick={() => downloadAll([displayedFolder])}
      >
        {t('toolbar.menu_download_folder')}
      </a>
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
