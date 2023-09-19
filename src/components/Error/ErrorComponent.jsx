import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import EmptyIcon from '../../photos/assets/icons/icon-image-broken.svg'

export const ErrorComponent = ({ t, errorType }) => {
  return (
    <Empty title={t(`Error.${errorType}_title`)} icon={EmptyIcon}>
      <Button
        onClick={() => window.location.reload()}
        label={t('Error.refresh')}
      />
    </Empty>
  )
}

const TranslatedError = translate()(ErrorComponent)

// eslint-disable-next-line
export const withError = (onError, type, BaseComponent) => props =>
  onError(props) ? (
    <TranslatedError errorType={type} />
  ) : (
    <BaseComponent {...props} />
  )

export default TranslatedError
