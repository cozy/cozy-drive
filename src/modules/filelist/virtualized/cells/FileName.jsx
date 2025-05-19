import React from 'react'
import { Link } from 'react-router-dom'

import { isDirectory } from 'cozy-client/dist/models/file'
import Filename from 'cozy-ui/transpiled/react/Filename'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '@/styles/filelist.styl'

import { useThumbnailSizeContext } from '@/lib/ThumbnailSizeContext'
import RenameInput from '@/modules/drive/RenameInput'
import CertificationsIcons from '@/modules/filelist/cells/CertificationsIcons.jsx'
import { getFileNameAndExtension } from '@/modules/filelist/helpers'
import FileThumbnail from '@/modules/filelist/icons/FileThumbnail'

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
          withFilePath ? (
            attributes.displayedPath &&
            (isMobile ? (
              <div
                className={styles['fil-file-description']}
                title={filename + extension}
              >
                <MidEllipsis
                  className={styles['fil-file-description--path']}
                  text={attributes.displayedPath}
                />
                <CertificationsIcons attributes={attributes} />
              </div>
            ) : (
              <Link
                to={`/folder/${attributes.dir_id}`}
                // Please do not modify the className as it is used in event handling, see FileOpener#46
                className={styles['fil-file-path']}
              >
                <MidEllipsis text={attributes.displayedPath} />
              </Link>
            ))
          ) : !isDirectory(attributes) && isMobile ? (
            <div className={styles['fil-file-infos']}>
              {`${formattedUpdatedAt}${
                formattedSize ? ` - ${formattedSize}` : ''
              }`}
              <CertificationsIcons attributes={attributes} />
            </div>
          ) : undefined
        }
      />
    </span>
  )
}

export default FileName
