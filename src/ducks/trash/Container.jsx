import React from 'react'
import { connect } from 'react-redux'

import FolderView from '../../components/FolderView'
import Toolbar from './Toolbar'

import { restoreFile, toggleFileSelection } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: true,
  canUpload: false,
  toolbar: <Toolbar />
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: Object.assign({}, ownProps.actions, {
    selection: {
      restore: () => {
        ownProps.selected.forEach(item => {
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
