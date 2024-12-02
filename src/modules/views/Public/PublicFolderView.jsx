import cx from 'classnames'
import { useCurrentFolderId, useDisplayedFolder, useParentFolder } from 'hooks'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import React, { useCallback, useContext, useEffect } from 'react'
import { ModalManager } from 'react-cozy-helpers'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

import { useClient, models } from 'cozy-client'
import flag from 'cozy-flags'
import {
  useSharingContext,
  SharingBannerPlugin,
  useSharingInfos
} from 'cozy-sharing'
import { Content } from 'cozy-ui/transpiled/react'
import {
  divider,
  makeActions
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import usePublicFilesQuery from './usePublicFilesQuery'
import usePublicWritePermissions from './usePublicWritePermissions'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'
import FolderViewHeader from '../Folder/FolderViewHeader'
import OldFolderViewBreadcrumb from '../Folder/OldFolderViewBreadcrumb'
import { ROOT_DIR_ID } from 'constants/config'
import { FabContext } from 'lib/FabProvider'
import { ModalStack, useModalContext } from 'lib/ModalContext'
import { download, trash, rename, versions } from 'modules/actions'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import { useExtraColumns } from 'modules/certifications/useExtraColumns'
import AddMenuProvider from 'modules/drive/AddMenu/AddMenuProvider'
import FabWithAddMenuContext from 'modules/drive/FabWithAddMenuContext'
import Main from 'modules/layout/Main'
import { OpenExternalLinkButton } from 'modules/public/OpenExternalLinkButton'
import PublicToolbar from 'modules/public/PublicToolbar'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

const getBreadcrumbPath = (t, displayedFolder, parentFolder) =>
  uniqBy(
    [
      {
        id: get(parentFolder, 'id'),
        name: get(parentFolder, 'name')
      },
      {
        id: displayedFolder.id,
        name: displayedFolder.name
      }
    ],
    'id'
  )
    .filter(({ id }) => Boolean(id))
    .map(breadcrumb => ({
      id: breadcrumb.id,
      name: breadcrumb.name || '…'
    }))

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

const PublicFolderView = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const client = useClient()
  const { t, lang } = useI18n()
  const { isMobile } = useBreakpoints()
  const { isFabDisplayed, setIsFabDisplayed } = useContext(FabContext)
  const currentFolderId = useCurrentFolderId()
  const { displayedFolder } = useDisplayedFolder()
  const parentDirId = get(displayedFolder, 'dir_id')
  const parentFolder = useParentFolder(parentDirId)
  const { isSelectionBarVisible } = useSelectionContext()
  const { hasWritePermissions } = usePublicWritePermissions()
  const { pushModal, popModal } = useModalContext()
  const { refresh, isOwner, byDocId } = useSharingContext()
  const dispatch = useDispatch()
  const sharingInfos = useSharingInfos()
  const { showAlert } = useAlert()
  const isOnSharedFolder =
    !sharingInfos.loading &&
    sharingInfos.sharing?.rules?.some(rule =>
      rule.values.includes(currentFolderId)
    )

  const filesResult = usePublicFilesQuery(currentFolderId)
  const files = filesResult.data

  const extraColumnsNames = makeExtraColumnsNamesFromMedia({
    isMobile,
    desktopExtraColumnsNames,
    mobileExtraColumnsNames
  })

  const extraColumns = useExtraColumns({
    columnsNames: extraColumnsNames,
    conditionBuilder: ({ files, attribute }) =>
      files.some(file => models.file.hasMetadataAttribute({ file, attribute })),
    files
  })

  const refreshFolderContent = () => filesResult.forceRefetch() // We don't have enough permissions to rely on the realtime notifications or on a cozy-client query to update the view when something changes, so we relaod the view instead

  const refreshAfterChange = () => {
    refresh()
    refreshFolderContent()
  }

  const actionOptions = {
    client,
    t,
    lang,
    pushModal,
    popModal,
    refresh: refreshAfterChange,
    dispatch,
    navigate,
    showAlert,
    pathname,
    hasWriteAccess: hasWritePermissions,
    canMove: false,
    isPublic: true,
    isOwner,
    byDocId
  }
  const actions = makeActions(
    [download, rename, versions, divider, trash],
    actionOptions
  )

  const geTranslatedBreadcrumbPath = useCallback(
    displayedFolder => getBreadcrumbPath(t, displayedFolder, parentFolder),
    [t, parentFolder]
  )

  const rootBreadcrumbPath = {
    id: ROOT_DIR_ID,
    name: 'Public'
  }

  useEffect(() => {
    if (hasWritePermissions) {
      setIsFabDisplayed(isMobile)
      return () => {
        // to not have this set to false on other views after using this view
        setIsFabDisplayed(false)
      }
    }
  }, [setIsFabDisplayed, isMobile, hasWritePermissions])

  const showNewBreadcrumbFlag = flag(
    'drive.breadcrumb.showCompleteBreadcrumbOnPublicPage'
  )
  const isOldBreadcrumb =
    !showNewBreadcrumbFlag || showNewBreadcrumbFlag !== true

  // Check if the sharing shortcut has already been created (but not synced)
  const isShareAlreadyAdded =
    !sharingInfos.loading && sharingInfos.isSharingShortcutCreated
  // Check if you are sharing Cozy to Cozy (Link sharing is on the `/public` route)
  const isPreview = window.location.pathname === '/preview'
  // Show the sharing banner plugin only on shared links view and cozy to cozy sharing view(not added)
  const isSharingBannerPluginDisplayed =
    !isShareAlreadyAdded || (isOnSharedFolder && !isPreview)

  const isAddToMyCozyFabDisplayed =
    isMobile && isPreview && !isShareAlreadyAdded

  return (
    <Main isPublic={true}>
      <ModalStack />
      <ModalManager />
      {isSharingBannerPluginDisplayed && <SharingBannerPlugin />}
      <span className={cx({ 'u-pt-2': !isMobile })} />
      <FolderViewHeader>
        {currentFolderId && (
          <>
            {isOldBreadcrumb ? (
              <OldFolderViewBreadcrumb
                currentFolderId={currentFolderId}
                getBreadcrumbPath={geTranslatedBreadcrumbPath}
              />
            ) : (
              <FolderViewBreadcrumb
                rootBreadcrumbPath={rootBreadcrumbPath}
                currentFolderId={currentFolderId}
              />
            )}
            <PublicToolbar
              files={files}
              hasWriteAccess={hasWritePermissions}
              refreshFolderContent={refreshFolderContent}
              sharingInfos={sharingInfos}
            />
          </>
        )}
      </FolderViewHeader>
      <Content>
        <FolderViewBody
          actions={actions}
          queryResults={[filesResult]}
          canSort={false}
          currentFolderId={currentFolderId}
          refreshFolderContent={refreshFolderContent}
          canUpload={hasWritePermissions}
          extraColumns={extraColumns}
          isPublic={true}
        />
        {isFabDisplayed && (
          <AddMenuProvider
            canCreateFolder={hasWritePermissions}
            canUpload={hasWritePermissions}
            refreshFolderContent={refreshFolderContent}
            isPublic={true}
            displayedFolder={displayedFolder}
            isSelectionBarVisible={isSelectionBarVisible}
          >
            <FabWithAddMenuContext noSidebar={true} />
          </AddMenuProvider>
        )}
        {isAddToMyCozyFabDisplayed && (
          <OpenExternalLinkButton
            link={sharingInfos.discoveryLink}
            variant="fab"
          />
        )}
        <Outlet />
      </Content>
    </Main>
  )
}

export { PublicFolderView }
