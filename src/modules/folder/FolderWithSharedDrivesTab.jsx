import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { ROOT_DIR_ID } from 'constants/config'
import { FolderTab } from 'modules/views/Folder/FolderTab'
import { FolderTabs } from 'modules/views/Folder/FolderTabs'
import { SharedDrives } from 'modules/views/Folder/SharedDrives'

const FolderWithSharedDrivesTab = ({ folderId, children, canSort }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isMobile } = useBreakpoints()
  const currentTab = useMemo(() => {
    if (searchParams.get('tab') === 'shared_drives') {
      return 1
    }
    return 0
  }, [searchParams])

  const handleChange = (_event, newValue) => {
    if (newValue === 1) {
      searchParams.set('tab', 'shared_drives')
    } else {
      searchParams.delete('tab')
    }
    setSearchParams(searchParams)
  }

  if (folderId === ROOT_DIR_ID && isMobile) {
    return (
      <>
        <FolderTabs handleChange={handleChange} value={currentTab} />
        <FolderTab value={currentTab} index={0}>
          {children}
        </FolderTab>
        <FolderTab value={currentTab} index={1}>
          <SharedDrives canSort={canSort} />
        </FolderTab>
      </>
    )
  }

  return children
}

export { FolderWithSharedDrivesTab }
