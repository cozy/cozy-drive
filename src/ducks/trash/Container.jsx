import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../lib/I18n'
import confirm from '../../lib/confirm'

import FolderView from '../../components/FolderView'
import DestroyConfirm from './components/DestroyConfirm'
import Toolbar from './Toolbar'

import { restoreFiles, destroyFiles } from './actions'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: true,
  canUpload: false,
  Toolbar
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: Object.assign({}, ownProps.actions, {
    selection: {
      restore: {
        action: files => dispatch(restoreFiles(files))
      },
      destroy: {
        action: files => confirm(<DestroyConfirm t={ownProps.t} fileCount={files.length} />)
          .then(() => dispatch(destroyFiles(files)))
          .catch(() => {})
      }
    }
  })
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView))
