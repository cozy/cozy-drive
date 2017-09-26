import styles from '../styles/table'

import React from 'react'

const Preview = ({ thumbnail }) => (
  <div
    className={styles['fil-file-preview']}
    style={`background-image: url(${thumbnail});`}
  />
)

export default Preview
