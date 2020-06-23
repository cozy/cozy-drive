import React from 'react'
import cx from 'classnames'
import styles from 'drive/styles/filelist.styl'

const Cell = ({ className, ...props }) => {
  return (
    <div className={cx(styles['fil-content-cell'], className)} {...props} />
  )
}

export default Cell
