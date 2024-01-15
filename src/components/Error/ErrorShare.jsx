import React from 'react'

import { Empty } from 'cozy-ui/transpiled/react'
import CloudBrokenIcon from 'cozy-ui/transpiled/react/Icons/CloudBroken'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const ErrorShare = ({ errorType }) => {
  const { t } = useI18n()
  return (
    <Empty
      data-testid="empty-share"
      icon={CloudBrokenIcon}
      title={t(`Error.${errorType}_title`)}
      text={t(`Error.${errorType}_text`)}
    />
  )
}

export default ErrorShare
