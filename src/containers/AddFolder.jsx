import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import styles from '../styles/table'

import { createFolder } from '../actions'
import FilenameInput from '../components/FilenameInput'

const AddFolder = ({ visible, submitting, onSubmit }) => {
  if (!visible) {
    return null
  }
  return (
    <tr>
      <td class={classNames(styles['fil-content-file'], styles['fil-file-folder'])}>
        <FilenameInput submitting={submitting} onSubmit={onSubmit} />
      </td>
      <td>
        
      </td>
      <td>—</td>
      <td>—</td>
    </tr>
  )
}

const mapStateToProps = (state, ownProps) => ({
  visible: state.ui.isAddingFolder,
  submitting: state.ui.isWorking
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (name) => dispatch(createFolder(name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddFolder)
