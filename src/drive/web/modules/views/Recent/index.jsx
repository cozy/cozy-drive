import React, { useCallback } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'

import { MobileAwareBreadcrumbV2 as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'

import useActions from 'drive/web/modules/actions/useActions'

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

  const actions = useActions({ hasWriteAccess: false, canMove: true })

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
