import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Empty, Button } from 'cozy-ui/react'
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

export const withError = (onError, type, BaseComponent) => props =>
  onError(props) ? (
    <TranslatedError errorType={type} />
  ) : (
    <BaseComponent {...props} />
  )

export default TranslatedError
