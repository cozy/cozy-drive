import styles from './empty'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

const Empty = ({ t, emptyType }) => {
  return (
    <div className={styles['pho-empty']}>
      <h2>{t(`Empty.${emptyType}_title`)}</h2>
      <p>{t(`Empty.${emptyType}_text`)}</p>
    </div>
  )
}

export default translate()(Empty)
