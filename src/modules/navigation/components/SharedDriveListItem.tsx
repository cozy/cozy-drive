import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import FileTypeServerIcon from 'cozy-ui/transpiled/react/Icons/FileTypeServer'
import { NavIcon, NavLink, NavItem } from 'cozy-ui/transpiled/react/Nav'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import { useModalContext } from '@/lib/ModalContext'
import { editSharedDrive } from '@/modules/actions'
import { FileLink } from '@/modules/navigation/components/FileLink'
import { useSharedDriveLink } from '@/modules/navigation/hooks/useSharedDriveLink'
import { SharedDrive } from '@/modules/shareddrives/helpers'

interface SharedDriveListItemProps {
  sharedDrive: SharedDrive
  clickState: [string, (value: string | undefined) => void]
}

const SharedDriveListItem: FC<SharedDriveListItemProps> = ({
  sharedDrive,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clickState: [lastClicked, setLastClicked]
}) => {
  const { link } = useSharedDriveLink(sharedDrive)

  const client = useClient()
  const { t, lang } = useI18n()
  const { pushModal, popModal } = useModalContext()
  const { refresh } = useSharingContext()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { showAlert } = useAlert()
  const actionsOptions = {
    client,
    t,
    lang,
    pushModal,
    popModal,
    refresh,
    dispatch,
    navigate,
    pathname,
    hasWriteAccess: true,
    canMove: true,
    isPublic: false,
    showAlert
  }

  const actions = makeActions([editSharedDrive], actionsOptions)

  return (
    <NavItem key={sharedDrive._id}>
      <RightClickFileMenu disabled={false} doc={sharedDrive} actions={actions}>
        <FileLink
          link={link}
          className={NavLink.className}
          onClick={(): void => setLastClicked(undefined)}
        >
          <NavIcon icon={FileTypeServerIcon} />
          <Typography variant="inherit" color="inherit" noWrap>
            {sharedDrive.rules[0].title}
          </Typography>
        </FileLink>
      </RightClickFileMenu>
    </NavItem>
  )
}

export { SharedDriveListItem }
