export const getSharingIdFromUrl = url => {
  const urlSearchParams = new URLSearchParams(url.search)
  return urlSearchParams.get('sharing')
}
