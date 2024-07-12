import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

import { useClient, hasQueryBeenLoaded } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withSharedDocumentIds from './withSharedDocumentIds'
import FolderView from '../Folder/FolderView'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewHeader from '../Folder/FolderViewHeader'
import useHead from 'components/useHead'
import { useModalContext } from 'lib/ModalContext'
import { download, rename, qualify, versions, share, hr } from 'modules/actions'
import { addToFavorites } from 'modules/actions/components/addToFavorites'
import { moveTo } from 'modules/actions/components/moveTo'
import { removeFromFavorites } from 'modules/actions/components/removeFromFavorites'
import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/breadcrumb/components/MobileAwareBreadcrumb'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import { useExtraColumns } from 'modules/certifications/useExtraColumns'
import Toolbar from 'modules/drive/Toolbar'
import FileListRowsPlaceholder from 'modules/filelist/FileListRowsPlaceholder'
import { useFilesQueryWithPath } from 'modules/views/hooks'
import {
  buildSharingsQuery,
  buildSharingsWithMetadataAttributeQuery
} from 'queries'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

export const SharingsView = ({ sharedDocumentIds = [] }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t, lang } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()
  const { pushModal, popModal } = useModalContext()
  const { allLoaded, refresh } = useSharingContext()
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
  const result = useFilesQueryWithPath(query)

  const navigateToFolder = useCallback(
    folder => {
      navigate(`/sharings/${folder._id}`)
    },
    [navigate]
  )

  const navigateToFile = useCallback(
    file => {
      navigate(`/sharings/file/${file.id}`)
    },
    [navigate]
  )

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
    showAlert
  }

  const actions = makeActions(
    [
      share,
      download,
      hr,
      qualify,
      rename,
      moveTo,
      addToFavorites,
      removeFromFavorites,
      hr,
      versions
    ],
    actionsOptions
  )

  return (
    <FolderView>
      <FolderViewHeader>
        <Breadcrumb path={[{ name: t('breadcrumb.title_sharings') }]} />
        <Toolbar canUpload={false} canCreateFolder={false} />
      </FolderViewHeader>
      {!allLoaded || !hasQueryBeenLoaded(result) ? (
        <FileListRowsPlaceholder />
      ) : (
        <>
          <FolderViewBody
            navigateToFolder={navigateToFolder}
            navigateToFile={navigateToFile}
            actions={actions}
            queryResults={[result]}
            canSort={false}
            withFilePath={true}
            extraColumns={extraColumns}
          />
          <Outlet />
        </>
      )}
    </FolderView>
  )
}

export default withSharedDocumentIds(SharingsView)
