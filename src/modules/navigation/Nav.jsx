import React, { useState } from 'react'

import UINav from 'cozy-ui/transpiled/react/Nav'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { NavItem } from 'modules/navigation/NavItem'
import { SharingsNavItem } from 'modules/navigation/SharingsNavItem'
import { SharedDrives } from 'modules/views/Folder/SharedDrives'

export const Nav = () => {
  const clickState = useState(null)
  const { isMobile } = useBreakpoints()

  return (
    <UINav>
      <NavItem
        to="/folder"
        icon="folder"
        label="drive"
        rx={/\/folder(\/.*)?/}
        clickState={clickState}
      />
      {!isMobile && <SharedDrives />}
      <NavItem
        to="/recent"
        icon="clock"
        label="recent"
        rx={/\/recent(\/.*)?/}
        clickState={clickState}
      />
      <SharingsNavItem clickState={clickState} />
      <NavItem
        to="/trash"
        icon="trash"
        label="trash"
        rx={/\/trash(\/.*)?/}
        clickState={clickState}
      />
    </UINav>
  )
}

export default Nav
