import { filesize } from 'filesize'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { isSharingShortcut } from 'cozy-client/dist/models/file'
import { useVaultClient } from 'cozy-keys-lib'
import Box from 'cozy-ui/transpiled/react/Box'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileTypeFolderIcon from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import VirtuosoTable from 'cozy-ui/transpiled/react/Table/Virtuoso/Virtuoso'
import TableCell from 'cozy-ui/transpiled/react/TableCell'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { columns, secondarySort } from './helpers'
import { useSyncingFakeFile } from './useSyncingFakeFile'

import styles from '@/styles/filelist.styl'

import { EmptyDrive, EmptyTrash } from '@/components/Error/Empty'
import Oops from '@/components/Error/Oops'
import { TRASH_DIR_ID } from '@/constants/config'
import AcceptingSharingContext from '@/lib/AcceptingSharingContext'
import { useThumbnailSizeContext } from '@/lib/ThumbnailSizeContext'
import { isEncryptedFolder } from '@/lib/encryption'
import AddFolder from '@/modules/filelist/AddFolder'
import { FileWithSelection as File } from '@/modules/filelist/File'
import { FileList } from '@/modules/filelist/FileList'
import FileListBody from '@/modules/filelist/FileListBody'
import { FileListHeader } from '@/modules/filelist/FileListHeader'
import FileListRowsPlaceholder from '@/modules/filelist/FileListRowsPlaceholder'
import LoadMore from '@/modules/filelist/LoadMoreV2'
import CellComp from '@/modules/filelist/cells/CellComp'
import FileThumbnail from '@/modules/filelist/icons/FileThumbnail'
import { FolderUnlocker } from '@/modules/folder/components/FolderUnlocker'
import { useFolderSort } from '@/modules/navigation/duck'
import SelectionBar from '@/modules/selection/SelectionBar'
import { isReferencedByShareInSharingContext } from '@/modules/views/Folder/syncHelpers'

const FolderViewBody = ({
  currentFolderId,
  displayedFolder,
  queryResults,
  actions,
  canSort,
  canUpload = true,
  withFilePath = false,
  refreshFolderContent = null,
  extraColumns,
  canInteractWith
}) => {
  const { isDesktop } = useBreakpoints()
  const navigate = useNavigate()

  /**
   *  Since we are not able to restore the scroll correctly,
   * and force the scroll to top every time we change the
   * current folder. This is to avoid this kind of weird
   * behavior:
   * - If I go to a sub-folder, if this subfolder has a lot
   * of data and I scrolled down until the bottom. If I go
   * back, then my folder will also be scrolled down.
   *
   * This is an ugly hack, yeah.
   * */
  useEffect(() => {
    if (isDesktop) {
      const scrollable = document.querySelectorAll(
        '[data-testid=fil-content-body]'
      )[0]
      if (scrollable) {
        scrollable.scroll({ top: 0 })
      }
    } else {
      window.scroll({ top: 0 })
    }
  }, [currentFolderId, isDesktop])

  const { isBigThumbnail, toggleThumbnailSize } = useThumbnailSizeContext()
  const { sharingsValue } = useContext(AcceptingSharingContext)
  const [sortOrder, setSortOrder] = useFolderSort(currentFolderId)
  const vaultClient = useVaultClient()
  const changeSortOrder = useCallback(
    (folderId_legacy, attribute, order) => setSortOrder({ attribute, order }),
    [setSortOrder]
  )

  const isInError = queryResults.some(query => query.fetchStatus === 'failed')
  const hasDataToShow =
    !isInError &&
    queryResults.some(query => query.data && query.data.length > 0)
  const isLoading =
    !hasDataToShow &&
    queryResults.some(
      query => query.fetchStatus === 'loading' && !query.lastUpdate
    )
  const isEmpty = !isInError && !isLoading && !hasDataToShow
  const isSharingContextEmpty = Object.keys(sharingsValue).length <= 0

  const { syncingFakeFile } = useSyncingFakeFile({ isEmpty, queryResults })
  const isEncFolder = isEncryptedFolder(displayedFolder)

  /**
   * When we mount the component when we already have data in cache,
   * the mount is time consuming since we'll render at least 100 lines
   * of File.
   *
   * React seems to batch together the fact that :
   * - we change a route
   * - we want to render 100 files
   * resulting in a non smooth transition between views (Drive / Recent / ...)
   *
   * In order to bypass this batch, we use a state to first display a much
   * more simpler component and then the files
   */
  const [needsToWait, setNeedsToWait] = useState(true)
  useEffect(() => {
    let timeout = null
    if (!isLoading) {
      timeout = setTimeout(() => {
        setNeedsToWait(false)
      }, 50)
    }
    return () => clearTimeout(timeout)
  }, [isLoading])

  const handleFolderUnlockerDismiss = useCallback(() => {
    navigate('/folder')
  }, [navigate])

  const rows = queryResults.flatMap(el => el.data)
  // console.info(' ')
  // console.info('queryResults :', queryResults)
  // console.info('rows :', rows)
  // console.info(' ')

  if (needsToWait || isLoading || !hasDataToShow) return null

  return (
    <FolderUnlocker
      folder={displayedFolder}
      onDismiss={handleFolderUnlockerDismiss}
    >
      <SelectionBar actions={actions} />
      <div
        style={{
          height: 400,
          width: '100%'
        }}
      >
        <VirtuosoTable
          rows={rows}
          columns={columns}
          defaultOrder={columns[0].id}
          secondarySort={secondarySort}
          componentsProps={{
            rowContent: {
              children: (
                <CellComp
                  withFilePath={withFilePath}
                  refreshFolderContent={refreshFolderContent}
                  canInteractWith={canInteractWith}
                  actions={actions}
                />
              )
            }
          }}
        />
      </div>
    </FolderUnlocker>
  )
}

export default FolderViewBody
