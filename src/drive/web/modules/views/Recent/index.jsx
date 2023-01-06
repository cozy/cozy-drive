import React, { useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'

import { useClient } from 'cozy-client'
import { SharingContext } from 'cozy-sharing'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

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
  duplicate,
  qualify,
  versions,
  offline,
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

export const RecentView = ({ router, location, children }) => {
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
        extraColumns={extraColumns}
      />
      {children}
    </FolderView>
  )
}

export default RecentView
