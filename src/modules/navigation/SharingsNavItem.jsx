import React from 'react'

import { useQuery } from 'cozy-client'

import { NavItem } from 'modules/navigation/NavItem'
import { buildNewSharingShortcutQuery } from 'modules/queries'

const SharingsNavItem = ({ clickState }) => {
  const newSharingShortcutQuery = buildNewSharingShortcutQuery()
  const newSharingShortcutResult = useQuery(
    newSharingShortcutQuery.definition,
    newSharingShortcutQuery.options
  )

  return (
    <NavItem
      to="/sharings"
      icon="share"
      label="sharings"
      rx={/\/sharings(\/.*)?/}
      clickState={clickState}
      badgeContent={newSharingShortcutResult.data?.length}
    />
  )
}

export { SharingsNavItem }
