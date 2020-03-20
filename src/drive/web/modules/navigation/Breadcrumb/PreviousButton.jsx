import React from 'react'
import styles from 'drive/web/modules/navigation/Breadcrumb/breadcrumb.styl'

export const PreviousButton = ({ onClick }) => (
  <button className={styles['fil-path-previous']} onClick={onClick} />
)

export default PreviousButton
