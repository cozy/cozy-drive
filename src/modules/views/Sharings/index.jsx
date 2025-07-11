import React, { useMemo } from 'react'
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

import withSharedDocumentIds from './withSharedDocumentIds'
import FolderView from '../Folder/FolderView'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBodyVz from '../Folder/virtualized/FolderViewBody'

import useHead from '@/components/useHead'
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
import { removeFromFavorites } from '@/modules/actions/components/removeFromFavorites'
import { MobileAwareBreadcrumb as Breadcrumb } from '@/modules/breadcrumb/components/MobileAwareBreadcrumb'
import { makeExtraColumnsNamesFromMedia } from '@/modules/certifications'
import { useExtraColumns } from '@/modules/certifications/useExtraColumns'
import AddMenuProvider from '@/modules/drive/AddMenu/AddMenuProvider'
import FabWithAddMenuContext from '@/modules/drive/FabWithAddMenuContext'
import Toolbar from '@/modules/drive/Toolbar'
import FileListRowsPlaceholder from '@/modules/filelist/FileListRowsPlaceholder'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import {
  buildSharingsQuery,
  buildSharingsWithMetadataAttributeQuery
} from '@/queries'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

export const SharingsView = ({ sharedDocumentIds = [] }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t, lang } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()
  const { pushModal, popModal } = useModalContext()
  const { isSelectionBarVisible, toggleSelectAllItems, isSelectAll } =
    useSelectionContext()
  const { allLoaded, refresh } = useSharingContext()
  const { isNativeFileSharingAvailable, shareFilesNative } =
    useNativeFileSharing()
  const dispatch = useDispatch()
  useHead()
  const { showAlert } = useAlert()

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
      addToFavorites,
      removeFromFavorites,
      infos,
      hr,
      versions
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
        {!allLoaded || !hasQueryBeenLoaded(result) ? (
          <FileListRowsPlaceholder />
        ) : (
          <>
            {flag('drive.virtualization.enabled') && !isMobile ? (
              <FolderViewBodyVz
                actions={actions}
                queryResults={[result]}
                withFilePath={true}
                extraColumns={extraColumns}
              />
            ) : (
              <FolderViewBody
                actions={actions}
                queryResults={[result]}
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
