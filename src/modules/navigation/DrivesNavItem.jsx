import React from 'react'

import { useQuery } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { NavItem } from 'modules/navigation/NavItem'
import { SharedDrives } from 'modules/views/Folder/SharedDrives'
import { buildSharedDrivesQuery } from 'modules/views/Folder/queries/fetchSharedDrives'

const DrivesNavItem = ({ clickState }) => {
  const { isMobile } = useBreakpoints()
  const sharedDrivesQuery = buildSharedDrivesQuery()
  const { data } = useQuery(
    sharedDrivesQuery.definition,
    sharedDrivesQuery.options
  )

  const label = data?.length > 0 ? 'drives' : 'drive'

  return (
    <>
      <NavItem
        to="/folder"
        icon="folder"
        label={label}
        rx={/\/folder(\/.*)?/}
        clickState={clickState}
      />
      {!isMobile ? <SharedDrives /> : null}
    </>
  )
}

export { DrivesNavItem }
