import styles from '../styles/actionmenu'

import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from '../lib/I18n'
import { Item } from 'react-bosonic/lib/Menu'
import withGestures from 'react-bosonic/lib/withGestures'

import { splitFilename, getClassFromMime } from '../components/File'
import { getActionableFile } from '../reducers'
import { downloadFile, hideFileActionMenu, openFileWith, actionMenuLoading, actionMenuLoaded } from '../actions'

const Menu = ({ t, file, onDownload, onOpenWith, actionMenu }) => {
  const { filename, extension } = splitFilename(file.name)
  return (
    <div className={styles['fil-actionmenu']}>
      <Item>
        <div className={classNames(styles['fil-actionmenu-file'], getClassFromMime(file))}>
          {filename}
          <span className={styles['fil-actionmenu-file-ext']}>{extension}</span>
        </div>
      </Item>
      <hr />
      <Item>
        <a className={styles['fil-action-openwith']} onClick={() => onOpenWith(file.id, file.name)}>
          {t('mobile.action_menu.open_with')}
          {actionMenu.openWith && <div className={styles['fil-loading']} />}
        </a>
      </Item>
      <Item>
        <a className={styles['fil-action-download']} onClick={() => onDownload(file.id)}>
          {t('mobile.action_menu.download')}
          {actionMenu.download && <div className={styles['fil-loading']} />}
        </a>
      </Item>
    </div>
  )
}

const ActionMenu = withGestures(
  ownProps => ({
    swipeDown: () => ownProps.onClose()
  })
)(translate()(Menu))

const Backdrop = withGestures(
  ownProps => ({
    tap: () => ownProps.onClose()
  })
)(() => <div className={styles['fil-actionmenu-backdrop']} />)

const FileActionMenu = props => (
  <div className={styles['fil-actionmenu-wrapper']}>
    <Backdrop {...props} />
    <ActionMenu {...props} />
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  file: getActionableFile(state),
  actionMenu: state.ui.actionMenu
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDownload: id => {
    const clearUI = () => {
      dispatch(actionMenuLoaded('download'))
      dispatch(hideFileActionMenu())
    }
    dispatch(actionMenuLoading('download'))
    dispatch(downloadFile(id)).then(clearUI).catch(clearUI)
  },
  onClose: () => dispatch(hideFileActionMenu()),
  onOpenWith: (id, filename) => {
    const clearUI = () => {
      dispatch(actionMenuLoaded('openWith'))
      dispatch(hideFileActionMenu())
    }
    dispatch(actionMenuLoading('openWith'))
    dispatch(openFileWith(id, filename)).then(clearUI).catch(clearUI)
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionMenu)
