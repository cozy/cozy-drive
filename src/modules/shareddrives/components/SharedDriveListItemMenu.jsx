import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { manageAccess } from '@/modules/shareddrives/components/actions/manageAccess'

const SharedDriveListItemMenu = ({ isOpen, toggleMenu, sharedDrive }) => {
  const anchorRef = useRef(null)
  const navigate = useNavigate()
  const { t } = useI18n()

  const actions = makeActions([manageAccess], { sharedDrive, navigate, t })

  return sharedDrive.owner ? (
    <>
      <IconButton ref={anchorRef} onClick={toggleMenu}>
        <Icon icon={DotsIcon} />
      </IconButton>
      <ActionsMenu
        ref={anchorRef}
        open={isOpen}
        actions={actions}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        autoClose
        onClose={toggleMenu}
      ></ActionsMenu>
    </>
  ) : null
}

export { SharedDriveListItemMenu }
