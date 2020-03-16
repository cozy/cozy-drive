import React from 'react'
import styles from './breadcrumb.styl'

export const PreviousButton = ({ onClick }) => (
  <button className={styles['fil-path-previous']} onClick={onClick} />
)

export default PreviousButton
