/* global __TARGET__ */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Main as MainUI } from 'cozy-ui/transpiled/react/Layout'
import { isFlagshipApp } from 'cozy-device-helper'
import BannerClient from 'components/pushClient/Banner'

import styles from 'drive/styles/main.styl'

const Main = ({ children, isPublic = false }) => (
  <MainUI
    className={classNames({
      [styles['fil-content']]: !isPublic
    })}
  >
    {__TARGET__ !== 'mobile' && !isPublic && !isFlagshipApp() && (
      <BannerClient />
    )}
    {children}
  </MainUI>
)

Main.propTypes = {
  isPublic: PropTypes.bool,
  children: PropTypes.array
}
export default Main
