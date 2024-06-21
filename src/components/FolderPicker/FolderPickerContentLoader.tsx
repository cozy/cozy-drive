import React, { ReactNode } from 'react'

import { EmptyDrive } from 'components/Error/Empty'
import Oops from 'components/Error/Oops'
import FileListRowsPlaceholder from 'modules/filelist/FileListRowsPlaceholder'

interface FolderPickerContentLoaderProps {
  fetchStatus: string
  hasNoData?: boolean
  children: ReactNode
}

const FolderPickerContentLoader: React.FC<FolderPickerContentLoaderProps> = ({
  fetchStatus,
  hasNoData,
  children
}) => {
  if (fetchStatus === 'loading') return <FileListRowsPlaceholder />
  else if (fetchStatus === 'failed') return <Oops />
  else if (fetchStatus === 'loaded' && hasNoData)
    return <EmptyDrive canUpload={false} />
  else return <>{children}</>
}

export { FolderPickerContentLoader }
