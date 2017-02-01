import styles from '../styles/actionmenu'

import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from '../lib/I18n'
import { Item } from 'react-bosonic/lib/Menu'
import withGestures from 'react-bosonic/lib/withGestures'

import { splitFilename, getClassFromMime } from '../components/File'
import { getActionableFile } from '../reducers'
import { downloadFile, hideFileActionMenu } from '../actions'

const Menu = ({ t, file, onDownload }) => {
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
        <a className={styles['fil-action-openwith']}>
          {t('mobile.actionmenu.open_with')}
        </a>
      </Item>
      <Item>
        <a className={styles['fil-action-download']} onClick={() => onDownload(file.id)}>
          {t('mobile.actionmenu.download')}
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
  onDownload: id => dispatch(downloadFile(id)),
  onClose: () => dispatch(hideFileActionMenu())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionMenu)
