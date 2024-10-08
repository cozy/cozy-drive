import React, { ReactNode } from 'react'

import ListItemSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListItemSkeleton'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { EmptyDrive } from 'components/Error/Empty'
import Oops from 'components/Error/Oops'

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
  const { isMobile } = useBreakpoints()
  const gutters = isMobile ? 'default' : 'double'

  if (fetchStatus === 'loading')
    return (
      <>
        {Array.from({ length: 8 }, (_, index) => (
          <ListItemSkeleton
            key={`key_file_placeholder_${index}`}
            gutters={gutters}
            hasSecondary
            divider={index !== 7}
          />
        ))}
      </>
    )
  else if (fetchStatus === 'failed') return <Oops />
  else if (fetchStatus === 'loaded' && hasNoData)
    return <EmptyDrive canUpload={false} />
  else return <>{children}</>
}

export { FolderPickerContentLoader }
