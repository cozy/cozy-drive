import React, { createContext, useContext, useState } from 'react'

const PushBannerContext = createContext()

/**
 * This provider allows you to hide banners while browsing the site
 */
const PushBannerProvider = ({ children }) => {
  const [bannerDismissed, setBannerDimissed] = useState({
    quota: false
  })

  const dismissPushBanner = name => {
    if (name === 'quota') {
      setBannerDimissed({
        ...bannerDismissed,
        quota: true
      })
    }
  }

  return (
    <PushBannerContext.Provider value={{ bannerDismissed, dismissPushBanner }}>
      {children}
    </PushBannerContext.Provider>
  )
}

export default PushBannerProvider

export const usePushBannerContext = () => useContext(PushBannerContext)
