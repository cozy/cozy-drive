import React, { useCallback, useContext } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { useClient } from 'cozy-client'
import { useDispatch } from 'react-redux'

import { SharingContext } from 'cozy-sharing'
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
  offline
} from 'drive/web/modules/actions'

import { buildSharingsQuery } from 'drive/web/modules/queries'
import { useFilesQueryWithPath } from '../Recent/useFilesQueryWithPath'

export const SharingsView = ({
  router,
  location,
  sharedDocumentIds = [],
  children
}) => {
  const { t } = useI18n()
  const query = buildSharingsQuery(sharedDocumentIds)
  const result = useFilesQueryWithPath(query)

  const navigateToFolder = useCallback(folderId => {
    router.push(`/sharings/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/sharings/file/${file.id}`)
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
    hasWriteAccess: true,
    canMove: true
  }
  const actions = useActions(
    [download, open, rename, move, qualify, versions, offline],
    actionsOptions
  )

  return (
    <FolderView>
      <FolderViewHeader>
        <Breadcrumb path={[{ name: t('breadcrumb.title_sharings') }]} />
        <Toolbar canUpload={false} canCreateFolder={false} />
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

export default withSharedDocumentIds(SharingsView)
