import React from 'react'

import { FolderPickerContentCozy } from 'components/FolderPicker/FolderPickerContentCozy'
import { FolderPickerContentNextcloud } from 'components/FolderPicker/FolderPickerContentNextcloud'
import { FolderPickerContentRoot } from 'components/FolderPicker/FolderPickerContentRoot'

const FolderPickerBody = ({
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
