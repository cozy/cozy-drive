import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import FolderView from '../Folder/FolderView'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewHeader from '../Folder/FolderViewHeader'
import useHead from 'components/useHead'
import { useModalContext } from 'lib/ModalContext'
import {
  download,
  trash,
  rename,
  qualify,
  versions,
  hr,
  share
} from 'modules/actions'
import { addToFavorites } from 'modules/actions/components/addToFavorites'
import { moveTo } from 'modules/actions/components/moveTo'
import { removeFromFavorites } from 'modules/actions/components/removeFromFavorites'
import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/breadcrumb/components/MobileAwareBreadcrumb'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import { useExtraColumns } from 'modules/certifications/useExtraColumns'
import Toolbar from 'modules/drive/Toolbar'
import { useFilesQueryWithPath } from 'modules/views/hooks'
import {
  buildRecentQuery,
  buildRecentWithMetadataAttributeQuery
} from 'queries'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

export const RecentView = () => {
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
    queryBuilder: buildRecentWithMetadataAttributeQuery
  })

  const query = buildRecentQuery()
  const result = useFilesQueryWithPath(query)

  const navigateToFolder = useCallback(
    folder => {
      navigate(`/folder/${folder._id}`)
    },
    [navigate]
  )

  const navigateToFile = useCallback(
    file => {
      navigate(`/recent/file/${file.id}`)
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
      versions,
      hr,
      trash
    ],
    actionsOptions
  )

  return (
    <FolderView>
      <FolderViewHeader>
        <Breadcrumb path={[{ name: t('breadcrumb.title_recent') }]} />
        <Toolbar canUpload={false} canCreateFolder={false} />
      </FolderViewHeader>
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
    </FolderView>
  )
}

export default RecentView
