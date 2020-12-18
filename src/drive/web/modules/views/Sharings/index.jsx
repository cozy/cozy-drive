/* global __TARGET__ */

import React, { useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'

import { useClient } from 'cozy-client'
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
import { useFilesQueryWithPath } from '../Recent/useFilesQueryWithPath'
import { useExtraColumns } from 'drive/web/modules/certifications/useExtraColumns'

const desktopExtraColumns = ['carbonCopy', 'electronicSafe']
const mobileExtraColumns = []

export const SharingsView = ({
  router,
  location,
  sharedDocumentIds = [],
  children
}) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const extraColumnsNames =
    isMobile || __TARGET__ === 'mobile'
      ? mobileExtraColumns
      : desktopExtraColumns

  const extraColumns = useExtraColumns({
    columnsNames: extraColumnsNames,
    queryBuilder: buildSharingsWithMetadataAttributeQuery,
    sharedDocumentIds
  })

  const query = buildSharingsQuery(sharedDocumentIds)
  const result = useFilesQueryWithPath(query)

  const navigateToFolder = useCallback(
    folderId => {
      router.push(`/sharings/${folderId}`)
    },
    [router]
  )

  const navigateToFile = useCallback(
    file => {
      router.push(`/sharings/file/${file.id}`)
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
    [share, download, hr, qualify, rename, move, hr, offline, open, versions],
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
        extraColumns={extraColumns}
      />
      {children}
    </FolderView>
  )
}

export default withSharedDocumentIds(SharingsView)
