import React from 'react'
import classNames from 'classnames'

import styles from 'styles/topbar.styl'

const Topbar = ({ children, hideOnMobile = true }) => (
  <div
    className={classNames(styles['fil-topbar'], {
      [styles['hidden-mobile']]: hideOnMobile
    })}
  >
    {children}
  </div>
)

export default Topbar
