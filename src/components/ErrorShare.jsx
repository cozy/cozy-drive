import styles from '../styles/emptyAndError'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

export const ErrorShare = ({ t, errorType }) => {
  return (
    <div className={styles['pho-errorShare']}>
      <h2>{ t(`Error.${errorType}_title`) }</h2>
      <p>{ t(`Error.${errorType}_text`)}</p>
    </div>
  )
}

const TranslatedError = translate()(ErrorShare)

export const withError = (onError, type, BaseComponent) => props =>
  onError(props)
    ? <TranslatedError errorType={type} />
    : <BaseComponent {...props} />

export default TranslatedError
