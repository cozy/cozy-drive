import React from 'react'

import 'cozy-sharing/dist/stylesheet.css'
// eslint-disable-next-line
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
// ambient styles
// eslint-disable-next-line no-unused-vars
import mainStyles from 'styles/main.styl'
const StyledApp = ({ children }) => {
  return <CozyTheme className="u-w-100">{children}</CozyTheme>
}
export default StyledApp
