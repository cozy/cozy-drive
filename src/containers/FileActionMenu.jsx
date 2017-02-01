import styles from '../styles/actionmenu'

import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from '../lib/I18n'
import { Item } from 'react-bosonic/lib/Menu'

import { splitFilename, getClassFromMime } from '../components/File'
import { getActionableFile } from '../reducers'

const FileActionMenu = ({ t, file }) => {
  const { filename, extension } = splitFilename(file.name)
  return (
    <div className={styles['fil-actionmenu-wrapper']}>
      <div className={styles['fil-actionmenu-backdrop']} />
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
          <a className={styles['fil-action-download']}>
            {t('mobile.actionmenu.download')}
          </a>
        </Item>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  file: getActionableFile(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(FileActionMenu))
