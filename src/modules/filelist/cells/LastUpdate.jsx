import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import { TableCell } from 'cozy-ui/transpiled/react/deprecated/Table'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '@/styles/filelist.styl'

const LastUpdate = ({ date, formatted = '—' }) => {
  const { f, t } = useI18n()

  return (
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-content-date'])}
      {...(formatted !== '—' && {
        title: f(date, t('LastUpdate.titleFormat'))
      })}
    >
      <time dateTime={date}>{formatted}</time>
    </TableCell>
  )
}

LastUpdate.propTypes = {
  date: PropTypes.string,
  formatted: PropTypes.string
}

export default React.memo(LastUpdate)
