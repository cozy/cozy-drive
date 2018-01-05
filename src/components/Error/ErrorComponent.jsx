import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react'

import styles from './empty.styl'

export const ErrorComponent = ({ t, errorType }) => {
  return (
    <div className={styles['c-error']}>
      <h2>{t(`Error.${errorType}_title`)}</h2>
      <Button onClick={() => window.location.reload()}>
        {t('Error.refresh')}
      </Button>
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
