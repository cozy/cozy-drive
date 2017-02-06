import styles from '../styles/actionmenu'

import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from '../lib/I18n'
import { Item } from 'react-bosonic/lib/Menu'
import withGestures from 'react-bosonic/lib/withGestures'

import { splitFilename, getClassFromMime } from '../components/File'
import { getActionableFile } from '../reducers'
import { downloadFile, hideFileActionMenu, openFileWith } from '../actions'

const Menu = ({ t, file, onDownload, onOpenWith }) => {
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
        </a>
      </Item>
      <Item>
        <a className={styles['fil-action-download']} onClick={() => onDownload(file.id)}>
          {t('mobile.action_menu.download')}
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
  file: getActionableFile(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDownload: id => {
    dispatch(downloadFile(id))
    dispatch(hideFileActionMenu())
  },
  onClose: () => dispatch(hideFileActionMenu()),
  onOpenWith: (id, filename) => {
    dispatch(openFileWith(id, filename))
    dispatch(hideFileActionMenu())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionMenu)
