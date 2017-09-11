/* global __TARGET__ */

import styles from '../styles/main'

import React from 'react'

import BannerClient from '../../layout/pushClient/Banner'

const Main = ({ children }) => (
  <main class={styles['fil-content']}>
    { __TARGET__ !== 'mobile' && <BannerClient />}
    {children}
  </main>
)

export default Main
