import React from 'react'
import { Link } from 'react-router-dom'

import { isDirectory } from 'cozy-client/dist/models/file'
import Filename from 'cozy-ui/transpiled/react/Filename'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import CertificationsIcons from './CertificationsIcons'

import styles from '@/styles/filelist.styl'

import { useThumbnailSizeContext } from '@/lib/ThumbnailSizeContext'
import RenameInput from '@/modules/drive/RenameInput'
import { getFileNameAndExtension } from '@/modules/filelist/helpers'
import FileThumbnail from '@/modules/filelist/icons/FileThumbnail'

const FileNameVz = ({
  attributes,
  isRenaming,
  interactive,
  withFilePath,
  // isMobile,
  formattedSize,
  formattedUpdatedAt,
  refreshFolderContent,
  isInSyncFromSharing
}) => {
  const { t } = useI18n()
  const { filename, extension } = getFileNameAndExtension(attributes, t)
  const { isBigThumbnail } = useThumbnailSizeContext()
  const { isMobile } = useBreakpoints()

  if (isRenaming) {
    return (
      <div className="u-flex">
        <div className="u-mr-half">
          <FileThumbnail
            file={attributes}
            size={isBigThumbnail ? 96 : 31}
            isInSyncFromSharing={isInSyncFromSharing}
            showSharedBadge={isMobile}
            componentsProps={{
              sharedBadge: {
                className: styles['fil-content-shared']
              }
            }}
          />
        </div>
        <RenameInput
          file={attributes}
          refreshFolderContent={refreshFolderContent}
        />
      </div>
    )
  }

  // return (
  //   <>
  //     {filename}
  //     {/* {extension && (
  //       <span className={styles['fil-content-ext']}>{extension}</span>
  //     )} */}
  //   </>
  // )

  return (
    <>
      {/* <div className={styles['fil-file']}>
       <div className={styles['fil-file-filename']}>
         <div className={styles['fil-file-filename-wrapper']}>
           <div
             data-testid="fil-file-filename-and-ext"
             className={styles['fil-file-filename-and-ext']}
           >
             {filename}
             {extension && (
               <span className={styles['fil-content-ext']}>{extension}</span>
             )}
           </div>
         </div>
       </div> */}
      {/* {filename}
      {extension && (
        <span className={styles['fil-content-ext']}>{extension}</span>
      )} */}
      <Filename
        icon={
          <FileThumbnail
            file={attributes}
            size={isBigThumbnail ? 96 : 31}
            isInSyncFromSharing={isInSyncFromSharing}
            showSharedBadge={isMobile}
            componentsProps={{
              sharedBadge: {
                className: styles['fil-content-shared']
              }
            }}
          />
        }
        variant="body1"
        filename={filename}
        extension={extension}
        midEllipsis
        path={
          withFilePath &&
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
        }
      />
      {/* {withFilePath &&
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
        ))} */}
      {!withFilePath &&
        (isDirectory(attributes) || (
          <div className={styles['fil-file-infos']}>
            {`${formattedUpdatedAt}${
              formattedSize ? ` - ${formattedSize}` : ''
            }`}
            {isMobile && <CertificationsIcons attributes={attributes} />}
          </div>
        ))}
      {/* </div> */}
    </>
  )
}

export default FileNameVz
