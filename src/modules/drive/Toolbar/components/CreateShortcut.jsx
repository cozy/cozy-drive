import React from 'react'
import { showModal } from 'react-cozy-helpers'
import { connect } from 'react-redux'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DeviceBrowserIcon from 'cozy-ui/transpiled/react/Icons/DeviceBrowser'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ShortcutCreationModal from './ShortcutCreationModal'

const CreateShortcutWrapper = ({ openModal, onClick }) => {
  const { t } = useI18n()

  const handleClick = () => {
    openModal()
    onClick()
  }

  return (
    <ActionsMenuItem data-testid="create-a-shortcut" onClick={handleClick}>
      <ListItemIcon>
        <Icon icon={DeviceBrowserIcon} />
      </ListItemIcon>
      <ListItemText primary={t('toolbar.menu_create_shortcut')} />
    </ActionsMenuItem>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  openModal: () =>
    dispatch(
      showModal(<ShortcutCreationModal onCreated={ownProps.onCreated} />)
    )
})

export default connect(null, mapDispatchToProps)(CreateShortcutWrapper)
