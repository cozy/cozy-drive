import React from 'react'
import { connect } from 'react-redux'
import FilenameInput from 'drive/web/modules/filelist/FilenameInput'
import { getUpdatedName, rename, updateFileName, abortRenaming } from './rename'

const RenameInput = ({ name, updateRenaming, rename, abortRenaming }) => (
  <FilenameInput
    name={name}
    onChange={updateRenaming}
    onSubmit={rename}
    onAbort={abortRenaming}
  />
)

const mapStateToProps = state => ({
  name: getUpdatedName(state)
})

const mapDispatchToProps = dispatch => ({
  updateRenaming: name => dispatch(updateFileName(name)),
  rename: () => dispatch(rename()),
  abortRenaming: () => dispatch(abortRenaming())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RenameInput)
