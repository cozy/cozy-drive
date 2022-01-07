import React from 'react'

import 'cozy-sharing/dist/stylesheet.css'
// eslint-disable-next-line
import mainStyles from 'drive/styles/main.styl'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
const StyledApp = ({ children }) => {
  return <MuiCozyTheme>{children}</MuiCozyTheme>
}
export default StyledApp
