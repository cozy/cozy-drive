import React, { useState } from 'react'

import UINav from 'cozy-ui/transpiled/react/Nav'

import { DrivesNavItem } from 'modules/navigation/DrivesNavItem'
import { NavItem } from 'modules/navigation/NavItem'
import { SharingsNavItem } from 'modules/navigation/SharingsNavItem'

export const Nav = () => {
  const clickState = useState(null)

  return (
    <UINav>
      <DrivesNavItem clickState={clickState} />
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
