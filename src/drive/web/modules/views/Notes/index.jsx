
import React, { useCallback, useContext } from 'react'
import { connect, useDispatch } from 'react-redux'
import cx from 'classnames'

import { SharingContext } from 'cozy-sharing'
import { useClient, models } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'

import { MobileAwareBreadcrumb as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'
import { ModalContext } from 'drive/lib/ModalContext'
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
  offline,
  hr
} from 'drive/web/modules/actions'
import Toolbar from 'drive/web/modules/drive/Toolbar'
import { ROOT_DIR_ID } from 'drive/constants/config'
import { buildNotesQuery } from 'drive/web/modules/queries'
import {
  getCurrentFolderId,
  getDisplayedFolder
} from 'drive/web/modules/selectors'
import { useFolderSort } from 'drive/web/modules/navigation/duck'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import { useFilesQueryWithPath } from '../Recent/useFilesQueryWithPath'
import styles from 'drive/styles/toolbar.styl'

const DriveView = ({
  currentFolderId,
  router,
  location,
  children,
  
}) => {
  const [sortOrder] = useFolderSort(currentFolderId)
  const notesQuery = buildNotesQuery({
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })
  const filesResult = useFilesQueryWithPath(notesQuery)

  const isInError = filesResult.fetchStatus === 'failed'
  const isLoading =
    filesResult.fetchStatus === 'loading' && !notesQuery.lastUpdate
  const isPending = filesResult.fetchStatus === 'pending'

  const navigateToFile = useCallback(
    file => {
      router.push(`/folder/${currentFolderId}/file/${file.id}`)
    },
    [router, currentFolderId]
  )

  const { hasWriteAccess } = useContext(SharingContext)
  const client = useClient()
  const { pushModal, popModal } = useContext(ModalContext)
  const { refresh } = useContext(SharingContext)
  const dispatch = useDispatch()
  const canWriteToCurrentFolder = hasWriteAccess(currentFolderId)
  const actionsOptions = {
    client,
    pushModal,
    popModal,
    refresh,
    dispatch,
    router,
    location,
    hasWriteAccess: canWriteToCurrentFolder,
    canMove: true
  }
  const actions = useActions(
    [
      share,
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

  const { t } = useI18n()

  return (
    <FolderView>
      <FolderViewHeader>
        <Breadcrumb path={[{ name: t('breadcrumb.title_notes') }]} />
       
      <div
        data-test-id="fil-toolbar-files"
        className={cx(styles['fil-toolbar-files'], 'u-flex-items-center')}
        role="toolbar"
      >
          <Button
              //theme="text"
              label={'Créer une note'}
              onClick={async () => {
                const { data: file } = await client.create('io.cozy.notes', {dir_id: ''})
        
                  window.location.href = await models.note.generatePrivateUrl(
                    '',
                    file,
                    { returnUrl: '' }
                  )
              }}
            />
          </div>
      </FolderViewHeader>
      <FolderViewBody
        navigateToFile={navigateToFile}
        actions={actions}
        queryResults={[filesResult]}
        canSort
        currentFolderId={currentFolderId}
        withFilePath={true}
      />

      {children}
    </FolderView>
  )
}

export default connect(state => ({
  currentFolderId: getCurrentFolderId(state) || ROOT_DIR_ID,
  displayedFolder: getDisplayedFolder(state)
}))(DriveView)
