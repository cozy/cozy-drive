import styles from '../styles/photo'

import React from 'react'

const STACK_FILES_DOWNLOAD_PATH = 'http://cozy.local:8080/files/download'

const Photo = ({ photo }) => {
  return (
    <img
      className={styles['pho-photo']}
      src={`${STACK_FILES_DOWNLOAD_PATH}/${photo._id}`}
    />
  )
}

export default Photo
