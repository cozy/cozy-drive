/* global cozy */
import styles from '../../../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'

import UploadButton from '../../../components/UploadButton'
import Menu, { Item } from '../../../components/Menu'

import { showSelectionBar } from '../../../actions'
import { mustShowSelectionBar } from '../../../reducers'

import { addToUploadQueue } from '../../upload'
import { addPhotosToTimeline } from '../'

import classNames from 'classnames'

export const Toolbar = ({ t, disabled = false, uploadPhotos, deleteAlbum, selectItems, params }) => (
  <div className={styles['pho-toolbar']} role='toolbar'>
    <UploadButton
      className='coz-desktop'
      onUpload={uploadPhotos}
      disabled={disabled}
      label={t('Toolbar.photo_upload')}
    />
    <Menu
      title={t('Toolbar.more')}
      disabled={disabled}
      className={styles['pho-toolbar-menu']}
      buttonClassName={styles['pho-toolbar-more-btn']}
    >
      <Item>
        <UploadButton
          onUpload={uploadPhotos}
          disabled={disabled}
          label={t('Toolbar.menu.photo_upload')}
          type='menu-item'
          className='coz-mobile'
        />
      </Item>
      <hr className='coz-mobile' />
      <Item>
        <a className={styles['pho-action-select']} onClick={selectItems}>
          {t('Toolbar.menu.select_items')}
        </a>
      </Item>
    </Menu>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  disabled: mustShowSelectionBar(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadPhotos: async (photos) => {
    const dir = await cozy.client.files.createDirectoryByPath(ownProps.t('UploadQueue.path'))
    dispatch(addToUploadQueue(photos, dir._id, photo => addPhotosToTimeline([photo])))
  },
  selectItems: () => dispatch(showSelectionBar())
})

export default withRouter(translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar)))
