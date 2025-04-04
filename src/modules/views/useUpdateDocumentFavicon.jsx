import { useEffect } from 'react'

import { useClient } from 'cozy-client'

import useDocument from '@/components/useDocument'
import { buildFileByIdQuery } from '@/queries'

const acceptedTypes = [
  'text',
  'sheet',
  'slide',
  'image',
  'pdf',
  'video',
  'audio',
  'zip',
  'code',
  'bin'
]

const defaultFaviconHref = '/public/app-icon.svg'

const normalizeClass = docClass => {
  if (docClass === 'spreadsheet') {
    return 'sheet'
  }
  return docClass
}

const makeFaviconHref = docClass => {
  const type = normalizeClass(docClass)
  return `/assets/icons/icon-type-${
    acceptedTypes.includes(type) ? type : 'files'
  }.svg`
}

const useUpdateDocumentFavicon = docId => {
  const client = useClient()
  const doc = useDocument('io.cozy.files', docId)

  useEffect(() => {
    const fetchDocumentIfNotStore = async () => {
      if (docId && !doc) {
        const query = buildFileByIdQuery(docId)
        await client.query(query.definition(), {
          ...query.options,
          enabled: !doc
        })
      }

      const link = document.querySelector("link[rel~='icon']")

      const href =
        doc && doc.type === 'file'
          ? makeFaviconHref(doc.class)
          : defaultFaviconHref
      link.href = href
    }
    fetchDocumentIfNotStore()
  }, [client, docId, doc])
}

export default useUpdateDocumentFavicon
