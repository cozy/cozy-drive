export const computeNextcloudFolderQueryId = ({ sourceAccount, path }) => {
  return `io.cozy.remote.nextcloud.files/sourceAccount/${sourceAccount}/path${path}`
}
