import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchFiles } from '../actions'

import Table from '../components/Table'

class Folder extends Component {
  componentWillMount () {
    this.props.fetchFiles()
  }

  render ({ isFetching, files }) {
    if (isFetching) return <p>Loading</p>
    return <Table files={files} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.ui.isFetching,
  files: state.files
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchFiles: () => {
    dispatch(fetchFiles(ownProps.file))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Folder)
