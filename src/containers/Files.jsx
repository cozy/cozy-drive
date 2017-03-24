import React from 'react'
import { connect } from 'react-redux'

import FolderView from '../components/FolderView'

import { downloadSelection, hideSelectionBar, showFileActionMenu, showDeleteConfirmation } from '../actions'
import {  } from '../reducers'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: false,
  canUpload: true
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: Object.assign({}, ownProps.actions, {
    selection: {
      onDownload: () => {
        dispatch(downloadSelection(ownProps.selected))
        dispatch(hideSelectionBar())
      },
      onHide: () => {
        dispatch(hideSelectionBar())
      },
      onDelete: () => {
        dispatch(showDeleteConfirmation())
      },
      onShowActionMenu: () => {
        dispatch(showFileActionMenu())
      }
    }
  })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView)
