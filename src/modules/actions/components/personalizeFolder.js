import React from 'react'

import flag from 'cozy-flags'
import { makeAction } from 'cozy-ui/transpiled/react/ActionsMenu/Actions/makeAction'
import PaletteIcon from 'cozy-ui/transpiled/react/Icons/Palette'

import { FolderCustomizerModal } from '../../views/Folder/FolderCustomizer'

const personalizeFolder = ({ t, pushModal, popModal }) => {
  const icon = PaletteIcon
  const label = t('actions.personalizeFolder.label')

  return makeAction({
    name: 'personalizeFolder',
    label,
    icon,
    displayCondition: docs =>
      flag('drive.folder-personalization.enabled') &&
      docs.length === 1 &&
      docs[0].type === 'directory',
    action: docs => {
      if (docs.length === 1 && docs[0].type === 'directory') {
        const folderId = docs[0]._id

        pushModal(
          <FolderCustomizerModal folderId={folderId} onClose={popModal} />
        )
      }
    }
  })
}

export { personalizeFolder }
