import styles from './empty-photos'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

export const Empty = ({ t }) => {
  return (
    <div className={styles['pho-empty']}>
      <h2>{t(`Empty.albums_title`)}</h2>
      <p>{t(`Empty.albums_text`)}</p>
    </div>
  )
}

const TranslatedEmpty = translate()(Empty)

export const withEmpty = (isEmpty, BaseComponent) => props =>
  isEmpty(props) ? <TranslatedEmpty /> : <BaseComponent {...props} />

export default TranslatedEmpty
