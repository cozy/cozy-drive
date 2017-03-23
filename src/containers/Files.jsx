import React from 'react'
import { connect } from 'react-redux'

import FolderView from '../components/FolderView'

import {  } from '../actions'
import {  } from '../reducers'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: false,
  canUpload: true
})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView)
