import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import { getFileMimetype } from 'drive/lib/getFileMimetype'

import styles from './styles'
import {
  getUploadQueue,
  getProcessed,
  getSuccessful,
  purgeUploadQueue
} from '.'

const splitFilename = filename => {
  const dotIdx = (filename.lastIndexOf('.') - 1) >>> 0
  return {
    extension: filename.slice(dotIdx + 1),
    filename: filename.slice(0, dotIdx + 1)
  }
}

const getFileTypeClass = (file, isDirectory) => {
  if (isDirectory) {
    return styles['item-type-folder']
  }
  return styles[
    'item-type-' +
      (getFileMimetype(styles, 'item-type-')(file.type, file.name) || 'files')
  ]
}

const Pending = translate()(props => (
  <span className={styles['item-pending']}>
    {props.t('UploadQueue.item.pending')}
  </span>
))

const Item = translate()(({ file, status, isDirectory }) => {
  const { filename, extension } = splitFilename(file.name)
  return (
    <div
      className={classNames(styles['upload-queue-item'], {
        [styles['upload-queue-item--done']]: status === 'loaded',
        [styles['upload-queue-item--error']]:
          status === 'failed' || status === 'conflict' || status === 'network'
      })}
    >
      <div
        className={classNames(
          styles['item-cell'],
          styles['item-file'],
          getFileTypeClass(file, isDirectory)
        )}
      >
        <div>
          {filename}
          {extension && <span className={styles['item-ext']}>{extension}</span>}
        </div>
      </div>
      <div className={styles['item-status']}>
        {status === 'pending' ? (
          <Pending />
        ) : (
          <div className={styles[`item-${status}`]} />
        )}
      </div>
    </div>
  )
})

class UploadQueue extends Component {
  state = {
    collapsed: false
  }

  toggleCollapsed = () => {
    this.setState(state => ({ collapsed: !state.collapsed }))
  }

  render() {
    const { t, queue, doneCount, successCount, purgeQueue } = this.props
    const { collapsed } = this.state
    return (
      <div
        data-test-id="uploadQueue"
        className={classNames(styles['upload-queue'], {
          [styles['upload-queue--visible']]: queue.length !== 0,
          [styles['upload-queue--collapsed']]: collapsed
        })}
      >
        <h4
          className={styles['upload-queue-header']}
          onDoubleClick={this.toggleCollapsed}
        >
          {doneCount < queue.length && (
            <div className={styles['upload-queue-header-inner']}>
              <span className={styles['u-hide--mob']}>
                {t('UploadQueue.header', { smart_count: queue.length })}
              </span>
              <span className={styles['u-hide--desk']}>
                {t('UploadQueue.header_mobile', {
                  done: doneCount,
                  total: queue.length
                })}
              </span>
            </div>
          )}
          {doneCount >= queue.length && (
            <div
              data-test-id="uploadQueue-success"
              className={styles['upload-queue-header-inner']}
            >
              <span>
                {t('UploadQueue.header_done', {
                  done: successCount,
                  total: queue.length
                })}
              </span>
              <button
                className={classNames(styles['btn-close'])}
                onClick={purgeQueue}
              >
                {t('UploadQueue.close')}
              </button>
            </div>
          )}
        </h4>
        <progress
          className={styles['upload-queue-progress']}
          value={doneCount}
          max={queue.length}
        />
        <div className={styles['upload-queue-content']}>
          <div className={styles['upload-queue-list']}>
            {queue.map((item, index) => (
              <Item
                key={`key_queue_${index}`}
                file={item.file}
                isDirectory={item.isDirectory}
                status={item.status}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  queue: getUploadQueue(state),
  doneCount: getProcessed(state).length,
  successCount: getSuccessful(state).length
})
const mapDispatchToProps = dispatch => ({
  purgeQueue: () => dispatch(purgeUploadQueue())
})
export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UploadQueue)
)
