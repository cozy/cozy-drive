import React from 'react'

import 'photos/styles/main.styl'
import 'cozy-sharing/dist/stylesheet.css'

import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
const StyledApp = ({ children }) => {
  return <CozyTheme className="u-w-100">{children}</CozyTheme>
}
export default StyledApp
