import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { openFolder, renameFile } from '../actions'
import { getVisibleFiles } from '../reducers'

import FileList from '../components/FileList'

class Folder extends Component {
  componentWillMount () {
    this.props.onMount()
  }

  componentWillReceiveProps (newProps) {
    if (this.props.params.file !== undefined && // we're not in the root dir
      newProps.params.file !== this.props.params.file && // the route has changed
      newProps.params.file !== newProps.folder.id) { // but the folder has not been fetched
      this.props.onRouteChange(newProps.params.file)
    }
  }

  render (props, state) {
    if (props.isFetching === true) {
      return <p>Loading</p>
    }
    return <FileList {...props} {...state} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.ui.isFetching,
  folder: state.folder,
  files: getVisibleFiles(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMount: () => {
    dispatch(openFolder(ownProps.params.file, true))
  },
  onRouteChange: (folderId) => {
    dispatch(openFolder(folderId, true))
  },
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
