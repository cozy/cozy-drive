import { useMemo } from 'react'

import { useQuery } from 'cozy-client'

import { useFolderSort } from 'modules/navigation/duck'
import { buildDriveQuery } from 'modules/queries'

interface File {
  _id: string
  path: string
  attributes: {
    name: string
  }
}

export const useExtraDrive = (): File[] | undefined => {
  const folderId = '3130bb7c264db92cf1955f62b600097a'
  const [sortOrder] = useFolderSort(folderId) as [
    { attribute: string; order: string }
  ]

  const buildedFilesQuery = buildDriveQuery({
    currentFolderId: folderId,
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })

  const filesQuery = useQuery(
    buildedFilesQuery.definition(),
    buildedFilesQuery.options
  ) as { data: File[] | undefined }

  const files = useMemo(() => {
    if (filesQuery.data?.length === 0) return undefined

    return filesQuery.data
  }, [filesQuery.data])

  return files
}
