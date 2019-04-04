const getHomeLinkHref = from =>
  `https://manager.cozycloud.cc/cozy/create${
    from ? `?pk_campaign=${encodeURIComponent(from)}` : '?'
  }&pk_kwd=cozy`

export default getHomeLinkHref
