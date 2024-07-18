import compose from 'lodash/flowRight'
import React from 'react'
import { connect, useDispatch } from 'react-redux'

import { withClient } from 'cozy-client'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { AddFolderRow } from 'modules/filelist/AddFolderRow'
import {
  isTypingNewFolderName,
  hideNewFolderInput,
  isEncryptedFolder
} from 'modules/filelist/duck'
import { createFolder } from 'modules/navigation/duck'

const AddFolder = ({
  visible,
  isEncrypted,
  onSubmit,
  onAbort,
  extraColumns
}) => {
  const { t } = useI18n()
  const { showAlert } = useAlert()

  if (!visible) {
    return null
  }

  return (
    <AddFolderRow
      isEncrypted={isEncrypted}
      onSubmit={name => onSubmit(name, showAlert, t)}
      onAbort={accidental => onAbort(accidental, showAlert, t)}
      extraColumns={extraColumns}
    />
  )
}

const mapStateToProps = state => ({
  visible: isTypingNewFolderName(state),
  isEncrypted: isEncryptedFolder(state)
})

const createFolderAfterSubmit =
  (ownProps, name, { showAlert, t }) =>
  async (dispatch, getState) => {
    return dispatch(
      createFolder(
        ownProps.client,
        ownProps.vaultClient,
        name,
        ownProps.currentFolderId,
        {
          isEncryptedFolder: isEncryptedFolder(getState()),
          showAlert,
          t
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
  onSubmit: (name, showAlert, t) =>
    dispatch(createFolderAfterSubmit(ownProps, name, { showAlert, t })),
  onAbort: (accidental, showAlert, t) => {
    if (accidental) {
      showAlert({
        message: t('alert.folder_abort'), //
        severity: 'secondary'
      })
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
