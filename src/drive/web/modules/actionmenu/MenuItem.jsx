import React from 'react'
import { connect } from 'react-redux'
import Toggle from 'cozy-ui/react/Toggle'

import { isAvailableOffline } from 'drive/web/modules/drive/availableOffline'

const MenuItem = ({ className, children, checkbox, onClick }) => (
  <div>
    <a className={className} onClick={onClick}>
      {children}
      {checkbox && (
        <Toggle
          id={children}
          checked={checkbox.value}
          onToggle={checkbox.onChange}
        />
      )}
    </a>
  </div>
)
export default MenuItem

const mapStateToProps = (state, ownProps) => ({
  checkbox: {
    value: isAvailableOffline(state)(ownProps.files[0].id),
    onChange: () => {}
  }
})

export const ConnectedToggleMenuItem = connect(mapStateToProps)(MenuItem)
