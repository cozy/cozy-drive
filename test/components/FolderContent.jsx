import React, { useMemo } from 'react'
import { useQuery } from 'cozy-client'
import { buildQuery } from 'drive/web/modules/queries'

/** A simple component firing the same query as DriveView */
const Component = ({ folderId, sortOrder }) => {
  const folderQuery = useMemo(
    () =>
      buildQuery({
        currentFolderId: folderId,
        type: 'directory',
        sortAttribute: sortOrder.attribute,
        sortOrder: sortOrder.order
      }),
    [folderId, sortOrder]
  )
  const { data: folders } = useQuery(
    folderQuery.definition,
    folderQuery.options
  )
  return <div>{folders && folders.length}</div>
}

export default Component
