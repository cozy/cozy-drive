import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { RemoveScroll } from 'react-remove-scroll'

import { Q, useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'
import { isIOSApp } from 'cozy-device-helper'
import logger from 'lib/logger'
import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import palette from 'cozy-ui/transpiled/react/palette'

import useUpdateDocumentTitle from 'drive/web/modules/views/useUpdateDocumentTitle'
import { useRouter } from 'drive/lib/RouterContext'
import Fallback from 'drive/web/modules/viewer/Fallback'
import {
  isOnlyOfficeEnabled,
  makeOnlyOfficeFileRoute
} from 'drive/web/modules/views/OnlyOffice/helpers'

import {
  isEncryptedFile,
  getEncryptionKeyFromDirId,
  getDecryptedFileURL
} from 'drive/lib/encryption'

export const FilesViewerLoading = () => (
  <Overlay>
    <Spinner size="xxlarge" middle noMargin color={palette.white} />
  </Overlay>
)

const styleStatusBar = switcher => {
  if (window.StatusBar && isIOSApp()) {
    if (switcher) {
      window.StatusBar.backgroundColorByHexString('#32363F')
      window.StatusBar.styleLightContent()
    } else {
      window.StatusBar.backgroundColorByHexString('#FFFFFF')
      window.StatusBar.styleDefault()
    }
  }
}

/**
 * Shows a set of files through cozy-ui's Viewer
 *
 * - Re-uses the cozy-client's Query for the current directory files
 *   with the same sort order.
 * - If the file to show is not present in the query results, will call
 *   fetchMore() on the query
 */

const FilesViewer = ({ filesQuery, files, fileId, onClose, onChange }) => {
  useUpdateDocumentTitle(fileId)
  const [currentFile, setCurrentFile] = useState(null)
  const [currentDecryptedFileURL, setCurrentDecryptedFileURL] = useState(null)
  const [fetchingMore, setFetchingMore] = useState(false)

  const client = useClient()
  const { t } = useI18n()
  const { router } = useRouter()
  const vaultClient = useVaultClient()

  const handleOnClose = useCallback(() => {
    if (onClose) {
      onClose()
    }
  }, [onClose])

  const handleOnChange = useCallback(
    nextFile => {
      if (onChange) {
        onChange(nextFile.id)
      }
    },
    [onChange]
  )

  const getCurrentIndex = useCallback(
    () => files.findIndex(f => f.id === fileId),
    [files, fileId]
  )

  const currentIndex = useMemo(() => getCurrentIndex(), [getCurrentIndex])
  const hasCurrentIndex = useMemo(() => currentIndex != -1, [currentIndex])
  const viewerFiles = useMemo(
    () => (hasCurrentIndex ? files : [currentFile]),
    [hasCurrentIndex, files, currentFile]
  )

  useEffect(() => {
    styleStatusBar(true)

    return () => {
      styleStatusBar(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    // If we can't find the file in the loaded files, that's probably because the user
    // is trying to open a direct link to a file that wasn't in the first 50 files of
    // the containing folder (it comes from a fetchMore...) ; we load the file attributes
    // directly as a contingency measure
    const fetchFileIfNecessary = async () => {
      if (getCurrentIndex() !== -1) return
      if (currentFile && isMounted) {
        setCurrentFile(null)
      }

      try {
        const { data } = await client.query(Q('io.cozy.files').getById(fileId))
        isMounted && setCurrentFile(data)
      } catch (e) {
        logger.warn("can't find the file")
        handleOnClose()
      }
    }

    fetchFileIfNecessary()

    return () => {
      isMounted = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const getDecryptedURLIfNecessary = async () => {
      const file = files[currentIndex]
      if (file && isEncryptedFile(file)) {
        const decryptionKey = await getEncryptionKeyFromDirId(
          client,
          file.dir_id
        )
        const url = await getDecryptedFileURL(client, vaultClient, {
          file,
          decryptionKey
        })
        setCurrentDecryptedFileURL(url)
      }
    }
    getDecryptedURLIfNecessary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  useEffect(() => {
    let isMounted = true

    // If we get close of the last file fetched, but we know there are more in the folder
    // (it shouldn't happen in /recent), we fetch more files
    const fetchMoreIfNecessary = async () => {
      if (fetchingMore) {
        return
      }

      setFetchingMore(true)
      try {
        const fileCount = filesQuery.count

        const currentIndex = files.findIndex(f => f.id === fileId)
        if (
          files.length !== fileCount &&
          files.length - currentIndex <= 5 &&
          isMounted
        ) {
          await filesQuery.fetchMore()
        }
      } finally {
        setFetchingMore(false)
      }
    }

    fetchMoreIfNecessary()

    return () => {
      isMounted = false
    }
  }, [fetchingMore, filesQuery, files, fileId])

  const viewerIndex = useMemo(
    () => (hasCurrentIndex ? currentIndex : 0),
    [hasCurrentIndex, currentIndex]
  )

  // If we can't find the file, we fallback to the (potentially loading)
  // direct stat made by the viewer
  if (currentIndex === -1 && !currentFile) {
    return <FilesViewerLoading />
  }

  return (
    <RemoveScroll>
      <Overlay>
        <Viewer
          files={viewerFiles}
          currentURL={currentDecryptedFileURL}
          currentIndex={viewerIndex}
          onChangeRequest={handleOnChange}
          onCloseRequest={handleOnClose}
          renderFallbackExtraContent={file => <Fallback file={file} t={t} />}
          onlyOfficeProps={{
            isEnabled: isOnlyOfficeEnabled(),
            opener: file => router.push(makeOnlyOfficeFileRoute(file, true))
          }}
        />
      </Overlay>
    </RemoveScroll>
  )
}

export default React.memo(FilesViewer)
