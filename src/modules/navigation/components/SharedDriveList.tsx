import React, { FC } from 'react'

import List from 'cozy-ui/transpiled/react/List'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'

import { SharedDriveListItem } from '@/modules/navigation/components/SharedDriveListItem'

interface SharedDriveListProps {
  sharedDrives: any[]
  className?: string
  clickState: [string, (value: string | undefined) => void]
}

const SharedDriveList: FC<SharedDriveListProps> = ({
  sharedDrives,
  className,
  clickState
}) => {
  if (sharedDrives.length > 0) {
    return (
      <List
        subheader={<ListSubheader>Shared drive</ListSubheader>}
        className={className}
      >
        {sharedDrives.map(sharedDrive => (
          <SharedDriveListItem
            key={sharedDrive._id}
            sharedDrive={sharedDrive}
            clickState={clickState}
          />
        ))}
      </List>
    )
  }

  return null
}

export { SharedDriveList }
