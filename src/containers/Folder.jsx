import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { openFolder, renameFile } from '../actions'
import { getVisibleFiles } from '../reducers'

import FileList from '../components/FileList'

class Folder extends Component {
  render (props, state) {
    if (props.isFetching === true) {
      return <p>Loading</p>
    }
    return <FileList {...props} {...state} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.ui.isFetching,
  files: getVisibleFiles(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFolderOpen: (folderId) => {
    dispatch(openFolder(folderId, false, ownProps.router))
  },
  onFileEdit: (val, attrs) => {
    dispatch(renameFile(val, attrs))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Folder))
