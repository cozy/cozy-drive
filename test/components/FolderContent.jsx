import React, { useMemo } from 'react'
import { useQuery } from 'cozy-client'
import { buildDriveQuery } from 'drive/web/modules/queries'

/** A simple component firing the same queries as DriveView */
const Component = ({ folderId, sortOrder }) => {
  const fileQuery = useMemo(
    () =>
      buildDriveQuery({
        currentFolderId: folderId,
        type: 'file',
        sortAttribute: sortOrder.attribute,
        sortOrder: sortOrder.order
      }),
    [folderId, sortOrder]
  )
  const folderQuery = useMemo(
    () =>
      buildDriveQuery({
        currentFolderId: folderId,
        type: 'directory',
        sortAttribute: sortOrder.attribute,
        sortOrder: sortOrder.order
      }),
    [folderId, sortOrder]
  )
  const { data: files } = useQuery(fileQuery.definition, fileQuery.options)

  const { data: folders } = useQuery(
    folderQuery.definition,
    folderQuery.options
  )
  return (
    <div>
      {folders && folders.length} -{files && files.length}
    </div>
  )
}

export default Component
