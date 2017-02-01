import styles from '../styles/photo'

import React from 'react'
import { Link, withRouter } from 'react-router'

import { STACK_FILES_DOWNLOAD_PATH } from '../constants/config'

export const Photo = ({ photo, router }) => {
  const parentPath = router.location.pathname
  return (
    <Link to={`${parentPath}/${photo._id}`}>
      <img
        className={styles['pho-photo-item']}
        src={`${STACK_FILES_DOWNLOAD_PATH}/${photo._id}`}
      />
    </Link>
  )
}

export default withRouter(Photo)
