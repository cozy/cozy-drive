import styles from '../styles/empty'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

export const ErrorShare = ({ t, errorType }) => {
  return (
    <div className={styles['fil-errorShare']}>
      <h2>{t(`error.${errorType}_title`)}</h2>
      <p>{t(`error.${errorType}_text`)}</p>
    </div>
  )
}

export default translate()(ErrorShare)
