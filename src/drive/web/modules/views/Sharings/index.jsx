import React, { useCallback } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import SharedDocuments from 'cozy-sharing/dist/components/SharedDocuments'

import Toolbar from 'drive/web/modules/drive/Toolbar'
import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'

import { MobileAwareBreadcrumbV2 as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'

import useActions from 'drive/web/modules/actions/useActions'

import { buildSharingsQuery } from 'drive/web/modules/queries'
import { useFilesQueryWithPath } from '../Recent/useFilesQueryWithPath'

export const SharingsView = ({ router, sharedDocumentIds, children }) => {
  const { t } = useI18n()
  const query = buildSharingsQuery(sharedDocumentIds)
  const result = useFilesQueryWithPath(query)

  const navigateToFolder = useCallback(folderId => {
    router.push(`/sharings/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/sharings/file/${file.id}`)
  })

  const actions = useActions({ hasWriteAccess: false, canMove: true })

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

const SharingsViewWithDocs = props => (
  <SharedDocuments>
    {({ sharedDocuments }) => (
      <SharingsView {...props} sharedDocumentIds={sharedDocuments} />
    )}
  </SharedDocuments>
)

export default SharingsViewWithDocs
