import React, { useCallback } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import { useModalContext } from 'drive/lib/ModalContext'
import Toolbar from 'drive/web/modules/drive/Toolbar'
import { MobileAwareBreadcrumb as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'
import useActions from 'drive/web/modules/actions/useActions'
import {
  download,
  trash,
  open,
  rename,
  move,
  duplicate,
  qualify,
  versions,
  hr,
  share
} from 'drive/web/modules/actions'
import {
  buildRecentQuery,
  buildRecentWithMetadataAttributeQuery
} from 'drive/web/modules/queries'
import { useFilesQueryWithPath } from 'drive/web/modules/views/hooks'
import { useExtraColumns } from 'drive/web/modules/certifications/useExtraColumns'
import { makeExtraColumnsNamesFromMedia } from 'drive/web/modules/certifications'
import useHead from 'components/useHead'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

export const RecentView = () => {
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
    queryBuilder: buildRecentWithMetadataAttributeQuery
  })

  const query = buildRecentQuery()
  const result = useFilesQueryWithPath(query)

  const navigateToFolder = useCallback(
    folderId => {
      navigate(`/folder/${folderId}`)
    },
    [navigate]
  )

  const navigateToFile = useCallback(
    file => {
      navigate(`/recent/file/${file.id}`)
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
    [
      share,
      download,
      hr,
      qualify,
      rename,
      move,
      duplicate,
      hr,
      open,
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
