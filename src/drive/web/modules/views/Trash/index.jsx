import React, { useCallback } from 'react'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import Toolbar from 'drive/web/modules/trash/Toolbar'
import { MobileAwareBreadcrumbV2 as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'

import { useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useActions from './useActions'

import { buildTrashQuery } from 'drive/web/modules/queries'

const TrashView = ({ router, children }) => {
  const trashQuery = buildTrashQuery()

  const result = useQuery(trashQuery.definition, trashQuery.options)

  const navigateToFolder = useCallback(folderId => {
    router.push(`/trash/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/trash/file/${file.id}`)
  })

  const actions = useActions()
  const { t } = useI18n()

  return (
    <FolderView>
      <FolderViewHeader>
        <Breadcrumb path={[{ name: t('breadcrumb.title_trash') }]} />
        <Toolbar canUpload={false} canCreateFolder={false} disabled={false} />
      </FolderViewHeader>
      <FolderViewBody
        navigateToFolder={navigateToFolder}
        navigateToFile={navigateToFile}
        actions={actions}
        queryResults={[result]}
        canSort
      />
      {children}
    </FolderView>
  )
}

export default TrashView
