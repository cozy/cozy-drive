import React from 'react'

import Tab from 'cozy-ui/transpiled/react/Tab'
import Tabs from 'cozy-ui/transpiled/react/Tabs'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useExtraDrive } from 'modules/views/Folder/hooks/useExtraDrive'

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
  const files = useExtraDrive()

  if (!files || files.length === 0) return null

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
          label={t('Nav.item_external_drives')}
          id="cozy-tab-1"
          aria-controls="cozy-tabpanel-1"
        />
      </Tabs>
    </>
  )
}
