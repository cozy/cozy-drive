import PropTypes from 'prop-types'
import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const LastUpdateVz = ({ date, formatted }) => {
  const { f, t } = useI18n()

  return (
    <time dateTime={date} title={f(date, t('LastUpdate.titleFormat'))}>
      {formatted}
    </time>
  )
}

LastUpdateVz.propTypes = {
  date: PropTypes.string,
  formatted: PropTypes.string
}

export default React.memo(LastUpdateVz)
