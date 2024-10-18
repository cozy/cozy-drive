import type { IOCozyFile } from 'cozy-client/types/types'
import flag from 'cozy-flags'

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
    file.cozyMetadata?.createdByApp === 'nextcloud' &&
    flag('drive.show-nextcloud-dev')
  )
}
