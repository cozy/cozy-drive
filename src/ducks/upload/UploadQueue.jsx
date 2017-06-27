import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'

import styles from './styles'
import { getUploadQueue, getProcessed, getSuccessful, purgeUploadQueue } from '.'

const splitFilename = filename => {
  const dotIdx = filename.lastIndexOf('.') - 1 >>> 0
  return {
    extension: filename.slice(dotIdx + 1),
    filename: filename.slice(0, dotIdx + 1)
  }
}

const getFileTypeClass = mime => {
  return styles['item-type-' + mime.split('/')[0]] || styles['item-type-files']
}

const Pending = translate()(
  props => <span className={styles['item-pending']}>{props.t('UploadQueue.item.pending')}</span>
)

const Item = translate()(({ t, file, status, type }) => {
  const { filename, extension } = splitFilename(file)
  return (
    <div className={classNames(styles['upload-queue-item'], {
      [styles['upload-queue-item--done']]: status === 'loaded',
      [styles['upload-queue-item--error']]: status === 'failed' || status === 'conflict'
    })}>
      <div className={classNames(styles['item-cell'], styles['item-file'], getFileTypeClass(type))}>
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

class UploadQueue extends Component {
  state = {
    collapsed: false
  }

  toggleCollapsed = () => {
    this.setState(state => ({ collapsed: !state.collapsed }))
  }

  render () {
    const { t, queue, doneCount, successCount, purgeQueue } = this.props
    const { collapsed } = this.state
    return (
      <div className={classNames(styles['upload-queue'], {
        [styles['upload-queue--visible']]: queue.length !== 0,
        [styles['upload-queue--collapsed']]: collapsed
      })}>
        <h4 className={styles['upload-queue-header']} onDoubleClick={this.toggleCollapsed}>
          {
            doneCount < queue.length
            ? <div>
              <span className='coz-desktop'>
                {t('UploadQueue.header', { smart_count: queue.length })}
              </span>
              <span className='coz-mobile'>
                {t('UploadQueue.header_mobile', { done: doneCount, total: queue.length })}
              </span>
            </div>
            : <span>
              {t('UploadQueue.header_done', { done: successCount, total: queue.length })}
            </span>
          }
          <button className={classNames(styles['btn-close'])} onClick={purgeQueue}>
            { t('UploadQueue.close') }
          </button>
        </h4>
        <progress className={styles['upload-queue-progress']} value={doneCount} max={queue.length} />
        <div className={styles['upload-queue-content']}>
          <div className={styles['upload-queue-list']}>
            {queue.map(item => <Item file={item.file.name} type={item.file.type} status={item.status} />)}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  queue: getUploadQueue(state),
  doneCount: getProcessed(state).length,
  successCount: getSuccessful(state).length
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  purgeQueue: () => dispatch(purgeUploadQueue())
})
export default translate()(connect(mapStateToProps, mapDispatchToProps)(UploadQueue))
