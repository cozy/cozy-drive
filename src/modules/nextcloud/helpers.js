import flag from 'cozy-flags'

export const computeNextcloudFolderQueryId = ({ sourceAccount, path }) => {
  return `io.cozy.remote.nextcloud.files/sourceAccount/${sourceAccount}/path${path}`
}

/**
 * Checks if the given file is a Nextcloud shortcut.
 *
 * @param {import('cozy-client/types/types').IOCozyFile} file - The file object to check.
 * @returns {boolean} - Returns true if the file is a Nextcloud shortcut, false otherwise.
 */
export const isNextcloudShortcut = file => {
  return (
    file.cozyMetadata?.createdByApp === 'nextcloud' &&
    flag('drive.show-nextcloud-dev')
  )
}
