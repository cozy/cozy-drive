import React from 'react'
import { connect } from 'react-redux'

import { showModal } from 'react-cozy-helpers'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'

import ShortcutCreationModal from './ShortcutCreationModalConnected'

const CreateShortcutWrapper = ({ openModal }) => {
  const { t } = useI18n()

  return (
    <ActionMenuItem
      data-test-id="create-a-shortcut"
      left={<Icon icon={LinkIcon} />}
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

export default connect(
  null,
  mapDispatchToProps
)(CreateShortcutWrapper)
