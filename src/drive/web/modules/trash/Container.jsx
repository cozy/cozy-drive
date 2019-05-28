import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import { showModal } from 'react-cozy-helpers'

import FolderView from 'drive/web/modules/layout/FolderView'
import DestroyConfirm from './components/DestroyConfirm'
import Toolbar from './Toolbar'

import {
  restoreFiles,
  destroyFiles,
  OPEN_FOLDER_FROM_TRASH,
  OPEN_FOLDER_FROM_TRASH_SUCCESS,
  OPEN_FOLDER_FROM_TRASH_FAILURE
} from './actions'
import { openFolder, getFolderUrl } from 'drive/web/modules/navigation/duck'
//!TODO WTF? inital state ?
const mapStateToProps = () => ({
  isTrashContext: true,
  canDrop: false,
  canUpload: false,
  withSharedBadge: false,
  Toolbar
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
                fileCount={files.length}
                confirm={() => dispatch(destroyFiles(files))}
              />
            )
          )
      }
    }
  }),
  onFolderOpen: folderId => {
    dispatch(
      openFolder(
        folderId,
        OPEN_FOLDER_FROM_TRASH,
        OPEN_FOLDER_FROM_TRASH_SUCCESS,
        OPEN_FOLDER_FROM_TRASH_FAILURE
      )
    )
    ownProps.router.push(getFolderUrl(folderId, ownProps.location))
  }
})

/*

navigateToFolder = async folderId => {
    await this.props.fetchFolder(folderId)
    this.props.router.push(getFolderUrl(folderId, this.props.location))
  }
  fetchFolder: folderId => dispatch(openFolder(folderId)),

*/

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FolderView)
)
