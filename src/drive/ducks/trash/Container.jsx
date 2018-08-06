import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import { isAvailableOffline } from '../files/availableOffline'
import { showModal } from 'react-cozy-helpers'

import FolderView from '../../components/FolderView'
import DestroyConfirm from './components/DestroyConfirm'
import Toolbar from './Toolbar'

import { restoreFiles, destroyFiles } from './actions'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: true,
  canDrop: false,
  canUpload: false,
  withSharedBadge: false,
  Toolbar,
  isAvailableOffline: isAvailableOffline(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: Object.assign({}, ownProps.actions, {
    selection: {
      restore: {
        action: files => dispatch(restoreFiles(files))
      },
      destroy: {
        action: files =>
          dispatch(
            showModal(
              <DestroyConfirm
                t={ownProps.t}
                fileCount={files.length}
                confirm={() => dispatch(destroyFiles(files))}
              />
            )
          )
      }
    }
  })
})

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(FolderView)
)
