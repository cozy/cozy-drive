import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import ClockIcon from 'cozy-ui/transpiled/react/Icons/Clock'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Folder'
import StarIcon from 'cozy-ui/transpiled/react/Icons/Star'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import UINav from 'cozy-ui/transpiled/react/Nav'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { FavoriteList } from '@/modules/navigation/FavoriteList'
import { useNavContext } from '@/modules/navigation/NavContext'
import { NavItem } from '@/modules/navigation/NavItem'
import { SharingsNavItem } from '@/modules/navigation/SharingsNavItem'
import { SharedDriveList } from '@/modules/navigation/components/SharedDriveList'
import { useSharedDrives } from '@/modules/shareddrives/hooks'

export const Nav = () => {
  const clickState = useNavContext()
  const { isDesktop } = useBreakpoints()
  const { isLoaded: isSharedDriveLoaded, sharedDrives } = useSharedDrives()

  return (
    <UINav>
      <NavItem
        to="/folder"
        icon={<Icon icon={FolderIcon} />}
        label="drive"
        rx={/\/(folder|nextcloud)(\/.*)?/}
        clickState={clickState}
      />
      {!isDesktop ? (
        <NavItem
          to="/favorites"
          icon={<Icon icon={StarIcon} />}
          label="favorites"
          rx={/\/favorites(\/.*)?/}
          clickState={clickState}
        />
      ) : null}
      <NavItem
        to="/recent"
        icon={<Icon icon={ClockIcon} />}
        label="recent"
        rx={/\/recent(\/.*)?/}
        clickState={clickState}
      />
      <SharingsNavItem clickState={clickState} />
      <NavItem
        to="/trash"
        icon={<Icon icon={TrashIcon} />}
        label="trash"
        rx={/\/trash(\/.*)?/}
        clickState={clickState}
      />
      {isDesktop && isSharedDriveLoaded ? (
        <SharedDriveList
          clickState={clickState}
          className="u-mt-half"
          sharedDrives={sharedDrives}
        />
      ) : null}
      {isDesktop ? (
        <FavoriteList clickState={clickState} className="u-mt-half" />
      ) : null}
    </UINav>
  )
}

export default Nav
