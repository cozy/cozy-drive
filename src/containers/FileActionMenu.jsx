import styles from '../styles/actionmenu'

import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from '../lib/I18n'
import { Item } from 'react-bosonic/lib/Menu'
import withGestures from '../lib/withGestures'

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
    <a className={styles['fil-action-download']} onClick={() => onDownloadFile(file.id)}>
      {t('mobile.action_menu.download')}
      {actionMenu.download && <div className={styles['fil-loading']} />}
    </a>
  </Item>
)

const DownloadSelection = ({ t, files, onDownloadSelection, actionMenu }) => (
  <Item>
    <a className={styles['fil-action-download']} onClick={() => onDownloadSelection()}>
      {t('mobile.action_menu.download')}
      {actionMenu.download && <div className={styles['fil-loading']} />}
    </a>
  </Item>
)

const Delete = ({ t, files, onDelete, actionMenu }) => (
  <Item>
    <a className={styles['fil-action-delete']} onClick={() => onDelete()}>
      {t('mobile.action_menu.delete')}
      {actionMenu.delete && <div className={styles['fil-loading']} />}
    </a>
  </Item>
)

const ActionMenu = withGestures(
  ownProps => ({
    swipeDown: () => ownProps.onClose()
  })
)(translate()(Menu))

const Backdrop = withGestures(
  ownProps => ({
    tap: e => setTimeout(ownProps.onClose)// timeout is used to prevent the infamous ghostclick
  })
)(() => <div className={styles['fil-actionmenu-backdrop']} />)

const FileActionMenu = props => (
  <div className={styles['fil-actionmenu-wrapper']}>
    <Backdrop {...props} />
    <ActionMenu {...props} />
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  files: getActionableFiles(state),
  actionMenu: state.ui.actionMenu
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDownloadFile: id => {
    const clearUI = () => {
      dispatch(actionMenuLoaded('download'))
      dispatch(hideFileActionMenu())
      dispatch(hideSelectionBar())
    }
    dispatch(actionMenuLoading('download'))
    dispatch(downloadFile(id)).then(clearUI).catch(clearUI)
  },
  onDownloadSelection: () => {
    const clearUI = () => {
      dispatch(actionMenuLoaded('download'))
      dispatch(hideFileActionMenu())
      dispatch(hideSelectionBar())
    }
    dispatch(actionMenuLoading('download'))
    dispatch(downloadSelection()).then(clearUI).catch(clearUI)
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
  onDelete: () => {
    dispatch(actionMenuLoading('delete'))
    dispatch(showDeleteConfirmation())
    dispatch(actionMenuLoaded('delete'))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionMenu)
