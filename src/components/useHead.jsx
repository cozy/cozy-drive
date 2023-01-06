import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import useUpdateDocumentFavicon from 'drive/web/modules/views/useUpdateDocumentFavicon'
import useUpdateDocumentTitle from 'drive/web/modules/views/useUpdateDocumentTitle'

const useHead = () => {
  const { folderId, fileId } = useParams()

  const isFileOpen = useMemo(() => fileId !== undefined, [fileId])

  useUpdateDocumentTitle(isFileOpen ? fileId : folderId)
  useUpdateDocumentFavicon(isFileOpen ? fileId : folderId)
}

export default useHead
