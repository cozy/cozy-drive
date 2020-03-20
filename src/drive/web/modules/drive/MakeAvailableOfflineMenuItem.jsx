import React from 'react'
import { connect } from 'react-redux'
import Toggle from 'cozy-ui/transpiled/react/Toggle'
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
    onToggle: () => dispatch(toggleAvailableOffline(ownProps.file))
  })
)(({ checked, onToggle, children, ...rest }) => (
  <MenuItem {...rest}>
    {children}
    <Toggle id={children} checked={checked} onToggle={onToggle} />
  </MenuItem>
))

export default MakeAvailableOfflineMenuItem
