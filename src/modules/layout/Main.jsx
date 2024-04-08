import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import { Main as MainUI } from 'cozy-ui/transpiled/react/Layout'

import PushBanner from 'components/PushBanner'
import styles from 'styles/main.styl'

const Main = ({ children, isPublic = false }) => (
  <MainUI
    className={classNames({
      [styles['fil-content']]: !isPublic
    })}
  >
    <PushBanner isPublic={isPublic} />
    {children}
  </MainUI>
)

Main.propTypes = {
  isPublic: PropTypes.bool,
  children: PropTypes.array
}
export default Main
