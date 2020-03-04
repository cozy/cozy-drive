import React from 'react'
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-sharing/dist/stylesheet.css'
//eslint-disable-next-line
import mainStyles from 'drive/styles/main.styl'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
const StyleApp = ({ children }) => {
  return <MuiCozyTheme>{children}</MuiCozyTheme>
}
export default StyleApp
