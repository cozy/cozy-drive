import React from 'react'

import Filename from 'cozy-ui/transpiled/react/Filename'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '@/styles/filelist.styl'

import { useThumbnailSizeContext } from '@/lib/ThumbnailSizeContext'
import RenameInput from '@/modules/drive/RenameInput'
import { getFileNameAndExtension } from '@/modules/filelist/helpers'
import FileThumbnail from '@/modules/filelist/icons/FileThumbnail'
import FileNamePath from '@/modules/filelist/virtualized/cells/FileNamePath'

const FileName = ({
  attributes,
  isRenaming,
  withFilePath,
  formattedSize,
  formattedUpdatedAt,
  refreshFolderContent,
  isInSyncFromSharing
}) => {
  const { t } = useI18n()
  const { title, filename, extension } = getFileNameAndExtension(attributes, t)
  const { isBigThumbnail } = useThumbnailSizeContext()
  const { isMobile } = useBreakpoints()

  if (isRenaming) {
    return (
      <div className="u-flex">
        <div className="u-mr-half">
          <FileThumbnail
            file={attributes}
            size={isBigThumbnail ? 96 : 32}
            isInSyncFromSharing={isInSyncFromSharing}
            showSharedBadge={isMobile}
            componentsProps={{
              sharedBadge: {
                className: styles['fil-content-shared-vz']
              }
            }}
          />
        </div>
        <RenameInput
          style={{ display: 'flex' }}
          className="u-flex-items-center"
          file={attributes}
          refreshFolderContent={refreshFolderContent}
        />
      </div>
    )
  }

  return (
    <span title={title}>
      <Filename
        icon={
          <FileThumbnail
            file={attributes}
            size={isBigThumbnail ? 96 : 32}
            isInSyncFromSharing={isInSyncFromSharing}
            showSharedBadge={isMobile}
            componentsProps={{
              sharedBadge: {
                className: styles['fil-content-shared-vz']
              }
            }}
          />
        }
        variant="body1"
        filename={filename}
        extension={extension}
        midEllipsis
        path={
          <FileNamePath
            attributes={attributes}
            withFilePath={withFilePath}
            formattedSize={formattedSize}
            formattedUpdatedAt={formattedUpdatedAt}
          />
        }
      />
    </span>
  )
}

export default FileName
