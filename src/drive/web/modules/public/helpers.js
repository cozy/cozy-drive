export function isFilesIsFile(files) {
  return files.length === 1 && files[0].type === 'file'
}

export function openExternalLink(url) {
  window.open(url, '_blank')
}
