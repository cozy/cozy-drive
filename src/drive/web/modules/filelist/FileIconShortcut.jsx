import React from 'react'
import { withClient, useFetchShortcut } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import palette from 'cozy-ui/transpiled/react/palette'

const FileIconShortcut = ({ file, size, client }) => {
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
        <Icon icon="globe" size={size} color={palette.coolGrey} />
      </div>
    </>
  )
}

export default withClient(FileIconShortcut)
