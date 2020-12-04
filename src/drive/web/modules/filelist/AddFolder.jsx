import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import compose from 'lodash/flowRight'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { TableRow } from 'cozy-ui/transpiled/react/Table'

import FilenameInput from 'drive/web/modules/filelist/FilenameInput'
import {
  isTypingNewFolderName,
  hideNewFolderInput
} from 'drive/web/modules/filelist/duck'
import { createFolder } from 'drive/web/modules/navigation/duck'
import Cell from 'drive/web/modules/filelist/Cell'
import styles from 'drive/styles/filelist.styl'
import FileThumbnail from 'drive/web/modules/filelist/FileThumbnail'

const AddFolder = ({
  f,
  visible,
  onSubmit,
  onAbort,
  breakpoints: { isMobile }
}) =>
  !visible ? null : (
    <TableRow className={styles['fil-content-row']}>
      <Cell className={styles['fil-content-file-select']} />
      <FileThumbnail file={{ type: 'directory' }} />
      <Cell className={cx(styles['fil-content-file'])}>
        <FilenameInput onSubmit={onSubmit} onAbort={onAbort} />
      </Cell>
      {!isMobile && (
        <>
          <Cell className={styles['fil-content-date']}>
            <time dateTime="">{f(Date.now(), 'MMM D, YYYY')}</time>
          </Cell>
          <Cell className={styles['fil-content-size']}>—</Cell>
          <Cell className={styles['fil-content-status']}>—</Cell>
        </>
      )}
      <Cell className={styles['fil-content-file-action']} />
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
