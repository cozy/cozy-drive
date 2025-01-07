import React from 'react'
import { connect } from 'react-redux'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconFolder from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import { showNewFolderInput } from '@/modules/filelist/duck'

const AddFolderItem = translate()(({ t, addFolder, onClick }) => {
  const handleClick = () => {
    addFolder()
    onClick()
  }

  return (
    <ActionsMenuItem data-testid="add-folder-link" onClick={handleClick}>
      <ListItemIcon>
        <Icon icon={IconFolder} />
      </ListItemIcon>
      <ListItemText primary={t('toolbar.menu_new_folder')} />
    </ActionsMenuItem>
  )
})
const mapDispatchToProps = dispatch => ({
  addFolder: () => dispatch(showNewFolderInput())
})

export default connect(null, mapDispatchToProps)(AddFolderItem)
