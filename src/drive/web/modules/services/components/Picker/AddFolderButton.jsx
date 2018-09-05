import React from 'react'
import { connect } from 'react-redux'
import { Button, ButtonAction, withBreakpoints, Icon } from 'cozy-ui/react'
import IconFolderAdd from 'drive/assets/icons/icon-folder-add.svg'
import { showNewFolderInput } from 'drive/web/modules/filelist/duck'

const AddFolderButton = ({ addFolder, breakpoints: { isMobile } }) => {
  if (isMobile)
    return (
      <ButtonAction
        compact
        rightIcon={<Icon icon={IconFolderAdd} color="coolGrey" />}
        onClick={addFolder}
        label={'Nouveau dossier'}
      />
    )
  else
    return (
      <Button icon={IconFolderAdd} onClick={addFolder}>
        Nouveau dossier
      </Button>
    )
}

const mapDispatchToPropsButton = (dispatch, ownProps) => ({
  addFolder: () => dispatch(showNewFolderInput())
})

export default connect(null, mapDispatchToPropsButton)(
  withBreakpoints()(AddFolderButton)
)
