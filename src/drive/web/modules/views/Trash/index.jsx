import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import Toolbar from 'drive/web/modules/trash/Toolbar'
import { MobileAwareBreadcrumbV2 as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'
import { getCurrentFolderId } from 'drive/web/modules/selectors'

import { useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useActions from './useActions'

import { buildTrashQuery } from 'drive/web/modules/queries'

const TrashView = ({ router, children, currentFolderId }) => {
  const trashQuery = buildTrashQuery()

  const result = useQuery(trashQuery.definition, trashQuery.options)
  const resultData = result.data || []
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
        <Toolbar disabled={resultData.length === 0} />
      </FolderViewHeader>
      <FolderViewBody
        navigateToFolder={navigateToFolder}
        navigateToFile={navigateToFile}
        actions={actions}
        queryResults={[result]}
        canSort
        canUpload={false}
        currentFolderId={currentFolderId}
      />
      {children}
    </FolderView>
  )
}
export default connect(state => ({
  currentFolderId: getCurrentFolderId(state)
}))(TrashView)
