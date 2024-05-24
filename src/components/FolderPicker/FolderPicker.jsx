import { useDisplayedFolder } from 'hooks'
import React, { useState } from 'react'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { FolderPickerBody } from 'components/FolderPicker/FolderPickerBody'
import { FolderPickerFooter } from 'components/FolderPicker/FolderPickerFooter'
import { FolderPickerHeader } from 'components/FolderPicker/FolderPickerHeader'
import { FolderPickerTopbar } from 'components/FolderPicker/FolderPickerTopbar'
import { ROOT_DIR_ID } from 'constants/config'

const useStyles = makeStyles(() => ({
  paper: {
    height: '100%',
    '& .MuiDialogContent-root': {
      padding: '0'
    },
    '& .MuiDialogTitle-root': {
      padding: '0'
    }
  }
}))

const FolderPicker = ({
  entries,
  onConfirm,
  onClose,
  isBusy,
  canCreateFolder = true,
  slotProps
}) => {
  const { displayedFolder } = useDisplayedFolder()
  const [folderId, setFolderId] = useState(
    displayedFolder ? displayedFolder._id : ROOT_DIR_ID
  )
  const [isFolderCreationDisplayed, setFolderCreationDisplayed] =
    useState(false)
  const classes = useStyles()

  const showFolderCreation = () => {
    setFolderCreationDisplayed(true)
  }

  const hideFolderCreation = () => {
    setFolderCreationDisplayed(false)
  }

  const navigateTo = folder => {
    setFolderId(folder._id)
    setFolderCreationDisplayed(false)
  }

  return (
    <React.Fragment>
      <FixedDialog
        className="u-p-0"
        open
        onClose={onClose}
        size="large"
        classes={{
          paper: classes.paper
        }}
        title={
          <>
            <FolderPickerHeader entries={entries} {...slotProps?.header} />
            <FolderPickerTopbar
              navigateTo={navigateTo}
              folderId={folderId}
              canCreateFolder={canCreateFolder}
              showFolderCreation={showFolderCreation}
            />
          </>
        }
        content={
          <FolderPickerBody
            folderId={folderId}
            navigateTo={navigateTo}
            entries={entries}
            isFolderCreationDisplayed={isFolderCreationDisplayed}
            hideFolderCreation={hideFolderCreation}
          />
        }
        actions={
          <FolderPickerFooter
            onConfirm={onConfirm}
            onClose={onClose}
            targets={entries}
            currentDirId={folderId}
            isMoving={isBusy}
            isLoading={isBusy}
            {...slotProps?.footer}
          />
        }
      />
    </React.Fragment>
  )
}

export { FolderPicker }
