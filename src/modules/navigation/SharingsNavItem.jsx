import React from 'react'

import { useQuery } from 'cozy-client'

import { buildNewSharingShortcutQuery } from 'modules/queries'
import { NavItem } from 'modules/navigation/NavItem'

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
