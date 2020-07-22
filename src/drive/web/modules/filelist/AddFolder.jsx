import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withClient } from 'cozy-client'
import compose from 'lodash/flowRight'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import Alerter from 'cozy-ui/transpiled/react/Alerter'
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
    <div className={styles['fil-content-row']}>
      <Cell className={styles['fil-content-file-select']} />
      <FileThumbnail file={{ type: 'directory' }} />
      <Cell className={classNames(styles['fil-content-file'])}>
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
    </div>
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
