import React from 'react'
import { withClient } from 'cozy-client'
import useFetchShortcut from './useFetchShortcut'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Badge from 'cozy-ui/transpiled/react/Badge'
import palette from 'cozy-ui/transpiled/react/palette'

const FileIconShortcut = ({ file, size, client }) => {
  const { shortcurtImg, shouldDisplayImg } = useFetchShortcut(client, file.id)
  return (
    <Badge
      content={<Icon icon="link" size={10} />}
      type="normal"
      alignment="bottom-right"
      size="medium"
    >
      <>
        <div style={{ display: shouldDisplayImg ? 'block' : 'none' }}>
          <img src={shortcurtImg} width={size} height={size} />
        </div>
        <div
          style={{
            display: !shouldDisplayImg ? 'block' : 'none'
          }}
        >
          <Icon icon="globe" size={size} color={palette.coolGrey} />
        </div>
      </>
    </Badge>
  )
}

export default withClient(FileIconShortcut)
