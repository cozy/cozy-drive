import React from 'react'
import React from 'react'

import 'cozy-ui/transpiled/react/stylesheet.css'
import 'photos/styles/main.styl'
import 'cozy-sharing/dist/stylesheet.css'

import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
const StyledApp = ({ children }) => {
  return <MuiCozyTheme>{children}</MuiCozyTheme>
}
export default StyledApp
