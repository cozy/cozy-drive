import React from 'react'
import { withClient } from 'cozy-client'
import useFetchShortcut from './useFetchShortcut'
import Badge from 'cozy-ui/transpiled/react/Badge'
import Icon from 'cozy-ui/transpiled/react/Icon'
const FileIconShortcut = ({ file, size, client }) => {
  const { fetchStatus, shortcutInfos, shortcurtImg } = useFetchShortcut(
    client,
    file
  )

  return (
    <Badge content={<Icon icon="share" />} type="normal">
      <img src={shortcurtImg} width={size} height={size} />
    </Badge>
  )
}

export default withClient(FileIconShortcut)
