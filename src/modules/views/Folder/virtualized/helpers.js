export const makeRows = ({ queryResults, IsAddingFolder, syncingFakeFile }) => {
  const rows = queryResults.flatMap(el => el.data)
  if (IsAddingFolder) {
    rows.push({
      type: 'tempDirectory'
      // isEncrypted: isEncryptedFolderFromState
    })
  }
  if (syncingFakeFile) {
    rows.push(syncingFakeFile)
  }
  return rows
}
