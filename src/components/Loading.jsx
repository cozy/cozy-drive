import styles from '../styles/loading'

import React from 'react'

const Loading = ({ message }) => {
  return (
    <div className={styles['fil-loading']}>
      <p>{message}</p>
    </div>
  )
}

export default Loading
