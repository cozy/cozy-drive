import React from 'react'
import { connect } from 'react-redux'

import FolderView from '../components/FolderView'

import { downloadSelection, hideSelectionBar, showDeleteConfirmation } from '../actions'
import {  } from '../reducers'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: false,
  canUpload: true
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: Object.assign({}, ownProps.actions, {
    selection: {
      download: () => {
        dispatch(downloadSelection(ownProps.selected))
        dispatch(hideSelectionBar())
      },
      trash: () => {
        dispatch(showDeleteConfirmation())
      }
    }
  })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView)
