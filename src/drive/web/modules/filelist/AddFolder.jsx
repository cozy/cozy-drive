import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { translate } from 'cozy-ui/react/I18n'
import Alerter from 'cozy-ui/react/Alerter'
import FilenameInput from 'drive/web/modules/filelist/FilenameInput'
import {
  isTypingNewFolderName,
  hideNewFolderInput
} from 'drive/web/modules/filelist/duck'
import { createFolder } from 'drive/web/modules/navigation/duck'
import styles from 'drive/styles/filelist.styl'

const AddFolder = ({ f, visible, onSubmit, onAbort }) =>
  !visible ? null : (
    <div className={styles['fil-content-row']}>
      <div
        className={classNames(
          styles['fil-content-cell'],
          styles['fil-content-file-select']
        )}
      />
      <div
        className={classNames(
          styles['fil-content-cell'],
          styles['fil-content-file'],
          styles['fil-file-folder']
        )}
      >
        <FilenameInput onSubmit={onSubmit} onAbort={onAbort} />
      </div>
      <div
        className={classNames(
          styles['fil-content-cell'],
          styles['fil-content-date']
        )}
      >
        <time dateTime="">{f(Date.now(), 'MMM D, YYYY')}</time>
      </div>
      <div
        className={classNames(
          styles['fil-content-cell'],
          styles['fil-content-size']
        )}
      >
        —
      </div>
      <div
        className={classNames(
          styles['fil-content-cell'],
          styles['fil-content-status']
        )}
      >
        —
      </div>
      <div
        className={classNames(
          styles['fil-content-cell'],
          styles['fil-content-file-action']
        )}
      />
    </div>
  )

const mapStateToProps = state => ({
  visible: isTypingNewFolderName(state)
})

const mapDispatchToProps = dispatch => ({
  onSubmit: name =>
    dispatch(createFolder(name)).then(() => dispatch(hideNewFolderInput())),
  onAbort: accidental => {
    if (accidental) {
      Alerter.info('alert.folder_abort')
    }
    dispatch(hideNewFolderInput())
  }
})

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddFolder)
)
