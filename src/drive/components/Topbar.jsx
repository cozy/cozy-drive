/* global __TARGET__ */
import styles from '../styles/topbar'

import React from 'react'
import classNames from 'classnames'

const Topbar = ({ children }) => (
  <div
    className={classNames(styles['fil-topbar'], {
      [styles['mobile']]: __TARGET__ === 'mobile'
    })}
  >
    {children}
  </div>
)

export default Topbar
