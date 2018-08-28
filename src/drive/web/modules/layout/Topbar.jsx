/* global __TARGET__ */
import React from 'react'
import classNames from 'classnames'

import styles from 'drive/styles/topbar'

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
