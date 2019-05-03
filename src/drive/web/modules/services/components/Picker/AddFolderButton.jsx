import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, ButtonAction, withBreakpoints, Icon } from 'cozy-ui/react'
import IconFolderAdd from 'drive/assets/icons/icon-folder-add.svg'
import { showNewFolderInput } from 'drive/web/modules/filelist/duck'

const AddFolderButton = ({ addFolder, breakpoints: { isMobile } }, { t }) => {
  if (isMobile)
    return (
      <ButtonAction
        compact
        rightIcon={<Icon icon={IconFolderAdd} color="coolGrey" />}
        onClick={addFolder}
        label={t('intents.picker.new_folder')}
      />
    )
  else
    return (
      <Button icon={IconFolderAdd} onClick={addFolder}>
        {t('toolbar.menu_new_folder')}
      </Button>
    )
}

AddFolderButton.contextTypes = {
  t: PropTypes.func.isRequired
}

const mapDispatchToPropsButton = dispatch => ({
  addFolder: () => dispatch(showNewFolderInput())
})

export default connect(
  null,
  mapDispatchToPropsButton
)(withBreakpoints()(AddFolderButton))
