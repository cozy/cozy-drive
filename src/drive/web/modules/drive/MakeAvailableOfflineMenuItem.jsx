import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import PhoneDownloadIcon from 'cozy-ui/transpiled/react/Icons/PhoneDownload'

import {
  isAvailableOffline,
  toggleAvailableOffline
} from 'drive/mobile/modules/offline/duck'

const useStyles = makeStyles(() => ({
  sizeSmall: {
    marginTop: '-0.2rem'
  }
}))

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
  const styles = useStyles()
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
      left={<Icon icon={PhoneDownloadIcon} />}
      right={
        <Switch
          id={'offline-switch'}
          checked={checked}
          onClick={ev => onToggle(ev)}
          size="small"
          classes={{
            sizeSmall: styles.sizeSmall
          }}
        />
      }
    >
      {t('SelectionBar.phone-download')}
    </ActionMenuItem>
  )
})

export default MakeAvailableOfflineMenuItem
