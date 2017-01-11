import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchFiles, renameFile } from '../actions'
import { getVisibleFiles } from '../reducers'

import FileList from '../components/FileList'

class Folder extends Component {
  constructor (props) {
    super(props)
    this.state = { isFirstFetch: true }
  }

  componentWillMount () {
    if (!this.props.isFetching) {
      this.props.onMount()
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.params.file !== this.props.params.file) {
      this.setState({ isFirstFetch: false })
      this.props.onRouteChange(newProps.params.file)
    }
  }

  render (props, state) {
    return <FileList {...props} {...state} />
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
