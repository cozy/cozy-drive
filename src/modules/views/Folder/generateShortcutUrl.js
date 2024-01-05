import { generateWebLink } from 'cozy-client'

const generateShortcutUrl = ({ file, client, isFlatDomain }) => {
  const currentURL = new URL(window.location)
  let webLink = ''
  if (currentURL.pathname === '/public') {
    webLink = generateWebLink({
      cozyUrl: client.getStackClient().uri,
      pathname: '/public',
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
