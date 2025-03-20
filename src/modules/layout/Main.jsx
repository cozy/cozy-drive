import PropTypes from 'prop-types'
import React from 'react'

import { Main as MainUI } from 'cozy-ui/transpiled/react/Layout'

import PushBanner from '@/components/PushBanner'

const Main = ({ children, isPublic = false }) => (
  <MainUI>
    <PushBanner isPublic={isPublic} />
    {children}
  </MainUI>
)

Main.propTypes = {
  isPublic: PropTypes.bool,
  children: PropTypes.array
}
export default Main
