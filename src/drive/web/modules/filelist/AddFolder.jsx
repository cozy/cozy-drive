import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import compose from 'lodash/flowRight'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { TableRow, TableCell } from 'cozy-ui/transpiled/react/Table'

import FilenameInput from 'drive/web/modules/filelist/FilenameInput'
import {
  isTypingNewFolderName,
  hideNewFolderInput,
  isEncryptedFolder
} from 'drive/web/modules/filelist/duck'
import { createFolder } from 'drive/web/modules/navigation/duck'
import FileThumbnail from 'drive/web/modules/filelist/FileThumbnail'
import { Empty as EmptyCell } from 'drive/web/modules/filelist/cells'

import styles from 'drive/styles/filelist.styl'

const AddFolder = ({
  f,
  visible,
  isEncrypted,
  onSubmit,
  onAbort,
  extraColumns,
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

const mapStateToProps = state => ({
  visible: isTypingNewFolderName(state),
  isEncrypted: isEncryptedFolder(state)
})

const createFolderAfterSubmit =
  (ownProps, name) => async (dispatch, getState) => {
    return dispatch(
      createFolder(
        ownProps.client,
        ownProps.vaultClient,
        name,
        ownProps.currentFolderId,
        {
          isEncryptedFolder: isEncryptedFolder(getState())
        }
      )
    ).then(() => {
      if (ownProps.refreshFolderContent) ownProps.refreshFolderContent()
      return dispatch(hideNewFolderInput())
    })
  }

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: name => dispatch(createFolderAfterSubmit(ownProps, name)),
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
  connect(mapStateToProps, mapDispatchToProps),
  withBreakpoints()
)(AddFolder)
