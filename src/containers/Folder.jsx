import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchFiles } from '../actions'

import Table from '../components/Table'

class Folder extends Component {
  componentWillMount() {
    this.props.fetchFiles()
  }

  render({ loading, files }) {
    if (loading) return <p>Loading</p>
    return <Table files={files} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.ui.loading,
    files: state.ui.displayedFiles
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchFiles: () => {
    dispatch(fetchFiles(ownProps.file))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Folder)
