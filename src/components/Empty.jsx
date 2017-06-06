import styles from '../styles/emptyAndError'

import React from 'react'
import { translate } from '../lib/I18n'

export const Empty = ({ t, emptyType }) => {
  return (
    <div className={styles['pho-empty']}>
      <h2>{ t(`Empty.${emptyType}_title`) }</h2>
      <p>{ t(`Empty.${emptyType}_text`)}</p>
    </div>
  )
}

const TranslatedEmpty = translate()(Empty)

export const withEmpty = (isEmpty, type, BaseComponent) => props =>
  isEmpty(props)
    ? <TranslatedEmpty emptyType={type} />
    : <BaseComponent {...props} />

export default TranslatedEmpty
