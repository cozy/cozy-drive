import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withClient } from 'cozy-client'
import flag from 'cozy-flags'
import compose from 'lodash/flowRight'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import FilenameInput from 'drive/web/modules/filelist/FilenameInput'
import {
  isTypingNewFolderName,
  hideNewFolderInput
} from 'drive/web/modules/filelist/duck'
import { createFolder, createFolderV2 } from 'drive/web/modules/navigation/duck'
import Cell from 'drive/web/modules/filelist/Cell'
import styles from 'drive/styles/filelist.styl'

const AddFolder = ({ f, visible, onSubmit, onAbort }) =>
  !visible ? null : (
    <div className={styles['fil-content-row']}>
      <Cell className={styles['fil-content-file-select']} />
      <Cell
        className={classNames(
          styles['fil-content-file'],
          styles['fil-file-folder']
        )}
      >
        <FilenameInput onSubmit={onSubmit} onAbort={onAbort} />
      </Cell>
      <Cell className={styles['fil-content-date']}>
        <time dateTime="">{f(Date.now(), 'MMM D, YYYY')}</time>
      </Cell>
      <Cell className={styles['fil-content-size']}>—</Cell>
      <Cell className={styles['fil-content-status']}>—</Cell>
      <Cell className={styles['fil-content-file-action']} />
    </div>
  )

const mapStateToProps = state => ({
  visible: isTypingNewFolderName(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: name => {
    if (flag('drive.client-migration.enabled')) {
      dispatch(createFolderV2(ownProps.client, name)).then(() => {
        if (ownProps.refreshFolderContent) ownProps.refreshFolderContent()
        return dispatch(hideNewFolderInput())
      })
    } else {
      dispatch(createFolder(name)).then(() => dispatch(hideNewFolderInput()))
    }
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
  )
)(AddFolder)
