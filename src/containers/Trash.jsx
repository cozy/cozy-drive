import React from 'react'
import { connect } from 'react-redux'

import FolderView from '../components/FolderView'

import { hideSelectionBar, restoreFile, toggleFileSelection } from '../actions'
import {  } from '../reducers'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: true,
  canUpload: false
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: Object.assign({}, ownProps.actions, {
    selection: {
      onHide: () => {
        dispatch(hideSelectionBar())
      },
      onRestore: (selected) => {
        selected.forEach(item => {
          dispatch(restoreFile(item))
          dispatch(toggleFileSelection(item, true))
        })
      }
    }
  })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView)
