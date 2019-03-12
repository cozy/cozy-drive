const getHomeLinkHref = from =>
  `https://manager.cozycloud.cc/cozy/create${
    from ? `?pk_campaign=${encodeURIComponent(from)}` : ''
  }`

export default getHomeLinkHref
