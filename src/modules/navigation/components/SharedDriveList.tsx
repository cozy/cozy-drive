import React, { FC } from 'react'

import List from 'cozy-ui/transpiled/react/List'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { SideBarAccordion } from '@/components/SideBarAccordion.jsx'
import { SharedDriveListItem } from '@/modules/navigation/components/SharedDriveListItem'
import { SharedDrive } from '@/modules/shareddrives/helpers'

interface SharedDriveListProps {
  sharedDrives: SharedDrive[]
  className?: string
  clickState: [string, (value: string | undefined) => void]
}

const SharedDriveList: FC<SharedDriveListProps> = ({
  sharedDrives,
  clickState
}) => {
  const { t } = useI18n()
  if (sharedDrives.length > 0) {
    return (
      <SideBarAccordion
        title={t('Nav.item_shared_drives')}
        childrenCount={sharedDrives.length}
      >
        <List className="u-p-0">
          {sharedDrives.map(sharedDrive => (
            <SharedDriveListItem
              key={sharedDrive._id}
              sharedDrive={sharedDrive}
              clickState={clickState}
            />
          ))}
        </List>
      </SideBarAccordion>
    )
  }

  return null
}

export { SharedDriveList }
