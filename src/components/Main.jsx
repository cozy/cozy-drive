import styles from '../styles/main'

import React from 'react'

const Main = ({ children }) => (
  <main class={styles['fil-content']}>
    {children}
  </main>
)

export default Main
