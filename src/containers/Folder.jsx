import React, { Component } from 'react'
import { connect } from 'react-redux'

import Table from '../components/Table'

class Folder extends Component {
  render() {
    return <Table {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    files: state.displayedFiles
  }
}

export default connect(
  mapStateToProps
)(Folder)
