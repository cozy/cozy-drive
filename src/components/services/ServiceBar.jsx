import styles from '../../styles/services'
import React from 'react'

const ServiceBar = ({title, iconPath, onCancel}) => (
  <header class={styles['coz-service-bar']}>
    <span class={styles['coz-icon']}>
      <img src={iconPath} />
    </span>
    <h1>{title}</h1>
    <span class='coz-btn coz-btn--close' role='close' onClick={() => onCancel()} />
  </header>
)

export default ServiceBar
