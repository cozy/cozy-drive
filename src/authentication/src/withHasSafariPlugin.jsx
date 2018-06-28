// TODO: Remove this file and use cozy-device-helper

import React, { PureComponent } from 'react'

const WEB_PLATFORM = 'web'
const IOS_PLATFORM = 'ios'
const isCordova = () => window.cordova !== undefined
const getPlatform = () =>
  isCordova() ? window.cordova.platformId : WEB_PLATFORM
const isPlatform = platform => getPlatform() === platform
export const isIOSApp = () => isPlatform(IOS_PLATFORM)

export const hasSafariPlugin = () => {
  return new Promise(resolve => {
    if (!isCordova() || window.SafariViewController === undefined) {
      resolve(false)
      return
    }

    window.SafariViewController.isAvailable(available => resolve(available))
  })
}

export const withHasSafariPlugin = eventHandlers => {
  return WrappedComponent => {
    return class withHasSafariPluginComponent extends PureComponent {
      state = {
        hasSafariPlugin: false
      }

      checkSafariPlugin = async () => {
        if (isIOSApp) {
          const checked = await hasSafariPlugin()
          this.setState({ hasSafariPlugin: checked })
        }
      }

      componentDidMount() {
        this.checkSafariPlugin()
      }

      render() {
        return <WrappedComponent {...this.props} {...this.state} />
      }
    }
  }
}

export default withHasSafariPlugin
