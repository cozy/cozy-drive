import React, { FC } from 'react'

import { NavDesktopDropdown } from 'cozy-ui/transpiled/react/Nav'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

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
      <NavDesktopDropdown label={t('Nav.item_shared_drives')}>
        {sharedDrives.map(sharedDrive => (
          <SharedDriveListItem
            key={sharedDrive._id}
            sharedDrive={sharedDrive}
            clickState={clickState}
          />
        ))}
      </NavDesktopDropdown>
    )
  }

  return null
}

export { SharedDriveList }
