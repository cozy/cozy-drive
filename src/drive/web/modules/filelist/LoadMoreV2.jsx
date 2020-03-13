import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import styles from 'drive/styles/filelist.styl'

const LoadMoreFiles = ({ fetchMore }) => {
  const { t } = useI18n()
  return (
    <div
      className={cx(
        styles['fil-content-row'],
        styles['fil-content-row--center']
      )}
    >
      <LoadMore fetchMore={fetchMore} label={t('table.load_more')} />
    </div>
  )
}

LoadMoreFiles.propTypes = {
  fetchMore: PropTypes.func.isRequired
}

export default LoadMoreFiles
