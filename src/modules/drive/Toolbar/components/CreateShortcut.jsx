import React from 'react'
import { showModal } from 'react-cozy-helpers'
import { connect } from 'react-redux'

import Icon from 'cozy-ui/transpiled/react/Icon'
import DeviceBrowserIcon from 'cozy-ui/transpiled/react/Icons/DeviceBrowser'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ShortcutCreationModal from './ShortcutCreationModal'

const CreateShortcutWrapper = ({ openModal }) => {
  const { t } = useI18n()

  return (
    <ActionMenuItem
      data-testid="create-a-shortcut"
      left={<Icon icon={DeviceBrowserIcon} />}
      onClick={openModal}
    >
      {t('toolbar.menu_create_shortcut')}
    </ActionMenuItem>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  openModal: () =>
    dispatch(
      showModal(<ShortcutCreationModal onCreated={ownProps.onCreated} />)
    )
})

export default connect(null, mapDispatchToProps)(CreateShortcutWrapper)
