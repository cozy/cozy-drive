import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchFiles, renameFile } from '../actions'
import { getVisibleFiles } from '../reducers'

import FileList from '../components/FileList'

class Folder extends Component {
  componentWillMount () {
    this.props.onMount()
  }

  componentWillReceiveProps (newProps) {
    if (newProps.params.file !== this.props.params.file) {
      this.props.onRouteChange(newProps.params.file)
    }
  }

  render (props) {
    return <FileList {...props} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.ui.isFetching,
  files: getVisibleFiles(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMount: () => {
    dispatch(fetchFiles(ownProps.params.file))
  },
  onRouteChange: (folderId) => {
    dispatch(fetchFiles(folderId))
  },
  onFileEdit: (val, attrs) => {
    dispatch(renameFile(val, attrs))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Folder)
