import React, { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

import { useClient, useQuery } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'
import { useSharingContext } from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useModalContext } from 'lib/ModalContext'
import {
  download,
  rename,
  qualify,
  versions,
  share,
  hr,
  trash
} from 'modules/actions'
import { addToFavorites } from 'modules/actions/components/addToFavorites'
import { moveTo } from 'modules/actions/components/moveTo'
import { removeFromFavorites } from 'modules/actions/components/removeFromFavorites'
import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/breadcrumb/components/MobileAwareBreadcrumb'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import {
  useExtraColumns,
  ExtraColumn
} from 'modules/certifications/useExtraColumns'
import Toolbar from 'modules/drive/Toolbar'
import { FolderBody } from 'modules/folder/components/FolderBody'
import { useFileOpeningHandler } from 'modules/folder/hooks/useFileOpeningHandler'
import { useFolderSort } from 'modules/navigation/duck'
import FolderView from 'modules/views/Folder/FolderView'
import FolderViewHeader from 'modules/views/Folder/FolderViewHeader'
import {
  buildFavoritesQuery,
  buildFileWithSpecificMetadataAttributeQuery
} from 'queries'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames: string[] = []

const FavoritesView: FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isMobile } = useBreakpoints()
  const { t, lang } = useI18n()
  const client = useClient()
  const { pushModal, popModal } = useModalContext()
  const { allLoaded, refresh } = useSharingContext()
  const dispatch = useDispatch()
  const { showAlert } = useAlert()
  const [sortOrder] = useFolderSort('favorites')

  const extraColumnsNames = makeExtraColumnsNamesFromMedia({
    isMobile,
    desktopExtraColumnsNames,
    mobileExtraColumnsNames
  })

  const extraColumns = useExtraColumns({
    columnsNames: extraColumnsNames,
    queryBuilder: buildFileWithSpecificMetadataAttributeQuery,
    currentFolderId: 'io.cozy.files.shared-drives-dir'
  }) as ExtraColumn[]

  const favoritesQuery = buildFavoritesQuery({
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })
  const favoritesResult = useQuery(
    favoritesQuery.definition,
    favoritesQuery.options
  ) as {
    data?: IOCozyFile[] | null
  }

  const handleFolderOpen = useCallback(
    (folder: IOCozyFile) => {
      navigate(`/folder/${folder._id}`)
    },
    [navigate]
  )

  const navigateToFile = useCallback(
    (file: IOCozyFile) => {
      navigate(`/folder/io.cozy.files.shared-drives-dir/file/${file._id}`)
    },
    [navigate]
  )

  const { handleFileOpen } = useFileOpeningHandler({
    isPublic: false,
    navigateToFile
  })

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
      versions,
      hr,
      trash
    ],
    actionsOptions
  )
  return (
    <FolderView isNotFound={false}>
      <FolderViewHeader>
        <Breadcrumb path={[{ name: t('breadcrumb.title_favorites') }]} />
        <Toolbar canUpload={false} canCreateFolder={false} />
      </FolderViewHeader>
      <FolderBody
        folderId="io.cozy.files.shared-drives-dir"
        queryResults={[favoritesResult]}
        onFolderOpen={handleFolderOpen}
        onFileOpen={handleFileOpen}
        extraColumns={extraColumns}
        actions={actions}
        canSort={true}
      />
      <Outlet />
    </FolderView>
  )
}

export { FavoritesView }
