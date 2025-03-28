import React, { useState } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import ClockIcon from 'cozy-ui/transpiled/react/Icons/Clock'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Folder'
import StarIcon from 'cozy-ui/transpiled/react/Icons/Star'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import UINav from 'cozy-ui/transpiled/react/Nav'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { FavoriteList } from '@/modules/navigation/FavoriteList'
import { NavItem } from '@/modules/navigation/NavItem'
import { SharingsNavItem } from '@/modules/navigation/SharingsNavItem'

export const Nav = () => {
  const clickState = useState(null)
  const { isDesktop } = useBreakpoints()

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
      {isDesktop ? (
        <FavoriteList clickState={clickState} className="u-mt-half" />
      ) : null}
    </UINav>
  )
}

export default Nav
