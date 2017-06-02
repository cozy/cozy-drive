/* global __TARGET__ */

import styles from '../styles/main'

import React from 'react'

import ButtonClientMobile from './ButtonClientMobile'

const Main = ({ children }) => (
  <main class={styles['fil-content']}>
    { __TARGET__ !== 'mobile' && <ButtonClientMobile />}
    {children}
  </main>
)

export default Main
