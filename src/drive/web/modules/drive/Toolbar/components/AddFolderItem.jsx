import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import styles from 'drive/styles/toolbar'
import { showNewFolderInput } from 'drive/web/modules/filelist/duck'

const AddFolderItem = translate()(({ t, addFolder }) => {
  return (
    <a
      data-test-id="add-folder-link"
      className={styles['fil-action-newfolder']}
      onClick={addFolder}
    >
      {t('toolbar.menu_new_folder')}
    </a>
  )
})
const mapDispatchToProps = dispatch => ({
  addFolder: () => dispatch(showNewFolderInput())
})

export default connect(
  null,
  mapDispatchToProps
)(AddFolderItem)
