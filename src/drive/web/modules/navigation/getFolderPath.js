import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'

// reconstruct the whole path to the current folder (first element is the root, the last is the current folder)
const getFolderPath = (
  displayedFolder,
  currentView,
  isPublic = false,
  sharedDocuments = [],
  openedFolderId
) => {
  const path = []
  const isBrowsingTrash = /^trash/.test(currentView)
  const isBrowsingRecentFiles = /^recent/.test(currentView)
  const isBrowsingSharings = /^sharings/.test(currentView)

  /* 
  Let's shorcut all the code above if we know we are at the TOP level 
  directory. As `openedFolderId` is the folder we want to OPEN and not
  the openedFolder. 

  With this shortcut, we can display `Trash` or `Drive` in the breadcrumb 
  without waiting the end of the request. 
  */
  switch (openedFolderId) {
    case ROOT_DIR_ID:
    case TRASH_DIR_ID:
      path.push({ id: openedFolderId })
      return path
    default:
      break
  }

  // dring the first fetch, displayedFolder is null, and we don't want to display anything
  if (displayedFolder) {
    path.push(displayedFolder)
    /* 
    If we are on the Recent view, we can return the path direclty since we're displaying
    only files and not folders. We can't have any navigation
    */
    if (isBrowsingRecentFiles) {
      return path
    }
    // does the folder have parents to display? The trash folder has the root folder as parent, but we don't want to show that. Sharings folder at the root level have the same problem.
    const parent = displayedFolder.parent
    const isShared = sharedDocuments.includes(displayedFolder.id)
    const isParentShared = parent && sharedDocuments.includes(parent.id)
    if (
      parent &&
      parent.id &&
      //If we're not at the root of the Trash
      !(isBrowsingTrash && parent.id === ROOT_DIR_ID) &&
      //If we're not
      !(isBrowsingSharings && isShared)
    ) {
      path.unshift(parent)
      // has the parent a parent too?
      if (
        parent.dir_id &&
        !(isBrowsingTrash && parent.dir_id === ROOT_DIR_ID) &&
        !(isBrowsingSharings && isParentShared) &&
        !isPublic
      ) {
        // since we don't *actually* have any information about the parent's parent, we have to fake it
        path.unshift({ id: parent.dir_id })
      }
    }
  }
  if (isPublic) {
    return path
  }
  // finally, we need to make sure we have the root level folder, which can be either the root, or the trash folder.
  if (!isBrowsingRecentFiles && !isBrowsingSharings) {
    const hasRootFolder =
      path[0] && (path[0].id === ROOT_DIR_ID || path[0].id === TRASH_DIR_ID)
    if (!hasRootFolder) {
      // if we don't have one, we add it manually
      path.unshift({
        id: isBrowsingTrash ? TRASH_DIR_ID : ROOT_DIR_ID
      })
    }
  }
  return path
}

export default getFolderPath
