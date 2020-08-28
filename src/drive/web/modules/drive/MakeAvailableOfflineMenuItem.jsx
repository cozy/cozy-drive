import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { useClient } from 'cozy-client'

import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'

import MenuItem from 'drive/web/modules/actionmenu/MenuItem'
import {
  isAvailableOffline,
  toggleAvailableOffline
} from 'drive/mobile/modules/offline/duck'

const MakeAvailableOfflineMenuItem = connect(
  (state, ownProps) => ({
    checked: isAvailableOffline(state, ownProps.file.id)
  }),
  (dispatch, ownProps) => ({
    toggleOfflineAvailability: client =>
      dispatch(toggleAvailableOffline(ownProps.file, client))
  })
)(({ checked, toggleOfflineAvailability, children, ...rest }) => {
  const client = useClient()
  const onToggle = useCallback(() => toggleOfflineAvailability(client))
  return (
    <MenuItem {...rest}>
      {children}
      <Switch
        id={children}
        checked={checked}
        onClick={ev => onToggle(ev.target.checked)}
        classes={{
          switchBase: 'u-h-half'
        }}
      />
    </MenuItem>
  )
})

export default MakeAvailableOfflineMenuItem
