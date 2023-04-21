export function isFilesIsFile(files) {
  return files.length === 1 && files[0].type === 'file'
}
