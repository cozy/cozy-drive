import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Empty } from 'cozy-ui/react'
import EmptyIcon from '../../photos/assets/icons/icon-cloud-wrong.svg'

export const ErrorShare = ({ t, errorType }) => {
  return (
    <Empty
      data-test-id="empty-share"
      icon={EmptyIcon}
      title={t(`Error.${errorType}_title`)}
      text={t(`Error.${errorType}_text`)}
    />
  )
}

export default translate()(ErrorShare)
