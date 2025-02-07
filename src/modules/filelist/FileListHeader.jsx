import React from 'react'

import { FileListHeaderDesktop } from '@/modules/filelist/FileListHeaderDesktop'
import { FileListHeaderMobile } from '@/modules/filelist/FileListHeaderMobile'

/**
 * @typedef {Object} Props
 * @property {string|null} props.folderId - The ID of the folder.
 * @property {boolean} props.canSort - Indicates whether sorting is allowed.
 * @property {Sort} [props.sort] - The current sorting option.
 * @property {Function} [props.onFolderSort] - The function to handle folder sorting.
 * @property {boolean} [props.thumbnailSizeBig] - Indicates whether the thumbnail size is big.
 * @property {Function} [props.toggleThumbnailSize] - The function to toggle the thumbnail size.
 * @property {Array} [props.extraColumns] - An array of extra columns.
 */

/**
 * Renders the header component for the file list.
 * The responsive design is handled by CSS media queries.
 * @param {Props} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const FileListHeader = props => {
  return (
    <>
      <FileListHeaderDesktop {...props} />
      <FileListHeaderMobile {...props} />
    </>
  )
}

export { FileListHeader }
