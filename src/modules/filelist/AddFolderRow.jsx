import React from 'react'
import cx from 'classnames'

import { TableRow, TableCell } from 'cozy-ui/transpiled/react/Table'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import FilenameInput from 'modules/filelist/FilenameInput'
import FileThumbnail from 'modules/filelist/FileThumbnail'
import { Empty as EmptyCell } from 'modules/filelist/cells'

import styles from 'styles/filelist.styl'

const AddFolderRow = ({ isEncrypted, onSubmit, onAbort, extraColumns }) => {
  const { f } = useI18n()
  const { isMobile } = useBreakpoints()

  return (
    <TableRow className={styles['fil-content-row']}>
      <TableCell
        className={cx(
          styles['fil-content-cell'],
          styles['fil-content-file-select']
        )}
      />
      <TableCell
        className={cx(
          styles['fil-content-cell'],
          styles['fil-file-thumbnail'],
          {
            'u-pl-0': !isMobile
          }
        )}
      >
        <FileThumbnail file={{ type: 'directory' }} isEncrypted={isEncrypted} />
      </TableCell>
      <TableCell
        className={cx(styles['fil-content-cell'], styles['fil-content-file'])}
      >
        <FilenameInput onSubmit={onSubmit} onAbort={onAbort} />
      </TableCell>
      {!isMobile && (
        <>
          <TableCell
            className={cx(
              styles['fil-content-cell'],
              styles['fil-content-date']
            )}
          >
            <time dateTime="">{f(Date.now(), 'MMM D, YYYY')}</time>
          </TableCell>
          <EmptyCell className={styles['fil-content-size']} />
          {extraColumns &&
            extraColumns.map(column => (
              <EmptyCell
                key={column.label}
                className={styles['fil-content-narrow']}
              />
            ))}
          <EmptyCell className={styles['fil-content-status']} />
        </>
      )}
      <TableCell
        className={cx(
          styles['fil-content-cell'],
          styles['fil-content-file-action']
        )}
      />
    </TableRow>
  )
}

export { AddFolderRow }
