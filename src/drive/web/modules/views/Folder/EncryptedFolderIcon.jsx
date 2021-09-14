import React from 'react'
import IconLock from 'cozy-ui/transpiled/react/Icons/Lock'
import IconStack from 'cozy-ui/transpiled/react/IconStack'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconFolder from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import palette from 'cozy-ui/transpiled/react/palette'

const EncryptedFolderIcon = ({ size = 32 }) => {
  return (
    <IconStack
      backgroundIcon={<Icon icon={IconFolder} size={size} />}
      foregroundIcon={
        <Icon icon={IconLock} color={palette.dodgerBlue} size={size / 2} />
      }
    />
  )
}

export default EncryptedFolderIcon
