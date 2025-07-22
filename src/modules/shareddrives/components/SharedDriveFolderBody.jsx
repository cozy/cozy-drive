import React from 'react'

import { FolderBody } from '@/modules/folder/components/FolderBody'

const SharedDriveFolderBody = ({ folderId, queryResults }) => {
  return (
    <FolderBody
      folderId={folderId}
      queryResults={queryResults}
      actions={[]}
      withFilePath={false}
    />
  )
}

export { SharedDriveFolderBody }
