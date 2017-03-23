import React from 'react'
import { connect } from 'react-redux'

import FolderView from '../components/FolderView'

import {  } from '../actions'
import {  } from '../reducers'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: true,
  canUpload: false
})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView)
