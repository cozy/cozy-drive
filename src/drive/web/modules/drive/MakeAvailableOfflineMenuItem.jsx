import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'

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
)(({ checked, toggleOfflineAvailability, ...rest }) => {
  const { t } = useI18n()
  const client = useClient()
  const onToggle = useCallback(
    e => {
      e.stopPropagation()
      return toggleOfflineAvailability(client)
    },
    [client, toggleOfflineAvailability]
  )
  return (
    <ActionMenuItem
      {...rest}
      left={<Icon icon="phone-download" />}
      right={
        <Switch
          id={'offline-switch'}
          checked={checked}
          onClick={ev => onToggle(ev)}
          classes={{
            switchBase: 'u-h-half'
          }}
        />
      }
    >
      {t('SelectionBar.phone-download')}
    </ActionMenuItem>
  )
})

export default MakeAvailableOfflineMenuItem
