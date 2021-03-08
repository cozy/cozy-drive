import React from 'react'

import { useClient, useFetchShortcut } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import palette from 'cozy-ui/transpiled/react/palette'
import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'

const FileIconShortcut = ({ file, size = 32 }) => {
  const client = useClient()
  const { shortcutImg } = useFetchShortcut(client, file.id)
  return (
    <>
      <div style={{ display: shortcutImg ? 'block' : 'none' }}>
        <img src={shortcutImg} width={size} height={size} />
      </div>
      <div
        style={{
          display: !shortcutImg ? 'block' : 'none'
        }}
      >
        <Icon icon={GlobeIcon} size={size} color={palette.coolGrey} />
      </div>
    </>
  )
}

export default FileIconShortcut
