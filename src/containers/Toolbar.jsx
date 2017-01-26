import styles from '../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import UploadButton from './UploadButton'
import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'

import { addFolder, showSelectionBar } from '../actions'

const Toolbar = ({ t, addFolder, showSelectionBar }) => (
  <div className={styles['fil-toolbar']} role='toolbar'>
    <UploadButton />
    <MenuButton>
      <button
        role='button'
        className='coz-btn coz-btn--more'
      >
        <span className='coz-hidden'>{ t('toolbar.item_more') }</span>
      </button>
      <Menu className={styles['fil-toolbar-menu']}>
        <Item>
          <a className={styles['fil-action-upload']}>
            {t('toolbar.menu_upload')}
          </a>
        </Item>
        <Item>
          <a className={styles['fil-action-newfolder']} onClick={addFolder}>
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

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  addFolder: () => {
    dispatch(addFolder())
  },
  showSelectionBar: () => {
    dispatch(showSelectionBar())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(Toolbar))
