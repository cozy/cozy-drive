import React from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconFolder from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'

import { showNewFolderInput } from 'drive/web/modules/filelist/duck'

const AddFolderItem = translate()(({ t, addFolder }) => {
  return (
    <ActionMenuItem
      data-testid="add-folder-link"
      onClick={addFolder}
      left={<Icon icon={IconFolder} />}
    >
      {t('toolbar.menu_new_folder')}
    </ActionMenuItem>
  )
})
const mapDispatchToProps = dispatch => ({
  addFolder: () => dispatch(showNewFolderInput())
})

export default connect(null, mapDispatchToProps)(AddFolderItem)
