import styles from '../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import UploadButton from '../components/UploadButton'
import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'

import { uploadPhotos, showSelectionBar } from '../actions'
import { mustShowSelectionBar } from '../reducers'

export const Toolbar = ({ t, disabled = false, uploadPhotos, selectItems }) => (
  <div className={styles['pho-toolbar']} role='toolbar'>
    <UploadButton
      onUpload={uploadPhotos}
      disabled={disabled}
    />
    <MenuButton>
      <button
        role='button'
        className='coz-btn coz-btn--more'
        disabled={disabled}
      >
        <span className='coz-hidden'>{ t('Toolbar.more') }</span>
      </button>
      <Menu className={styles['coz-menu']}>
        <Item>
          <a className={styles['pho-action-select']} onClick={selectItems}>
            {t('Toolbar.select_items')}
          </a>
        </Item>
      </Menu>
    </MenuButton>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  disabled: mustShowSelectionBar(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadPhotos: (photo) => {
    dispatch(uploadPhotos(photo))
  },
  selectItems: () => {
    dispatch(showSelectionBar())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(Toolbar))
