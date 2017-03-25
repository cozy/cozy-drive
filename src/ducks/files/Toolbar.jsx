import styles from '../../styles/toolbar'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../lib/I18n'

import UploadButton from '../../components/UploadButton'
import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'

import { addFolder, showSelectionBar, uploadFile } from '../../actions'
import { mustShowSelectionBar } from '../../reducers'

const Toolbar = ({ t, error, displayedFolder, addFolder, isSelectionBarVisible, showSelectionBar, uploadFile }) => (
  <div className={styles['fil-toolbar-files']} role='toolbar'>
    <UploadButton
      disabled={!!error || isSelectionBarVisible}
      onUpload={file => uploadFile(file, displayedFolder)}
      label={t('toolbar.item_upload')}
      className={classNames('coz-btn', 'coz-btn--regular', 'coz-btn--upload', styles['desktop-upload'])}
    />
    <MenuButton>
      <button
        role='button'
        className={classNames('coz-btn', styles['fil-toolbar-more-btn'])}
        disabled={!!error || isSelectionBarVisible}
      >
        <span className='coz-hidden'>{ t('toolbar.item_more') }</span>
      </button>
      <Menu className={styles['fil-toolbar-menu']}>
        <Item>
          <UploadButton
            disabled={!!error || isSelectionBarVisible}
            onUpload={uploadFile}
            label={t('toolbar.menu_upload')}
            className={styles['fil-action-upload']}
          />
        </Item>
        <Item>
          <a
            className={styles['fil-action-newfolder']}
            onClick={addFolder}
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
  error: state.ui.error,
  displayedFolder: state.view.displayedFolder,
  isSelectionBarVisible: mustShowSelectionBar(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  addFolder: () => {
    dispatch(addFolder())
  },
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
