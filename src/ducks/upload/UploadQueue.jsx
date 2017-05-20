import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { translate } from '../../lib/I18n'

import styles from './styles'
import { getUploadQueue, getProcessed } from '.'

const splitFilename = filename => {
  const dotIdx = filename.lastIndexOf('.') - 1 >>> 0
  return {
    extension: filename.slice(dotIdx + 1),
    filename: filename.slice(0, dotIdx + 1)
  }
}

const Pending = translate()(
  props => <span className={styles['item-pending']}>{props.t('UploadQueue.item.pending')}</span>
)

const Item = translate()(({ t, file, status }) => {
  const { filename, extension } = splitFilename(file)
  return (
    <div className={styles['upload-queue-item']}>
      <div className={classNames(styles['item-cell'], styles['item-file'], styles['item-image'])}>
        <div>
          {filename}
          {extension && <span className={styles['item-ext']}>{extension}</span>}
        </div>
      </div>
      <div className={styles['item-status']}>
        {status === 'pending' ? <Pending /> : <div className={styles[`item-${status}`]} />}
      </div>
    </div>
  )
})

const UploadQueue = ({ t, queue, doneCount }) => {
  //if (queue.length === 0) return null
  return (
    <div className={classNames(
      styles['upload-queue'],
      { [styles['upload-queue--visible']]: queue.length !== 0 }
    )}>
      <h4 className={styles['upload-queue-header']}>
        {t('UploadQueue.header', { smart_count: queue.length })}
      </h4>
      <progress className={styles['upload-queue-progress']} value={doneCount} max={queue.length} />
      <div className={styles['upload-queue-content']}>
        <div className={styles['upload-queue-list']}>
          {queue.map(item => <Item file={item.file.name} status={item.status} />)}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  queue: getUploadQueue(state),
  doneCount: getProcessed(state).length
})
export default translate()(connect(mapStateToProps)(UploadQueue))
