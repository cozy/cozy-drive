import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import compose from 'lodash/flowRight'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { TableRow, TableCell } from 'cozy-ui/transpiled/react/Table'

import FilenameInput from 'drive/web/modules/filelist/FilenameInput'
import {
  isTypingNewFolderName,
  hideNewFolderInput
} from 'drive/web/modules/filelist/duck'
import { createFolder } from 'drive/web/modules/navigation/duck'
import FileThumbnail from 'drive/web/modules/filelist/FileThumbnail'

import styles from 'drive/styles/filelist.styl'

const AddFolder = ({
  f,
  visible,
  onSubmit,
  onAbort,
  additionalColumns,
  breakpoints: { isMobile }
}) =>
  !visible ? null : (
    <TableRow className={styles['fil-content-row']}>
      <TableCell
        className={cx(
          styles['fil-content-cell'],
          styles['fil-content-file-select']
        )}
      />
      <FileThumbnail file={{ type: 'directory' }} />
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
          <TableCell
            className={cx(
              styles['fil-content-cell'],
              styles['fil-content-size']
            )}
          >
            —
          </TableCell>
          {!isMobile &&
            additionalColumns &&
            additionalColumns.map(column => (
              <TableCell
                key={column.label}
                className={cx(
                  styles['fil-content-cell'],
                  styles['fil-content-certification']
                )}
              >
                —
              </TableCell>
            ))}
          <TableCell
            className={cx(
              styles['fil-content-cell'],
              styles['fil-content-status']
            )}
          >
            —
          </TableCell>
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

const mapStateToProps = state => ({
  visible: isTypingNewFolderName(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: name => {
    return dispatch(createFolder(ownProps.client, name)).then(() => {
      if (ownProps.refreshFolderContent) ownProps.refreshFolderContent()
      return dispatch(hideNewFolderInput())
    })
  },
  onAbort: accidental => {
    if (accidental) {
      Alerter.info('alert.folder_abort')
    }
    dispatch(hideNewFolderInput())
  }
})

export { AddFolder }

export default compose(
  withClient,
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withBreakpoints()
)(AddFolder)
