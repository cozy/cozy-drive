import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchFiles, renameFile } from '../actions'
import { getVisibleFiles } from '../reducers'

import FileList from '../components/FileList'

class Folder extends Component {
  componentWillMount () {
    this.props.onMount()
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
    dispatch(fetchFiles(ownProps.file))
  },
  onFileEdit: (val, attrs) => {
    dispatch(renameFile(val, attrs))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Folder)
