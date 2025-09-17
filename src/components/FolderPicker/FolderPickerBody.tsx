import React from 'react'

import { FolderPickerContentCozy } from '@/components/FolderPicker/FolderPickerContentCozy'
import { FolderPickerContentNextcloud } from '@/components/FolderPicker/FolderPickerContentNextcloud'
import { FolderPickerContentSharedDrive } from '@/components/FolderPicker/FolderPickerContentSharedDrive'
import { File, FolderPickerEntry } from '@/components/FolderPicker/types'

interface FolderPickerBodyProps {
  folder: File
  entries: FolderPickerEntry[]
  navigateTo: (folder: File) => void
  isFolderCreationDisplayed: boolean
  hideFolderCreation: () => void
  showNextcloudFolder?: boolean
  showSharedDriveFolder?: boolean
}

const FolderPickerBody: React.FC<FolderPickerBodyProps> = ({
  folder,
  entries,
  navigateTo,
  isFolderCreationDisplayed,
  hideFolderCreation,
  showNextcloudFolder,
  showSharedDriveFolder
}) => {
  if (folder._type === 'io.cozy.remote.nextcloud.files') {
    return (
      <FolderPickerContentNextcloud
        folder={folder}
        entries={entries}
        navigateTo={navigateTo}
      />
    )
  }

  if (folder.driveId) {
    return (
      <FolderPickerContentSharedDrive
        folder={folder}
        isFolderCreationDisplayed={isFolderCreationDisplayed}
        hideFolderCreation={hideFolderCreation}
        entries={entries}
        navigateTo={navigateTo}
      />
    )
  }

  return (
    <FolderPickerContentCozy
      folder={folder}
      isFolderCreationDisplayed={isFolderCreationDisplayed}
      hideFolderCreation={hideFolderCreation}
      entries={entries}
      navigateTo={navigateTo}
      showNextcloudFolder={showNextcloudFolder}
      showSharedDriveFolder={showSharedDriveFolder}
    />
  )
}

export { FolderPickerBody }
