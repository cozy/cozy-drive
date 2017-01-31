import React from 'react'
import styles from '../styles/breadcrumb'
import { translate } from '../lib/I18n'

const PageTitle = ({pathname, t}) => {
  let title
  switch (pathname) {
    case String(pathname.match(/^\/settings/)) :
      title = 'mobile.settings.title'
      break
    default:
      title = pathname
      break
  }
  return (
    <h2 class={styles['fil-content-title']}>
      <span>{t(title)}</span>
    </h2>
  )
}

export default translate()(PageTitle)
