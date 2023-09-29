import { useEffect, useState, useMemo } from 'react'

import { CozyFile } from 'cozy-doctypes'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import logger from 'lib/logger'
import {
  makeExtByClass,
  makeMimeByClass
} from 'drive/web/modules/views/OnlyOffice/helpers'

const useCreateFile = (folderId, fileClass) => {
  const [status, setStatus] = useState('pending')
  const [fileId, setFileId] = useState(null)
  const { t } = useI18n()

  const fileExt = useMemo(() => makeExtByClass(fileClass), [fileClass])
  const fileMime = useMemo(() => makeMimeByClass(fileClass), [fileClass])
  const fileUrl = useMemo(
    () => `/onlyOffice/${fileClass}.${fileExt}`,
    [fileClass, fileExt]
  )
  const fileName = useMemo(
    () => t(`OnlyOffice.createFileName.${fileClass}`) + `.${fileExt}`,
    [t, fileClass, fileExt]
  )

  useEffect(() => {
    const doCreate = async () => {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const { data: createdFile } =
            await CozyFile.uploadFileWithConflictStrategy(
              fileName,
              reader.result,
              folderId,
              'rename',
              null,
              fileMime
            )
          setStatus('loaded')
          setFileId(createdFile.id)
        } catch (error) {
          logger.error(`Creating Only Office file failed: ${error}`)
          setStatus('error')
        }
      }

      try {
        const res = await fetch(fileUrl)
        const data = await res.blob()
        reader.readAsArrayBuffer(data)
      } catch (error) {
        logger.error(`Fetching Only Office template file failed: ${error}`)
        setStatus('error')
      }
    }

    doCreate()
  }, [fileClass, fileUrl, folderId, fileMime, fileName])

  return { status, fileId }
}

export default useCreateFile
