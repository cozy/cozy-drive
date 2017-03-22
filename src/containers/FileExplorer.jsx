import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { locationChange } from '../actions'
import { getVirtualRootFromUrl, getUrlFromParams } from '../reducers'

import Folder from './Folder'

const urlHasChanged = (props, newProps) =>
  props.location.pathname !== newProps.location.pathname

const matchCurrentView = (props, newProps) =>
  newProps.location.pathname === getUrlFromParams(props.view)

class FileExplorer extends Component {
  componentWillMount () {
    this.props.onLocationChange(
      getVirtualRootFromUrl(this.props.location.pathname),
      this.props.params.folderId
    )
  }

  componentWillReceiveProps (newProps) {
    if (urlHasChanged(this.props, newProps) && !matchCurrentView(this.props, newProps)) {
      this.props.onLocationChange(
        getVirtualRootFromUrl(newProps.location.pathname),
        newProps.params.folderId
      )
    }
  }

  render () {
    return <Folder />
  }
}

const mapStateToProps = (state, ownProps) => ({
  view: state.view
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLocationChange: (virtualRoot, folderId) =>
    dispatch(locationChange(virtualRoot, folderId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FileExplorer))
