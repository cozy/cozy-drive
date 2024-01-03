import React from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import DesertIllustration from 'assets/icons/illustrations-desert.svg'

const NotFound = () => {
  const { t } = useI18n()

  return (
    <Empty
      icon={DesertIllustration}
      title={t('NotFound.title')}
      text={t('NotFound.text')}
    />
  )
}

export { NotFound }
