import classNames from 'classnames'
import React from 'react'

import styles from 'styles/topbar.styl'

const Topbar = ({ children, hideOnMobile = true }) => (
  <div
    className={classNames('u-mb-1-half', styles['fil-topbar'], {
      [styles['hidden-mobile']]: hideOnMobile
    })}
  >
    {children}
  </div>
)

export default Topbar
