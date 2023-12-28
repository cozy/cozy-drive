import React from 'react'
import { connect, useDispatch } from 'react-redux'
import compose from 'lodash/flowRight'

import { withClient } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import {
  isTypingNewFolderName,
  hideNewFolderInput,
  isEncryptedFolder
} from 'drive/web/modules/filelist/duck'
import { createFolder } from 'drive/web/modules/navigation/duck'
import { AddFolderRow } from 'drive/web/modules/filelist/AddFolderRow'

const AddFolder = ({
  visible,
  isEncrypted,
  onSubmit,
  onAbort,
  extraColumns
}) => {
  if (!visible) {
    return null
  }

  return (
    <AddFolderRow
      isEncrypted={isEncrypted}
      onSubmit={onSubmit}
      onAbort={onAbort}
      extraColumns={extraColumns}
    />
  )
}

const mapStateToProps = state => ({
  visible: isTypingNewFolderName(state),
  isEncrypted: isEncryptedFolder(state)
})

const createFolderAfterSubmit =
  (ownProps, name) => async (dispatch, getState) => {
    return dispatch(
      createFolder(
        ownProps.client,
        ownProps.vaultClient,
        name,
        ownProps.currentFolderId,
        {
          isEncryptedFolder: isEncryptedFolder(getState())
        }
      )
    ).then(() => {
      // eslint-disable-next-line promise/always-return
      if (ownProps.afterSubmit) {
        ownProps.afterSubmit()
      }
    })
  }

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: name => dispatch(createFolderAfterSubmit(ownProps, name)),
  onAbort: accidental => {
    if (accidental) {
      Alerter.info('alert.folder_abort')
    }
    if (ownProps.afterAbort) {
      ownProps.afterAbort()
    }
  }
})

const AddFolderWithoutState = compose(
  withClient,
  connect(null, mapDispatchToProps)
)(AddFolder)

const AddFolderWithState = compose(
  withClient,
  connect(mapStateToProps, mapDispatchToProps)
)(AddFolder)

const AddFolderWithAfter = ({ refreshFolderContent, ...props }) => {
  const dispatch = useDispatch()

  const handleAfterSubmit = () => {
    if (refreshFolderContent) {
      refreshFolderContent()
    }
    dispatch(hideNewFolderInput())
  }

  const handleAfterAbort = () => {
    dispatch(hideNewFolderInput())
  }

  return (
    <AddFolderWithState
      afterSubmit={handleAfterSubmit}
      afterAbort={handleAfterAbort}
      {...props}
    />
  )
}

export { AddFolder, AddFolderWithoutState }

export default AddFolderWithAfter
