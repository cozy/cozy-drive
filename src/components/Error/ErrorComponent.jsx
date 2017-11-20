import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import classNames from 'classnames'

import styles from './empty'

export const ErrorComponent = ({ t, errorType }) => {
  return (
    <div className={styles['pho-error']}>
      <h2>{t(`Error.${errorType}_title`)}</h2>
      <button
        role="button"
        className={classNames(styles['c-btn'], styles['c-btn--regular'])}
        onClick={() => window.location.reload()}
      >
        {t('Error.refresh')}
      </button>
    </div>
  )
}

const TranslatedError = translate()(ErrorComponent)

export const withError = (onError, type, BaseComponent) => props =>
  onError(props) ? (
    <TranslatedError errorType={type} />
  ) : (
    <BaseComponent {...props} />
  )

export default TranslatedError
