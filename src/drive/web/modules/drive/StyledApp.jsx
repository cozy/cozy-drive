import React from 'react'

import 'cozy-sharing/dist/stylesheet.css'
// eslint-disable-next-line
import mainStyles from 'styles/main.styl'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
const StyledApp = ({ children }) => {
  return <CozyTheme className="u-w-100">{children}</CozyTheme>
}
export default StyledApp
