import React, { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

import { useClient, hasQueryBeenLoaded, useQuery } from 'cozy-client'
import flag from 'cozy-flags'
import {
  useSharingContext,
  useNativeFileSharing,
  shareNative
} from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import SharingTab from './SharingTab'
import withSharedDocumentIds from './withSharedDocumentIds'
import FolderView from '../Folder/FolderView'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBodyVz from '../Folder/virtualized/FolderViewBody'

import useHead from '@/components/useHead'
import {
  SHARED_DRIVES_DIR_ID,
  SHARING_TAB_ALL,
  SHARING_TAB_DRIVES
} from '@/constants/config'
import { useModalContext } from '@/lib/ModalContext'
import {
  download,
  rename,
  infos,
  versions,
  share,
  hr,
  selectAllItems
} from '@/modules/actions'
import { addToFavorites } from '@/modules/actions/components/addToFavorites'
import { moveTo } from '@/modules/actions/components/moveTo'
import { removeFromFavorites } from '@/modules/actions/components/removeFromFavorites'
import { MobileAwareBreadcrumb as Breadcrumb } from '@/modules/breadcrumb/components/MobileAwareBreadcrumb'
import { makeExtraColumnsNamesFromMedia } from '@/modules/certifications'
import { useExtraColumns } from '@/modules/certifications/useExtraColumns'
import AddMenuProvider from '@/modules/drive/AddMenu/AddMenuProvider'
import FabWithAddMenuContext from '@/modules/drive/FabWithAddMenuContext'
import Toolbar from '@/modules/drive/Toolbar'
import FileListRowsPlaceholder from '@/modules/filelist/FileListRowsPlaceholder'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import { deleteSharedDrive } from '@/modules/shareddrives/components/actions/deleteSharedDrive'
import { leaveSharedDrive } from '@/modules/shareddrives/components/actions/leaveSharedDrive'
import { manageAccess } from '@/modules/shareddrives/components/actions/manageAccess'
import { useSharedDrives } from '@/modules/shareddrives/hooks/useSharedDrives'
import {
  buildSharingsQuery,
  buildSharingsWithMetadataAttributeQuery
} from '@/queries'
const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

export const SharingsView = ({ sharedDocumentIds = [] }) => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const tabParam = Number(searchParams.get('tab')) || SHARING_TAB_ALL
  const { t, lang } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()
  const { pushModal, popModal } = useModalContext()
  const { isSelectionBarVisible, toggleSelectAllItems, isSelectAll } =
    useSelectionContext()
  const { allLoaded, refresh, isOwner } = useSharingContext()
  const { isNativeFileSharingAvailable, shareFilesNative } =
    useNativeFileSharing()
  const { sharedDrives } = useSharedDrives()
  const dispatch = useDispatch()
  useHead()
  const { showAlert } = useAlert()

  const [tab, setTab] = useState(tabParam)

  const extraColumnsNames = makeExtraColumnsNamesFromMedia({
    isMobile,
    desktopExtraColumnsNames,
    mobileExtraColumnsNames
  })

  const extraColumns = useExtraColumns({
    columnsNames: extraColumnsNames,
    queryBuilder: buildSharingsWithMetadataAttributeQuery,
    sharedDocumentIds
  })

  const query = useMemo(
    () => buildSharingsQuery({ ids: sharedDocumentIds, enabled: allLoaded }),
    [sharedDocumentIds, allLoaded]
  )
  const result = useQuery(query.definition, query.options)

  const filteredResult = useMemo(() => {
    /**
     * Problem:
     * - In the recipient's Sharing section, shared drives appear only as shortcuts
     *   and don’t contain a root folder id (the folder id in the owner's shared drive).
     *
     * Why:
     * - To open a shared drive, we need a URL like `shareddrive/:driveId/:rootFolderId`.
     * - This information exists in `io.cozy.sharings`, which includes root folder id,
     *   but the structure is not compatible with the directory format expected
     *   in the Sharing UI.
     *
     * Solution:
     * - Transform `sharedDrives` into directory-like objects with the required
     *   properties (`id`, `path`, `attributes`,...) so they can be displayed
     *   and opened consistently.
     */
    const transformedSharedDrives = (sharedDrives || []).map(sharing => {
      const [rootFolderId, driveName] = [
        sharing.rules?.[0]?.values?.[0],
        sharing.rules?.[0]?.title
      ]

      // Find the file from sharing section that has same `driveId` then override it into directory-like objects
      const fileInSharingSection = result.data?.find(
        item => item.relationships?.referenced_by?.data?.[0]?.id === sharing.id
      )

      if (fileInSharingSection && isOwner(fileInSharingSection?.id))
        return fileInSharingSection

      const directoryData = {
        type: 'directory',
        name: driveName,
        dir_id: SHARED_DRIVES_DIR_ID,
        driveId: sharing.id
      }

      return {
        ...fileInSharingSection,
        _id: rootFolderId,
        id: SHARED_DRIVES_DIR_ID,
        _type: 'io.cozy.files',
        path: `/Drives/${driveName}`,
        ...directoryData,
        attributes: directoryData
      }
    })

    /**
     * Exclude shared drives from the original result,
     * since it will be replaced with transformed ones above.
     */
    const filteredResultData =
      result.data?.filter(item => !(item.dir_id === SHARED_DRIVES_DIR_ID)) || []

    const combinedData =
      tab === SHARING_TAB_DRIVES
        ? transformedSharedDrives
        : [...transformedSharedDrives, ...filteredResultData]

    return {
      ...result,
      data: combinedData,
      count: combinedData.length
    }
  }, [sharedDrives, result, tab, isOwner])

  const actionsOptions = {
    client,
    t,
    lang,
    pushModal,
    popModal,
    refresh,
    dispatch,
    navigate,
    pathname,
    hasWriteAccess: true,
    canMove: true,
    isPublic: false,
    allLoaded,
    showAlert,
    isMobile,
    isNativeFileSharingAvailable,
    shareFilesNative,
    selectAll: () => toggleSelectAllItems(result.data),
    isSelectAll
  }

  const actions = makeActions(
    [
      selectAllItems,
      share,
      shareNative,
      download,
      hr,
      rename,
      moveTo,
      addToFavorites,
      removeFromFavorites,
      infos,
      hr,
      versions,
      manageAccess,
      hr,
      deleteSharedDrive,
      leaveSharedDrive
    ],
    actionsOptions
  )

  return (
    <FolderView>
      <Content className={isMobile ? '' : 'u-pt-1'}>
        <FolderViewHeader>
          <Breadcrumb path={[{ name: t('breadcrumb.title_sharings') }]} />
          <Toolbar canUpload={false} canCreateFolder={false} />
        </FolderViewHeader>
        <SharingTab tab={tab} setTab={setTab} />
        {!allLoaded || !hasQueryBeenLoaded(result) ? (
          <FileListRowsPlaceholder />
        ) : (
          <>
            {flag('drive.virtualization.enabled') && !isMobile ? (
              <FolderViewBodyVz
                actions={actions}
                queryResults={[filteredResult]}
                withFilePath={true}
                extraColumns={extraColumns}
              />
            ) : (
              <FolderViewBody
                actions={actions}
                queryResults={[filteredResult]}
                canSort={false}
                withFilePath={true}
                extraColumns={extraColumns}
              />
            )}
            <Outlet />
          </>
        )}
        {isMobile && (
          <AddMenuProvider
            canCreateFolder={true}
            canUpload={true}
            disabled={false}
            displayedFolder={null}
            isSelectionBarVisible={isSelectionBarVisible}
            isPublic={false}
            refreshFolderContent={() => {}}
          >
            <FabWithAddMenuContext noSidebar={false} />
          </AddMenuProvider>
        )}
      </Content>
    </FolderView>
  )
}

export default withSharedDocumentIds(SharingsView)
