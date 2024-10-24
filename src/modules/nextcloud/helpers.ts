import { isShortcut } from 'cozy-client/dist/models/file'
import type { IOCozyFile, NextcloudFile } from 'cozy-client/types/types'
import flag from 'cozy-flags'

import type { File, FolderPickerEntry } from 'components/FolderPicker/types'

export const computeNextcloudFolderQueryId = ({
  sourceAccount,
  path
}: {
  sourceAccount: string
  path: string
}): string => {
  return `io.cozy.remote.nextcloud.files/sourceAccount/${sourceAccount}/path${path}`
}

/**
 * Checks if the given file is a Nextcloud shortcut.
 *
 * @param file - The file object to check.
 * @returns - Returns true if the file is a Nextcloud shortcut, false otherwise.
 */
export const isNextcloudShortcut = (file: IOCozyFile): boolean => {
  return (
    isShortcut(file) &&
    file.cozyMetadata?.createdByApp === 'nextcloud' &&
    flag('drive.show-nextcloud-dev')
  )
}

export const isNextcloudFile = (
  file: File | FolderPickerEntry
): file is NextcloudFile => {
  return file._type === 'io.cozy.remote.nextcloud.files'
}
