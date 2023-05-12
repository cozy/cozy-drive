import React, { forwardRef } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ActionMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'

const download = (onDownload, label) => () => ({
  name: 'download',
  action: onDownload,
  Component: forwardRef(function Download(props, ref) {
    return (
      <ActionMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={DownloadIcon} />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ActionMenuItem>
    )
  })
})

export default download
