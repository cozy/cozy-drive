import { generateWebLink } from 'cozy-client'

const generateShortcutUrl = ({
  file,
  client,
  isFlatDomain,
  fromPublicFolder
}) => {
  const currentURL = new URL(window.location)
  let webLink = ''
  if (fromPublicFolder) {
    webLink = generateWebLink({
      cozyUrl: client.getStackClient().uri,
      pathname: currentURL.pathname,
      slug: 'drive',
      hash: `external/${file.id}`,
      searchParams: currentURL.searchParams,
      subDomainType: isFlatDomain ? 'flat' : 'nested'
    })
  } else {
    webLink = generateWebLink({
      cozyUrl: client.getStackClient().uri,
      pathname: '/',
      slug: 'drive',
      hash: `external/${file.id}`,
      subDomainType: isFlatDomain ? 'flat' : 'nested'
    })
  }
  return webLink
}

export default generateShortcutUrl
