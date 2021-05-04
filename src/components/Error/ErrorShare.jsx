import React from 'react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Empty } from 'cozy-ui/transpiled/react'
import CloudBrokenIcon from 'cozy-ui/transpiled/react/Icons/CloudBroken'

export const ErrorShare = ({ errorType }) => {
  const { t } = useI18n()
  return (
    <Empty
      data-test-id="empty-share"
      icon={CloudBrokenIcon}
      title={t(`Error.${errorType}_title`)}
      text={t(`Error.${errorType}_text`)}
    />
  )
}

export default ErrorShare
