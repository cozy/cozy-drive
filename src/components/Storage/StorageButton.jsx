import cx from 'classnames'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TwakeWorkplaceIcon from 'cozy-ui/transpiled/react/Icons/TwakeWorkplace'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const StorageButton = ({ className }) => {
  const { t, lang } = useI18n()
  const _lang = ['en', 'fr', 'es'].includes(lang) ? lang : 'en'

  return (
    <Button
      className={cx('u-bdrs-4', className)}
      variant="secondary"
      label={t('Storage.increase')}
      startIcon={<Icon icon={TwakeWorkplaceIcon} size={22} />}
      size="small"
      height="auto"
      fullWidth
      onClick={() => window.open(`https://cozy.io/${_lang}/pricing/`)}
    />
  )
}

export default StorageButton
