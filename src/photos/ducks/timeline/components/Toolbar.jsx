import styles from '../../../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'

import UploadButton from '../../../components/UploadButton'
import Menu, { Item } from 'components/Menu'
import { MoreButton } from 'components/Button'

import { showSelectionBar, isSelectionBarVisible } from '../../selection'

import { addToUploadQueue } from '../../upload'
import { uploadPhoto } from '../'

export const Toolbar = ({ t, disabled = false, uploadPhotos, selectItems }) => (
  <div className={styles['pho-toolbar']} role="toolbar">
    <UploadButton
      className={styles['u-hide--mob']}
      onUpload={uploadPhotos}
      disabled={disabled}
      label={t('Toolbar.photo_upload')}
    />
    <Menu
      disabled={disabled}
      className={styles['pho-toolbar-menu']}
      button={<MoreButton />}
    >
      <Item>
        <UploadButton
          onUpload={uploadPhotos}
          disabled={disabled}
          label={t('Toolbar.menu.photo_upload')}
          type="menu-item"
          className={styles['u-hide--desk']}
        />
      </Item>
      <hr className={styles['u-hide--desk']} />
      <Item>
        <a className={styles['pho-action-select']} onClick={selectItems}>
          {t('Toolbar.menu.select_items')}
        </a>
      </Item>
    </Menu>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  disabled: isSelectionBarVisible(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  selectItems: () => dispatch(showSelectionBar()),
  uploadPhotos: photos =>
    dispatch(
      addToUploadQueue(photos, photo =>
        uploadPhoto(photo, ownProps.t('UploadQueue.path'))
      )
    )
})

export default withRouter(
  translate()(connect(mapStateToProps, mapDispatchToProps)(Toolbar))
)
