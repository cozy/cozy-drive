import React from 'react'
import { connect } from 'react-redux'
import FilenameInput from '../../components/FilenameInput'
import { getUpdatedName, rename, updateFileName, abortRenaming } from './rename'

const RenameInput = ({ name, updateRenaming, rename, abortRenaming }) => (
  <FilenameInput
    name={name}
    onChange={updateRenaming}
    onSubmit={rename}
    onAbort={abortRenaming}
  />
)

const mapStateToProps = (state, ownProps) => ({
  name: getUpdatedName(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateRenaming: name => dispatch(updateFileName(name)),
  rename: () => dispatch(rename()),
  abortRenaming: name => dispatch(abortRenaming())
})

export default connect(mapStateToProps, mapDispatchToProps)(RenameInput)
