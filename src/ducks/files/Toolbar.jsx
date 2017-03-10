import styles from '../../styles/toolbar'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../lib/I18n'

import UploadButton from '../../components/UploadButton'
import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'

import { showSelectionBar, uploadFile } from '../../actions'

const Toolbar = ({ t, disabled, displayedFolder, actions, showSelectionBar, uploadFile }) => (
  <div className={styles['fil-toolbar-files']} role='toolbar'>
    <UploadButton
      disabled={disabled}
      onUpload={file => uploadFile(file, displayedFolder)}
      label={t('toolbar.item_upload')}
      className={classNames('coz-btn', 'coz-btn--regular', 'coz-btn--upload', styles['desktop-upload'])}
    />
    <MenuButton>
      <button
        role='button'
        className={classNames('coz-btn', styles['fil-toolbar-more-btn'])}
        disabled={disabled}
      >
        <span className='coz-hidden'>{ t('toolbar.item_more') }</span>
      </button>
      <Menu className={styles['fil-toolbar-menu']}>
        <Item>
          <UploadButton
            onUpload={file => uploadFile(file, displayedFolder)}
            label={t('toolbar.menu_upload')}
            className={styles['fil-action-upload']}
          />
        </Item>
        <Item>
          <a
            className={styles['fil-action-newfolder']}
            onClick={actions.addFolder}
          >
            {t('toolbar.menu_new_folder')}
          </a>
        </Item>
        <hr />
        <Item>
          <a className={styles['fil-action-select']} onClick={showSelectionBar}>
            {t('toolbar.menu_select')}
          </a>
        </Item>
      </Menu>
    </MenuButton>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  displayedFolder: state.view.displayedFolder
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  showSelectionBar: () => {
    dispatch(showSelectionBar())
  },
  uploadFile: (file, displayedFolder) => {
    dispatch(uploadFile(file, displayedFolder))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(Toolbar))
