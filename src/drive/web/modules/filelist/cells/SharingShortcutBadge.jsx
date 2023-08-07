import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { isSharingShortcutNew } from 'cozy-client/dist/models/file'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { TableCell } from 'cozy-ui/transpiled/react/Table'

import styles from 'drive/styles/filelist.styl'

const SharingShortcutBadge = ({ file }) => {
  const { t } = useI18n()

  return (
    <TableCell
      className={cx(
        styles['fil-content-cell'],
        styles['fil-content-sharing-shortcut']
      )}
    >
      {isSharingShortcutNew(file) ? (
        <div
          className="u-w-1 u-h-1 u-bdrs-circle u-flex"
          style={{ backgroundColor: 'var(--errorColor)' }}
        >
          <span
            className="u-fw-bold u-fz-tiny u-white u-lh-tiny u-m-auto"
            aria-label={t('table.row_sharing_shortcut_aria_label')}
          >
            1
          </span>
        </div>
      ) : null}
    </TableCell>
  )
}

SharingShortcutBadge.propTypes = {
  file: PropTypes.object,
  isInSyncFromSharing: PropTypes.bool
}

export { SharingShortcutBadge }
