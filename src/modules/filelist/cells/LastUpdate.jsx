import cx from 'classnames'
import React from 'react'

import { TableCell } from 'cozy-ui/transpiled/react/deprecated/Table'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from 'styles/filelist.styl'

const _LastUpdate = ({ date, formatted = '—' }) => {
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

const LastUpdate = React.memo(_LastUpdate)

export default LastUpdate
