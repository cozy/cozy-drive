import styles from '../styles/actionmenu'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from '../lib/I18n'
import { Item } from 'react-bosonic/lib/Menu'
import withGestures from '../lib/withGestures'
import Hammer from 'hammerjs'

import { splitFilename, getClassFromMime } from '../components/File'
import { getActionableFiles } from '../reducers'
import { downloadFile, downloadSelection, hideFileActionMenu, openFileWith, actionMenuLoading, actionMenuLoaded, hideSelectionBar, showDeleteConfirmation } from '../actions'

const Menu = props => {
  const { files, isTrashContext } = props
  return (
    <div className={styles['fil-actionmenu']}>
      {files.length === 1 ? <MenuHeaderFile file={files[0]} /> : <MenuHeaderSelection {...props} />}
      <hr />
      {files.length === 1 && <ItemOpenWith file={files[0]} {...props} />}
      {files.length === 1 ? <DownloadFile file={files[0]} {...props} /> : <DownloadSelection {...props} />}
      {!isTrashContext && <Delete {...props} />}
    </div>
  )
}

const MenuHeaderFile = ({ file }) => {
  const { filename, extension } = splitFilename(file.name)
  return (
    <Item>
      <div className={classNames(styles['fil-actionmenu-file'], styles['fil-actionmenu-header'], getClassFromMime(file))}>
        {filename}
        <span className={styles['fil-actionmenu-file-ext']}>{extension}</span>
      </div>
    </Item>
  )
}

const MenuHeaderSelection = ({ t, files }) => {
  const fileCount = files.length
  return (
    <Item>
      <div className={classNames(styles['fil-actionmenu-header'])}>
        {fileCount} {t('selectionbar.selected_count', { smart_count: fileCount })}
      </div>
    </Item>
  )
}

const ItemOpenWith = ({ t, file, onOpenWith, actionMenu }) => (
  <Item>
    <a className={styles['fil-action-openwith']} onClick={() => onOpenWith(file.id, file.name)}>
      {t('mobile.action_menu.open_with')}
      {actionMenu.openWith && <div className={styles['fil-loading']} />}
    </a>
  </Item>
)

const DownloadFile = ({ t, file, onDownloadFile, actionMenu }) => (
  <Item>
    <a className={styles['fil-action-download']} onClick={() => onDownloadFile(file)}>
      {t('mobile.action_menu.download')}
      {actionMenu.download && <div className={styles['fil-loading']} />}
    </a>
  </Item>
)

const DownloadSelection = ({ t, files, onDownloadSelection, actionMenu }) => (
  <Item>
    <a className={styles['fil-action-download']} onClick={() => onDownloadSelection(files)}>
      {t('mobile.action_menu.download')}
      {actionMenu.download && <div className={styles['fil-loading']} />}
    </a>
  </Item>
)

const Delete = ({ t, files, onDelete, actionMenu }) => (
  <Item>
    <a className={styles['fil-action-delete']} onClick={() => onDelete(files)}>
      {t('mobile.action_menu.delete')}
      {actionMenu.delete && <div className={styles['fil-loading']} />}
    </a>
  </Item>
)

const ActionMenu = translate()(Menu)

const Backdrop = withGestures(
  ownProps => ({
    tap: () => ownProps.onClose()
  })
)(() => <div className={styles['fil-actionmenu-backdrop']} />)

class FileActionMenu extends Component {
  componentDidMount () {
    this.gesturesHandler = new Hammer.Manager(this.fam, {
      recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }]]
    })

    this.actionMenuNode = this.actionMenu.getDOMNode()

    this.dismissHandler = this.dismiss.bind(this)

    // to be completely accurate, `maximumGestureDelta` should be the difference between the top of the menu and the bottom of the page; but using the height is much easier to compute and accurate enough.
    const maximumGestureDistance = this.actionMenuNode.getBoundingClientRect().height
    const minimumCloseDistance = 0.6 // between 0 and 1, how far down the gesture must be to be considered complete upon release
    const minimumCloseVelocity = 0.6 // a gesture faster than this will dismiss the menu, regardless of distance traveled

    let currentGestureProgress = null

    this.gesturesHandler.on('panstart', e => {
      // disable css transitions during the gesture
      this.actionMenuNode.classList.remove(styles['with-transition'])
      currentGestureProgress = 0
    })
    this.gesturesHandler.on('pan', e => {
      currentGestureProgress = e.deltaY / maximumGestureDistance
      this.applyTransformation(currentGestureProgress)
    })
    this.gesturesHandler.on('panend', e => {
      // re enable css transitions
      this.actionMenuNode.classList.add(styles['with-transition'])
      // dismiss the menu if the swipe pan was bigger than the treshold, or if it was a fast, downward gesture
      let shouldDismiss = e.deltaY / maximumGestureDistance >= minimumCloseDistance ||
                          (e.deltaY > 0 && e.velocity >= minimumCloseVelocity)

      if (shouldDismiss) {
        if (currentGestureProgress >= 1) {
          // the menu was already hidden, we can close it right away
          this.dismissHandler()
        } else {
          // we need to transition the menu to the bottom before dismissing it
          this.actionMenuNode.addEventListener('transitionend', this.dismissHandler, false)
          this.applyTransformation(1)
        }
      } else {
        this.applyTransformation(0)
      }
    })
  }

  componentWillUnmount () {
    this.gesturesHandler.destroy()
  }

  // applies a css trasnform to the element, based on the progress of the gesture
  applyTransformation (progress) {
    // wrap the progress between 0 and 1
    progress = Math.min(1, Math.max(0, progress))
    this.actionMenuNode.style.transform = 'translateY(' + (progress * 100) + '%)'
  }

  dismiss () {
    this.props.onClose()
    // remove the event handler so subsequent transitions don't trigger dismissals
    this.actionMenuNode.removeEventListener('transitionend', this.dismissHandler)
    this.applyTransformation(0)
  }

  render (props) {
    return (
      <div className={styles['fil-actionmenu-wrapper']} ref={fam => { this.fam = fam }}>
        <Backdrop {...props} />
        <ActionMenu {...props} ref={actionMenu => { this.actionMenu = actionMenu }} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  files: getActionableFiles(state),
  actionMenu: state.ui.actionMenu
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDownloadFile: file => {
    const clearUI = () => {
      dispatch(actionMenuLoaded('download'))
      dispatch(hideFileActionMenu())
      dispatch(hideSelectionBar())
    }
    dispatch(actionMenuLoading('download'))
    dispatch(downloadFile(file)).then(clearUI).catch(clearUI)
  },
  onDownloadSelection: files => {
    const clearUI = () => {
      dispatch(actionMenuLoaded('download'))
      dispatch(hideFileActionMenu())
      dispatch(hideSelectionBar())
    }
    dispatch(actionMenuLoading('download'))
    dispatch(downloadSelection(files)).then(clearUI).catch(clearUI)
  },
  onClose: () => dispatch(hideFileActionMenu()),
  onOpenWith: (id, filename) => {
    const clearUI = () => {
      dispatch(actionMenuLoaded('openWith'))
      dispatch(hideFileActionMenu())
    }
    dispatch(actionMenuLoading('openWith'))
    dispatch(openFileWith(id, filename)).then(clearUI).catch(clearUI)
  },
  onDelete: files => {
    dispatch(actionMenuLoading('delete'))
    dispatch(showDeleteConfirmation())
    dispatch(actionMenuLoaded('delete'))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionMenu)
