import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { useClient } from 'cozy-client'
import {
  isAvailableOffline,
  toggleAvailableOffline
} from 'drive/mobile/modules/offline/duck'

import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'
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
  const onToggle = useCallback(e => {
    e.stopPropagation()
    return toggleOfflineAvailability(client)
  })
  return (
    <ActionMenuItem
      onClick={e => {
        alert(e)
      }}
      {...rest}
      left={<Icon icon="phone-download" />}
      right={
        <Switch
          id={children}
          checked={checked}
          onClick={ev => onToggle(ev)}
          classes={{
            switchBase: 'u-h-half'
          }}
        />
      }
    >
      {children}
    </ActionMenuItem>
  )
})

export default MakeAvailableOfflineMenuItem
