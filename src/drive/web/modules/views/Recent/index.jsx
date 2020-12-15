/* global __TARGET__ */

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
import { MakeConditionWithQuery } from 'drive/web/modules/certifications'
import {
  CarbonCopy as CarbonCopyCell,
  ElectronicSafe as ElectronicSafeCell
} from 'drive/web/modules/filelist/cells'
import {
  CarbonCopy as CarbonCopyHeader,
  ElectronicSafe as ElectronicSafeHeader
} from 'drive/web/modules/filelist/headers'

export const RecentView = ({ router, location, children }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const query = buildRecentQuery()
  const result = useFilesQueryWithPath(query)
  const showAdditionalColumns = !isMobile && __TARGET__ !== 'mobile'

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
        {...showAdditionalColumns && {
          additionalColumns: {
            carbonCopy: {
              condition: MakeConditionWithQuery({
                query: buildRecentWithMetadataAttributeQuery({
                  attribute: 'carbonCopy'
                })
              }),
              label: 'carbonCopy',
              HeaderComponent: CarbonCopyHeader,
              CellComponent: CarbonCopyCell
            },
            electronicSafe: {
              condition: MakeConditionWithQuery({
                query: buildRecentWithMetadataAttributeQuery({
                  attribute: 'electronicSafe'
                })
              }),
              label: 'electronicSafe',
              HeaderComponent: ElectronicSafeHeader,
              CellComponent: ElectronicSafeCell
            }
          }
        }}
      />
      {children}
    </FolderView>
  )
}

export default RecentView
