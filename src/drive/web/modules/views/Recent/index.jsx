import React, { useCallback, useContext } from 'react'

import { SharingContext } from 'cozy-sharing'
import { ModalContext } from 'drive/lib/ModalContext'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { useClient } from 'cozy-client'
import { useDispatch } from 'react-redux'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'

import { MobileAwareBreadcrumb as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'

import useActions from 'drive/web/modules/actions/useActions'
import {
  share,
  download,
  trash,
  open,
  rename,
  move,
  qualify,
  versions,
  offline
} from 'drive/web/modules/actions'

import { buildRecentQuery } from 'drive/web/modules/queries'
import { useFilesQueryWithPath } from './useFilesQueryWithPath'

export const RecentView = ({ router, children }) => {
  const { t } = useI18n()
  const query = buildRecentQuery()
  const result = useFilesQueryWithPath(query)

  const navigateToFolder = useCallback(folderId => {
    router.push(`/folder/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/recent/file/${file.id}`)
  })

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
    router,
    location,
    hasWriteAccess: false,
    canMove: true
  }
  const actions = useActions(
    [share, download, trash, open, rename, move, qualify, versions, offline],
    actionsOptions
  )

  return (
    <FolderView>
      <FolderViewHeader>
        <Breadcrumb path={[{ name: t('breadcrumb.title_recent') }]} />
      </FolderViewHeader>
      <FolderViewBody
        navigateToFolder={navigateToFolder}
        navigateToFile={navigateToFile}
        actions={actions}
        queryResults={[result]}
        canSort={false}
        withFilePath={true}
      />
      {children}
    </FolderView>
  )
}

export default RecentView
