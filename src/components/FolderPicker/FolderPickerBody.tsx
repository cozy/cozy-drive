import React from 'react'

import { FolderPickerContentCozy } from 'components/FolderPicker/FolderPickerContentCozy'
import { FolderPickerContentNextcloud } from 'components/FolderPicker/FolderPickerContentNextcloud'
import { FolderPickerContentRoot } from 'components/FolderPicker/FolderPickerContentRoot'
import { File, FolderPickerEntry } from 'components/FolderPicker/types'

interface FolderPickerBodyProps {
  folder?: File
  entries: FolderPickerEntry[]
  navigateTo: (folder?: File) => void
  isFolderCreationDisplayed: boolean
  hideFolderCreation: () => void
}

const FolderPickerBody: React.FC<FolderPickerBodyProps> = ({
  folder,
  entries,
  navigateTo,
  isFolderCreationDisplayed,
  hideFolderCreation
}) => {
  if (folder?._type === 'io.cozy.files') {
    return (
      <FolderPickerContentCozy
        folder={folder}
        isFolderCreationDisplayed={isFolderCreationDisplayed}
        hideFolderCreation={hideFolderCreation}
        entries={entries}
        navigateTo={navigateTo}
      />
    )
  }

  if (folder?._type === 'io.cozy.remote.nextcloud.files') {
    return (
      <FolderPickerContentNextcloud
        folder={folder}
        entries={entries}
        navigateTo={navigateTo}
      />
    )
  }

  return <FolderPickerContentRoot navigateTo={navigateTo} />
}

export { FolderPickerBody }
