import { useMemo } from 'react'

import { useSharingContext } from 'cozy-sharing'

import { SHARED_DRIVES_DIR_ID } from '@/constants/config'
import { isNextcloudShortcut } from '@/modules/nextcloud/helpers'
import { useSharedDrives } from '@/modules/shareddrives/hooks/useSharedDrives'

const useTransformFolderListHasSharedDriveShortcuts = (
  folderList,
  showNextcloudFolder = false
) => {
  const { isOwner } = useSharingContext()

  const { sharedDrives } = useSharedDrives()

  /**
   * The recipient's shared drives are displayed as shortcuts which cannot accessible
   * In some cases (like open shared drive from folder picker or sharing section...),
   *  we want to access to shared drives as directories for both owner and recipient
   * The codes below help us to transform the shared drives shortcuts into directory-like objects
   */
  const transformedSharedDrives = useMemo(
    () =>
      (sharedDrives ?? [])
        .filter(sharing => !isNextcloudShortcut(sharing))
        .map(sharing => {
          const [rootFolderId, driveName] = [
            sharing.rules[0]?.values?.[0],
            sharing.rules?.[0]?.title
          ]

          const fileInSharingSection = folderList?.find(
            item =>
              item.relationships?.referenced_by?.data?.[0]?.id === sharing.id
          )

          if (fileInSharingSection && isOwner(fileInSharingSection.id ?? ''))
            return fileInSharingSection

          const directoryData = {
            type: 'directory',
            name: driveName,
            dir_id: SHARED_DRIVES_DIR_ID,
            driveId: sharing.id
          }

          return {
            ...fileInSharingSection,
            _id: rootFolderId,
            id: SHARED_DRIVES_DIR_ID,
            _type: 'io.cozy.files',
            path: `/Drives/${driveName}`,
            ...directoryData,
            attributes: directoryData
          }
        }),
    [sharedDrives, folderList, isOwner]
  )

  /**
   * Exclude shared drives from the folderList,
   * since it will be replaced with transformed ones above.
   */
  const nonSharedDriveList =
    folderList?.filter(
      item =>
        item.dir_id !== SHARED_DRIVES_DIR_ID &&
        (!showNextcloudFolder ? !isNextcloudShortcut(item) : true)
    ) || []

  return {
    sharedDrives: transformedSharedDrives,
    nonSharedDriveList
  }
}

export { useTransformFolderListHasSharedDriveShortcuts }
