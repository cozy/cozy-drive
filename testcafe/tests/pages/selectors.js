import { Selector } from 'testcafe'
import { getElementWithTestId, getElementWithTestItem } from '../helpers/utils'
//************************
// Commons, but with different contexts
//************************
// Toolbar
export const toolbarDrive = getElementWithTestId('fil-toolbar-files')
export const toolbarDrivePublic = getElementWithTestId('toolbar-files-public')
export const toolbarAlbumPublic = getElementWithTestId(
  'pho-toolbar-album-public'
)
export const toolbarAlbumsList = getElementWithTestId('pho-toolbar-albums')
export const toolbarTrash = getElementWithTestId('empty-trash')
//viewer public toolbar is different from the other ones (style, etc...)
export const toolbarViewerPublic = getElementWithTestId('toolbar-viewer-public')

// Download button
export const btnPublicDownloadDrive = getElementWithTestId(
  'fil-public-download'
)
export const btnPublicDownloadPhotosDesktop = getElementWithTestId(
  'album-public-download'
)
export const btnPublicDownloadPhotosMobile = getElementWithTestId(
  'album-public-download-mobile'
)
export const btnDownloadViewerToolbar = getElementWithTestId(
  'viewer-toolbar-download'
)

// Create Cozy
export const btnDrivePublicCreateCozy = toolbarDrivePublic
  .find('[class*="c-btn"]')
  .nth(0) //<CozyHomeLink>
export const btnViewerPublicCreateCozy = toolbarViewerPublic
  .find('[class*="c-btn"]')
  .nth(0) //<CozyHomeLink>
export const btnAlbumPublicCreateCozyMobile = getElementWithTestId(
  'album-public-create-cozy-mobile' //<MenuItem>
)
export const btnAlbumPublicCreateCozyMobileDesktop = toolbarAlbumPublic.find(
  '[class*="pho-public-mycozy"]' //<CozyHomeLink>
)

//************************
// Login
//************************
export const password = Selector('#password')
export const loginButton = Selector('#login-submit')
//************************
// Commons
//************************
export const btnMoreMenu = getElementWithTestId('more-button')
export const cozyMenuInner = getElementWithTestId('coz-menu-inner')
export const spinner = Selector('[class*="c-spinner"]')

//Cozy-Bar : Main menu
export const cozBar = Selector('#coz-bar')
export const btnMainApp = cozBar.find('div.coz-nav-apps-btns > button')
export const cozNavPopContent = Selector('[class*=coz-nav-pop-content]')
export const btnCozBarDrive = cozNavPopContent
  .find('li.coz-nav-apps-item > a')
  .withText('Cozy Drive')

//Top Selection bar & Confirmation Modal
export const cozySelectionbar = Selector('[class*="coz-selectionbar"]')
export const btnRemoveCozySelectionBar = cozySelectionbar
  .find('button')
  .withText('REMOVE')
export const btnShareCozySelectionBar = cozySelectionbar
  .find('button')
  .withText('SHARE')
export const btnRenameCozySelectionBar = cozySelectionbar
  .find('button')
  .withText('RENAME')
export const btnAddToAlbumCozySelectionBar = cozySelectionbar
  .find('button')
  .withText('ADD TO ALBUM')
export const btnDeleteCozySelectionBar = cozySelectionbar
  .find('button')
  .withText('DELETE')
export const btnDownloadCozySelectionBar = cozySelectionbar
  .find('button')
  .withText('DOWNLOAD')
export const btnRemoveFromAlbumCozySelectionBar = cozySelectionbar
  .find('button')
  .withText('REMOVE FROM ALBUM')

//Modal
export const modal = Selector('[class*="c-modal"]')
export const modalContent = getElementWithTestId('fil-content-modal')
export const modalClose = modal.find('[class*="c-btn--close"]')
export const modalFooter = modal.find('[class*="c-modal-footer"]')
export const btnModalFirstButton = modalFooter.find('button').nth(0) //CANCEL
export const btnModalSecondButton = modalFooter.find('button').nth(1) //REMOVE OR CONFIRM

//Alert
export const alertWrapper = Selector('[class*="c-alert-wrapper"]')

//Upload
export const btnUpload = getElementWithTestId('upload-btn')
export const divUpload = getElementWithTestId('upload-queue')
export const queue = Selector('[class*="upload-queue-list"]')
export const divUploadSuccess = getElementWithTestId('upload-queue-success')
export const uploadedItemName = value => {
  return getElementWithTestId('upload-queue-item-name').withText(value)
}
export const uploadedItem = value => {
  return uploadedItemName(value)
    .parent('div')
    .withAttribute('data-test-id', 'upload-queue-item')
}
//************************
// Commons - Public
//************************
export const logo = Selector('.coz-nav-apps-btns-home')
export const innerPublicMoreMenu = Selector('[class*="c-menu__inner--opened"]')
export const btnPublicMobileCreateCozy = innerPublicMoreMenu
  .find('[class*="c-menu__item"]')
  .nth(1)
export const btnPublicMobileDownload = innerPublicMoreMenu
  .find('[class*="c-menu__item"]')
  .nth(2)
//error (share not available)
export const errorAvailable = getElementWithTestId('empty-share')
//************************
// Viewer
//************************
export const viewerWrapper = getElementWithTestId('viewer-wrapper')
export const viewerControls = getElementWithTestId('pho-viewer-controls')
export const viewerToolbar = getElementWithTestId('viewer-toolbar')
// Navigation in viewer
export const viewerNavNext = getElementWithTestId('viewer-nav--next')
export const btnViewerNavNext = viewerNavNext.find(
  '[class*="pho-viewer-nav-arrow"]'
)
export const viewerNavPrevious = getElementWithTestId('viewer-nav--previous')
export const btnViewerNavPrevious = viewerNavPrevious.find(
  '[class*="pho-viewer-nav-arrow"]'
)
export const viewerBtnClose = getElementWithTestId('btn-viewer-toolbar-close')
//Specific viewers
export const imageViewer = getElementWithTestId('viewer-image')
export const imageViewerContent = imageViewer.find('img')
export const photoFull = Selector('[class*="pho-viewer-imageviewer"]').find(
  'img'
)
export const audioViewer = getElementWithTestId('viewer-audio')
export const audioViewerControls = audioViewer.find('audio')
export const txtViewer = getElementWithTestId('viewer-text')
export const txtViewerContent = txtViewer.find(
  '[class*="pho-viewer-textviewer-content"]'
)
export const videoViewer = getElementWithTestId('viewer-video')
export const videoViewerControls = videoViewer.find('video')
export const noViewer = getElementWithTestId('viewer-noviewer')
export const btnNoViewerDownload = noViewer.find('button')
export const pdfViewer = getElementWithTestId('viewer-pdf')
//************************
// Drive
//************************
//Sidebar
export const sidebar = getElementWithTestId('driveSidebar')
export const btnNavToFolder = getElementWithTestId('navToFolder')
export const btnNavToRecent = getElementWithTestId('navToRecent')
export const btnNavToSharing = getElementWithTestId('navToSharing')
export const btnNavToTrash = getElementWithTestId('navToTrash')
export const breadcrumb = getElementWithTestId('path-title')
//Error and empty folders
//c-empty is use for empty drive, or error..
export const driveEmpty = Selector('[class*="c-empty"]')
  .parent(0)
  .withAttribute('data-test-id', 'fil-content-body')
//oops is a class for error only
export const errorOops = Selector('[class*="oops"]')
export const errorEmpty = Selector('[class*="c-empty"]')
  .child('h2')
  .withText('Switch online!')
//loading
export const contentPlaceHolder = Selector(
  '[class*="fil-content-file-placeholder"]'
)

//Toolbar & Action Menu
export const btnAddFolder = getElementWithTestId('add-folder-link').parent(
  '[class*="coz-menu-item"]'
)()
export const btnRemoveFolder = getElementWithTestId('fil-action-delete')
export const elementActionMenuByRowIndex = value => {
  return contentRows
    .nth(value)
    .child('[class*="fil-content-file-action"]')
    .child('button')
}

export const actionMenuInner = getElementWithTestId('fil-actionmenu-inner')
export const btnMoveToActionMenu = actionMenuInner.find(
  '[class*="fil-action-moveto"]'
)
export const btnRestoreActionMenu = actionMenuInner.find(
  '[class*="fil-action-restore"]'
)
export const btnRemoveActionMenu = actionMenuInner.find(
  '[class*="fil-action-tras"]'
)
export const btnEmptyTrash = toolbarTrash.find('button')

//Moving (modal)
export const modalBreadcrumb = modal
  .find('h2')
  .withAttribute('data-test-id', 'path-title')
export const modalFolderOrFileName = modalContent
  .find('div')
  .withAttribute('data-test-id', 'fil-file-filename-and-ext')

//Files list
export const contentTable = Selector('[class*="fil-content-table"]')
export const contentRows = Selector(
  `[class*="fil-content-row"]:not([class*="fil-content-row-head"])`
)
export const foldersNamesInputs = getElementWithTestId('name-input')
export const folderOrFileName = getElementWithTestId(
  'fil-file-filename-and-ext'
)
export const checboxFolderByRowIndex = value => {
  return contentRows
    .nth(value)
    .child('[class*="fil-content-cell"]')
    .child('[data-input="checkbox"]')
}

//************************
// Photos
//************************
export const contentWrapper = getElementWithTestId(
  'timeline-pho-content-wrapper'
)

export const folderEmpty = getElementWithTestId('empty-folder')
export const loading = getElementWithTestId('loading')
export const photoSection = getElementWithTestId('photo-section')

//Sidebar
export const sidebarPhotos = Selector('[class*="pho-sidebar"]')
export const btnNavToAlbum = getElementWithTestId('nav-to-albums')

//thumbnails & photos
export const allPhotosWrapper = photoSection.find('[class^="pho-photo"]')
export const allPhotos = Selector('div').withAttribute('data-test-item')
export const photoThumb = value => {
  return allPhotos.nth(value)
}
export const photoThumbByName = value => {
  return getElementWithTestItem(value)
}
export const photoThumbByNameCheckbox = value => {
  return photoThumbByName(value).find(
    '[class*="pho-photo-select"][data-input="checkbox"]'
  )
}
export const photoCheckbox = Selector(
  '[class*="pho-photo-select"][data-input="checkbox"]'
)
//albums list
export const albumContentWrapper = getElementWithTestId(
  'album-pho-content-wrapper'
)
export const albumTitle = getElementWithTestId('pho-content-title')

//New albums & edit album
export const inputAlbumName = getElementWithTestId('input-album-name')
export const pickerAlbumName = getElementWithTestId('pho-picker-album-name')
export const btnValidateAlbum = getElementWithTestId('validate-album') //Same button for create album and Add to album
export const photoSectionAddToAlbum = getElementWithTestId('picker-panel')
  .find('div')
  .withAttribute('data-test-id', 'photo-section')
export const allPhotosAddToAlbum = photoSectionAddToAlbum
  .find('img')
  .parent('div')
  .withAttribute('data-test-item')
export const photoToAddCheckbox = photoSectionAddToAlbum.find(
  '[class*="pho-photo-select"][data-input="checkbox"]'
)

export const mainContent = Selector('[class*="pho-content"]')
export const toolbarAlbum = getElementWithTestId('pho-toolbar-album')
export const moreMenuDownloadAlbum = getElementWithTestId('menu-download-album')
export const moreMenuRenameAlbum = getElementWithTestId('menu-rename-album')
export const moreMenuAddPhotosToAlbum = getElementWithTestId(
  'menu-add-photos-to-album'
)
export const moreMenuDeleteAlbum = getElementWithTestId('menu-delete-album')
export const btnBackToAlbum = getElementWithTestId('pho-content-album-previous')
// ALBUM
export const albumEmptyText = folderEmpty.withText(
  "You don't have any album yet"
)

// Album list
export const btnNewAlbum = getElementWithTestId('album-add')
export const album = albumName => {
  return getElementWithTestId('pho-album').withAttribute(
    'data-test-name',
    albumName
  )
}
//************************
// Share
//************************
export const btnShare = toolbarDrive
  .child('button')
  .withAttribute('data-test-id', 'share-button')
export const btnShareAlbum = toolbarAlbum
  .child('button')
  .withAttribute('data-test-id', 'share-button')

export const btnShareByMe = toolbarDrive
  .child('button')
  .withAttribute('data-test-id', 'share-by-me-button')

export const divShareByLink = getElementWithTestId('share-by-link')
export const toggleShareLink = divShareByLink.child('[class*="toggle"]')
export const spanLinkCreating = Selector(
  '[class*="share-bylink-header-creating"]'
)
export const btnCopyShareByLink = Selector('button').withAttribute(
  'data-test-url'
)
export const shareBadgeForRowindex = value => {
  return contentRows.nth(value).find('[class*="shared-badge"]')
}
export const albumPublicLayout = getElementWithTestId('pho-public-layout')
