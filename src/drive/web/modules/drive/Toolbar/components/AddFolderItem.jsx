import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { showNewFolderInput } from 'drive/web/modules/filelist/duck'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'

const AddFolderItem = translate()(({ t, addFolder }) => {
  return (
    <ActionMenuItem
      data-test-id="add-folder-link"
      onClick={addFolder}
      left={<Icon icon="folder-add" />}
    >
      {t('toolbar.menu_new_folder')}
    </ActionMenuItem>
  )
})
const mapDispatchToProps = dispatch => ({
  addFolder: () => dispatch(showNewFolderInput())
})

export default connect(
  null,
  mapDispatchToProps
)(AddFolderItem)
