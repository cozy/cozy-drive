import React, { useContext, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useClient, hasQueryBeenLoaded } from 'cozy-client'
import { SharingContext } from 'cozy-sharing'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { ModalContext } from 'drive/lib/ModalContext'
import Toolbar from 'drive/web/modules/drive/Toolbar'
import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import withSharedDocumentIds from './withSharedDocumentIds'
import { MobileAwareBreadcrumb as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'
import useActions from 'drive/web/modules/actions/useActions'
import {
  download,
  open,
  rename,
  move,
  qualify,
  versions,
  offline,
  share,
  hr
} from 'drive/web/modules/actions'
import {
  buildSharingsQuery,
  buildSharingsWithMetadataAttributeQuery
} from 'drive/web/modules/queries'
import { useFilesQueryWithPath } from 'drive/web/modules/views/hooks'
import { useExtraColumns } from 'drive/web/modules/certifications/useExtraColumns'
import { makeExtraColumnsNamesFromMedia } from 'drive/web/modules/certifications'
import FileListRowsPlaceholder from 'drive/web/modules/filelist/FileListRowsPlaceholder'
import useHead from 'components/useHead'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

export const SharingsView = ({
  sharedDocumentIds = [],
  allLoaded = true,
  children
}) => {
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
  const { pushModal, popModal } = useContext(ModalContext)
  const { refresh } = useContext(SharingContext)
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
    [share, download, hr, qualify, rename, move, hr, offline, open, versions],
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
          {children}
        </>
      )}
    </FolderView>
  )
}

export default withSharedDocumentIds(SharingsView)
