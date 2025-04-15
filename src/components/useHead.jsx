import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import useUpdateDocumentTitle from '@/modules/views/useUpdateDocumentTitle'

const useHead = () => {
  const { folderId, fileId } = useParams()

  const isFileOpen = useMemo(() => fileId !== undefined, [fileId])

  useUpdateDocumentTitle(isFileOpen ? fileId : folderId)
}

export default useHead
