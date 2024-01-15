import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
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
  move,
  duplicate,
  qualify,
  versions,
  hr,
  share
} from 'modules/actions'
import useActions from 'modules/actions/useActions'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import { useExtraColumns } from 'modules/certifications/useExtraColumns'
import Toolbar from 'modules/drive/Toolbar'
import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/navigation/Breadcrumb/MobileAwareBreadcrumb'
import {
  buildRecentQuery,
  buildRecentWithMetadataAttributeQuery
} from 'modules/queries'
import { useFilesQueryWithPath } from 'modules/views/hooks'

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
