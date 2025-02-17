import get from 'lodash/get'
import React from 'react'
import { useSelector } from 'react-redux'

import { isSharingShortcut } from 'cozy-client/dist/models/file'
import Box from 'cozy-ui/transpiled/react/Box'
import Filename from 'cozy-ui/transpiled/react/Filename'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import FileNameVz from './FileNameVz'

import styles from '@/styles/filelist.styl'

import AcceptingSharingContext from '@/lib/AcceptingSharingContext'
import { useThumbnailSizeContext } from '@/lib/ThumbnailSizeContext'
import RenameInput from '@/modules/drive/RenameInput'
import {
  isRenaming as isRenamingSelector,
  getRenamingFile
} from '@/modules/drive/rename'
import { getFileNameAndExtension } from '@/modules/filelist/helpers'
import FileThumbnail from '@/modules/filelist/icons/FileThumbnail'

const FullFileName = ({ file, refreshFolderContent }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const isRenaming = useSelector(
    (state, ownProps) =>
      isRenamingSelector(state) &&
      get(getRenamingFile(state), 'id') === ownProps.attributes.id
  )
  const { title, filename, extension } = getFileNameAndExtension(file, t)

  if (isRenaming) {
    return (
      <RenameInput file={file} refreshFolderContent={refreshFolderContent} />
    )
  }

  return (
    <div className="u-ml-half">
      <Filename
        variant="body1"
        filename={filename}
        extension={extension}
        midEllipsis
      />
    </div>
  )
}

const FileNameWithThumbnail = ({
  row,
  cell,
  withFilePath,
  isRowDisabledOrInSyncFromSharing,
  formattedSize,
  formattedUpdatedAt,
  isInSyncFromSharing,
  refreshFolderContent
}) => {
  const { isMobile } = useBreakpoints()
  // const { isBigThumbnail } = useThumbnailSizeContext()
  const isRenaming = useSelector(
    state =>
      isRenamingSelector(state) && get(getRenamingFile(state), 'id') === row.id
  )

  // return (
  //   <FileName
  //     attributes={row}
  //     isRenaming={isRenaming}
  //     interactive={!isRowDisabledOrInSyncFromSharing}
  //     withFilePath={withFilePath}
  //     isMobile={isMobile}
  //     formattedSize={formattedSize}
  //     formattedUpdatedAt={formattedUpdatedAt}
  //     refreshFolderContent={refreshFolderContent}
  //     isInSyncFromSharing={isInSyncFromSharing}
  //   />
  // )

  return (
    <>
      {/* <Box display="flex" alignItems="center" gridGap="0.5rem"> */}
      {/* <div className="u-flex u-flex-items-center">
        <div className="u-mr-half">
          <FileThumbnail
            file={row}
            size={isBigThumbnail ? 96 : 31}
            isInSyncFromSharing={isInSyncFromSharing}
            showSharedBadge={isMobile}
            componentsProps={{
              sharedBadge: {
                className: styles['fil-content-shared']
              }
            }}
          />
        </div> */}
      <FileNameVz
        attributes={row}
        isRenaming={isRenaming}
        interactive={!isRowDisabledOrInSyncFromSharing}
        withFilePath={withFilePath}
        isMobile={isMobile}
        formattedSize={formattedSize}
        formattedUpdatedAt={formattedUpdatedAt}
        refreshFolderContent={refreshFolderContent}
        isInSyncFromSharing={isInSyncFromSharing}
      />
      {/* <FullFileName
        file={row}
        isInSyncFromSharing={isInSyncFromSharing}
        refreshFolderContent={refreshFolderContent}
      /> */}
      {/* </div> */}
      {/* </Box> */}
    </>
  )
}

export default FileNameWithThumbnail
