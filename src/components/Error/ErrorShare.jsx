import styles from './empty.styl'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

export const ErrorShare = ({ t, errorType }) => {
  return (
    <div className={styles['c-error--share']}>
      <h2>{t(`Error.${errorType}_title`)}</h2>
      <p>{t(`Error.${errorType}_text`)}</p>
    </div>
  )
}

export default translate()(ErrorShare)
