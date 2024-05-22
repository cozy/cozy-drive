import React from 'react'

import { useQuery } from 'cozy-client'
import Tab from 'cozy-ui/transpiled/react/Tab'
import Tabs from 'cozy-ui/transpiled/react/Tabs'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { buildSharedDrivesQuery } from 'modules/views/Folder/queries/fetchSharedDrives'
import { UseSharedDrivesQuery } from 'modules/views/Folder/types'

interface FolderTabsProps {
  handleChange: (event: React.ChangeEvent<object>, newValue: number) => void
  value: number
}

export const FolderTabs = ({
  handleChange,
  value
}: FolderTabsProps): JSX.Element | null => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const sharedDrivesQuery = buildSharedDrivesQuery({
    sortAttribute: 'name',
    sortOrder: 'asc'
  })
  const { data } = useQuery(
    sharedDrivesQuery.definition,
    sharedDrivesQuery.options
  ) as UseSharedDrivesQuery

  if (!data || data.length === 0) return null

  if (!isMobile) return null

  return (
    <>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={value}
        aria-label="cozy tabs"
        variant="standard"
        onChange={handleChange}
        disabled={!isMobile}
      >
        <Tab
          label={t('Nav.item_drive')}
          id="cozy-tab-0"
          aria-controls="cozy-tabpanel-0"
        />
        <Tab
          label={t('Nav.item_shared_drives')}
          id="cozy-tab-1"
          aria-controls="cozy-tabpanel-1"
        />
      </Tabs>
    </>
  )
}
