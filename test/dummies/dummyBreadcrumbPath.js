import { ROOT_DIR_ID, SHARED_DRIVES_DIR_ID } from '@/constants/config'

const dummyBreadcrumbPathSmall = (parentId, parentName) => [
  { id: parentId, name: parentName },
  { id: 'parentFolderId', name: 'parent' },
  { id: 'currentFolderId', name: 'current' }
]

const dummyBreadcrumbPathLarge = (parentId, parentName) => [
  { id: parentId, name: parentName },
  { id: 'grandParentFolderId', name: 'grandParent' },
  { id: 'parentFolderId', name: 'parent' },
  { id: 'currentFolderId', name: 'current' }
]

export const dummyBreadcrumbPathNoRootSmall = () =>
  dummyBreadcrumbPathSmall('mainfolder', 'Some Main Folder')
export const dummyBreadcrumbPathNoRootLarge = () =>
  dummyBreadcrumbPathLarge('mainfolder', 'Some Main Folder')

export const dummyBreadcrumbPathWithRootSmall = () =>
  dummyBreadcrumbPathSmall(ROOT_DIR_ID, 'Drive')
export const dummyBreadcrumbPathWithRootLarge = () =>
  dummyBreadcrumbPathLarge(ROOT_DIR_ID, 'Drive')

export const dummyBreadcrumbPathWithSharedDriveSmall = () =>
  dummyBreadcrumbPathSmall(SHARED_DRIVES_DIR_ID, 'Shared Drive')
export const dummyBreadcrumbPathWithSharedDriveLarge = () =>
  dummyBreadcrumbPathLarge(SHARED_DRIVES_DIR_ID, 'Shared Drive')

export const dummyRootBreadcrumbPath = () => ({
  id: ROOT_DIR_ID,
  name: 'Drive'
})
