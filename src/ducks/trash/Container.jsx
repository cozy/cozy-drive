import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../lib/I18n'
import confirm from '../../lib/confirm'

import FolderView from '../../components/FolderView'
import EmptyTrashConfirm from './components/EmptyTrashConfirm'
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
      restore: () => dispatch(restoreFiles(ownProps.selected)),
      destroy: () =>
        confirm(<EmptyTrashConfirm t={ownProps.t} />)
          .then(() => dispatch(destroyFiles(ownProps.selected)))
          .catch(() => {})
    }
  })
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView))
