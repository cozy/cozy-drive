import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Empty from 'cozy-ui/transpiled/react/Empty'
import CozyIcon from 'cozy-ui/transpiled/react/Icons/Cozy'
import { DialogContent } from 'cozy-ui/transpiled/react/Dialog'

import Title from 'drive/web/modules/views/OnlyOffice/Title'

const Error = () => {
  const { t } = useI18n()

  return (
    <>
      <Title />
      <DialogContent className="u-flex u-flex-items-center u-flex-justify-center">
        <Empty
          layout={false}
          icon={CozyIcon}
          title={t('OnlyOffice.Error.title')}
          text={t('OnlyOffice.Error.text')}
        />
      </DialogContent>
    </>
  )
}

export default Error
