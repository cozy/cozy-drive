import React from 'react'

import Circle from 'cozy-ui/transpiled/react/Circle'
import Counter from 'cozy-ui/transpiled/react/Counter'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DriveIcon from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'

import getMimeTypeIcon from 'lib/getMimeTypeIcon'
import FileThumbnail from 'modules/filelist/FileThumbnail'

const FolderPickerHeaderIllustration = ({ entries }) => {
  if (entries.length === 1) {
    const firstItem = entries[0]

    // this is a cozy files
    if (firstItem.class) {
      return <FileThumbnail file={firstItem} />
    }

    // this is a cozy-flagship file, doesn't have a class yet
    if (firstItem.fromFlagship) {
      return (
        <Icon
          icon={getMimeTypeIcon(false, firstItem.fileName, firstItem.mimeType)}
          size={32}
        />
      )
    }

    return <Icon icon={DriveIcon} size={32} />
  }
  if (entries.length > 1) {
    return (
      <Circle>
        <Counter count={entries.length} />
      </Circle>
    )
  }
  return null
}

export { FolderPickerHeaderIllustration }
