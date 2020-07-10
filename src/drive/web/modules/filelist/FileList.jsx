import React from 'react'

import styles from 'drive/styles/filelist.styl'

export const FileList = ({ children }) => (
  <div className={styles['fil-content-table']} role="table">
    {children}
  </div>
)
