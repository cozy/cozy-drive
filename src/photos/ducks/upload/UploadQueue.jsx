import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Icon, Spinner } from 'cozy-ui/transpiled/react'
import palette from 'cozy-ui/stylus/settings/palette.json'
import CrossIcon from 'cozy-ui/transpiled/react/Icons/Cross'
import WarningIcon from 'cozy-ui/transpiled/react/Icons/Warning'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'

import { CozyFile } from 'models'

import styles from './styles.styl'
import {
  getUploadQueue,
  getProcessed,
  getSuccessful,
  purgeUploadQueue
} from '.'

const Pending = translate()(props => (
  <span className={styles['item-pending']}>
    {props.t('UploadQueue.item.pending')}
  </span>
))

const Item = translate()(({ file, status }) => {
  const { filename, extension } = CozyFile.splitFilename(file)
  let statusIcon
  switch (status) {
    case 'loading':
      statusIcon = (
        <Spinner className="u-ml-half" color={palette['dodgerBlue']} />
      )
      break
    case 'cancel':
      statusIcon = <Icon className="u-ml-half u-warn" icon={CrossIcon} />
      break
    case 'failed':
    case 'conflict':
    case 'network':
      statusIcon = <Icon className="u-ml-half u-warn" icon={WarningIcon} />
      break
    case 'loaded':
      statusIcon = <Icon className="u-ml-half u-valid" icon={CheckIcon} />
      break
    case 'pending':
    default:
      statusIcon = <Pending />
      break
  }
  return (
    <div
      className={classNames(styles['upload-queue-item'], {
        [styles['upload-queue-item--done']]: status === 'loaded',
        [styles['upload-queue-item--error']]:
          status === 'failed' || status === 'conflict'
      })}
    >
      <div
        className={classNames(
          styles['item-cell'],
          styles['item-file'],
          styles['item-image']
        )}
      >
        <div>
          {filename}
          {extension && <span className={styles['item-ext']}>{extension}</span>}
        </div>
      </div>
      <div className={styles['item-status']}>{statusIcon}</div>
    </div>
  )
})

const InProgressHeader = translate()(({ t, total, done }) => (
  <div className={styles['upload-queue-header-inner']}>
    <span className="coz-desktop">
      {t('UploadQueue.header', { smart_count: total })}
    </span>
    <span className={'u-hide--desk'}>
      {t('UploadQueue.header_mobile', { done, total })}
    </span>
  </div>
))

const FinishedHeader = translate()(({ t, total, successful, onClose }) => (
  <div
    data-test-id="upload-queue-success"
    className={styles['upload-queue-header-inner']}
  >
    <span>{t('UploadQueue.header_done', { done: successful, total })}</span>
    <button className={classNames(styles['btn-close'])} onClick={onClose}>
      {t('UploadQueue.close')}
    </button>
  </div>
))

class UploadQueue extends Component {
  state = {
    collapsed: false
  }

  toggleCollapsed = () => {
    this.setState(state => ({ collapsed: !state.collapsed }))
  }

  render() {
    const { queue, doneCount, successCount, purgeQueue } = this.props
    const { collapsed } = this.state
    return (
      <div
        data-test-id="upload-queue"
        className={classNames(styles['upload-queue'], {
          [styles['upload-queue--visible']]: queue.length !== 0,
          [styles['upload-queue--collapsed']]: collapsed
        })}
      >
        <h4
          className={styles['upload-queue-header']}
          onDoubleClick={this.toggleCollapsed}
        >
          {doneCount < queue.length ? (
            <InProgressHeader total={queue.length} done={doneCount} />
          ) : (
            <FinishedHeader
              total={queue.length}
              successful={successCount}
              onClose={purgeQueue}
            />
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
                file={item.file}
                status={item.status}
                key={`file_${index}`}
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
