import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import { TableRow } from 'cozy-ui/transpiled/react/deprecated/Table'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from 'styles/filelist.styl'

const LoadMoreFiles = ({ fetchMore }) => {
  const { t } = useI18n()
  return (
    <TableRow
      className={cx(
        styles['fil-content-row'],
        styles['fil-content-row--center']
      )}
    >
      <LoadMore fetchMore={fetchMore} label={t('table.load_more')} />
    </TableRow>
  )
}

LoadMoreFiles.propTypes = {
  fetchMore: PropTypes.func.isRequired
}

export default LoadMoreFiles
