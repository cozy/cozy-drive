import React, { useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'

import { useClient, useQuery } from 'cozy-client'
import { SharingContext } from 'cozy-sharing'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import { ModalContext } from 'drive/lib/ModalContext'
import Toolbar from 'drive/web/modules/drive/Toolbar'
import { MobileAwareBreadcrumb as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'
import useActions from 'drive/web/modules/actions/useActions'
import {
  download,
  trash,
  open,
  rename,
  move,
  qualify,
  versions,
  offline,
  hr
} from 'drive/web/modules/actions'
import {
  buildRecentQuery,
  buildRecentWithMetadataAttributeQuery
} from 'drive/web/modules/queries'
import { useFilesQueryWithPath } from './useFilesQueryWithPath'
import {
  makeCarbonCopy,
  makeElectronicSafe
} from 'drive/web/modules/filelist/certifications'

export const RecentView = ({ router, location, children }) => {
  const { t } = useI18n()
  const query = buildRecentQuery()
  const carbonCopyQuery = buildRecentWithMetadataAttributeQuery({
    attribute: 'carbonCopy'
  })
  const electronicSafeQuery = buildRecentWithMetadataAttributeQuery({
    attribute: 'electronicSafe'
  })

  const result = useFilesQueryWithPath(query)
  const carbonCopyResult = useQuery(
    carbonCopyQuery.definition,
    carbonCopyQuery.options
  )
  const electronicSafeResult = useQuery(
    electronicSafeQuery.definition,
    electronicSafeQuery.options
  )
  const isCarbonCopy =
    carbonCopyResult.fetchStatus === 'loaded' &&
    carbonCopyResult.data.length > 0
  const isElectronicSafe =
    electronicSafeResult.fetchStatus === 'loaded' &&
    electronicSafeResult.data.length > 0

  const navigateToFolder = useCallback(
    folderId => {
      router.push(`/folder/${folderId}`)
    },
    [router]
  )

  const navigateToFile = useCallback(
    file => {
      router.push(`/recent/file/${file.id}`)
    },
    [router]
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
    router,
    location,
    hasWriteAccess: true,
    canMove: true
  }

  const actions = useActions(
    [
      download,
      hr,
      qualify,
      rename,
      move,
      hr,
      offline,
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
        optionalsColumns={{
          carbonCopy: makeCarbonCopy(isCarbonCopy),
          electronicSafe: makeElectronicSafe(isElectronicSafe)
        }}
      />
      {children}
    </FolderView>
  )
}

export default RecentView
