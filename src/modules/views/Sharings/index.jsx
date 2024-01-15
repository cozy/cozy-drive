import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

import { useClient, hasQueryBeenLoaded } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withSharedDocumentIds from './withSharedDocumentIds'
import FolderView from '../Folder/FolderView'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewHeader from '../Folder/FolderViewHeader'
import useHead from 'components/useHead'
import { useModalContext } from 'lib/ModalContext'
import {
  download,
  rename,
  move,
  qualify,
  versions,
  share,
  hr
} from 'modules/actions'
import useActions from 'modules/actions/useActions'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import { useExtraColumns } from 'modules/certifications/useExtraColumns'
import Toolbar from 'modules/drive/Toolbar'
import FileListRowsPlaceholder from 'modules/filelist/FileListRowsPlaceholder'
import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/navigation/Breadcrumb/MobileAwareBreadcrumb'
import {
  buildSharingsQuery,
  buildSharingsWithMetadataAttributeQuery
} from 'modules/queries'
import { useFilesQueryWithPath } from 'modules/views/hooks'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

export const SharingsView = ({ sharedDocumentIds = [], allLoaded = true }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  useHead()

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
    folderId => {
      navigate(`/sharings/${folderId}`)
    },
    [navigate]
  )

  const navigateToFile = useCallback(
    file => {
      navigate(`/sharings/file/${file.id}`)
    },
    [navigate]
  )

  const client = useClient()
  const { pushModal, popModal } = useModalContext()
  const { refresh } = useSharingContext()
  const dispatch = useDispatch()
  const actionsOptions = {
    client,
    pushModal,
    popModal,
    refresh,
    dispatch,
    navigate,
    pathname,
    hasWriteAccess: true,
    canMove: true,
    isPublic: false
  }

  const actions = useActions(
    [share, download, hr, qualify, rename, move, hr, versions],
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
