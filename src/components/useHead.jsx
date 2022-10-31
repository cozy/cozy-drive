import useUpdateDocumentFavicon from 'drive/web/modules/views/useUpdateDocumentFavicon'
import useUpdateDocumentTitle from 'drive/web/modules/views/useUpdateDocumentTitle'
import { useMemo } from 'react'

const useHead = params => {
  const { folderId, fileId } = params

  const isFileOpen = useMemo(() => fileId !== undefined, [fileId])

  useUpdateDocumentTitle(isFileOpen ? fileId : folderId)
  useUpdateDocumentFavicon(isFileOpen ? fileId : folderId)
}

export default useHead
