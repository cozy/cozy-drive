import React from 'react'
import { connect } from 'react-redux'

import FolderView from '../../components/FolderView'
import Toolbar from './Toolbar'

import { restoreFiles } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: true,
  canUpload: false,
  Toolbar
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: Object.assign({}, ownProps.actions, {
    selection: {
      restore: () => dispatch(restoreFiles(ownProps.selected))
    }
  })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView)
