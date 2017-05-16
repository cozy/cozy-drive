import styles from '../../../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from '../../../lib/I18n'

import DeleteButton from '../../../components/DeleteButton'
import ShareButton from '../components/ShareButton'
import Alerter from '../../../components/Alerter'
import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'

import { showSelectionBar } from '../../../actions'
import { mustShowSelectionBar } from '../../../reducers'
import { deleteAlbum } from '..'
import DestroyConfirm from '../../../components/DestroyConfirm'
import confirm from '../../../lib/confirm'

import classNames from 'classnames'

export const AlbumToolbar = ({ t, album, disabled = false, uploadPhotos, deleteAlbum, selectItems, params }) => (
  <div className={styles['pho-toolbar']} role='toolbar'>
    <DeleteButton
      className='coz-desktop'
      onDelete={() => deleteAlbum(album)}
      disabled={disabled}
      label={t('Toolbar.album_delete')}
    />,
    <MenuButton className='coz-mobile'>
      <button
        role='button'
        className={classNames('coz-btn', 'coz-btn--more', styles['coz-btn--more'], styles['pho-toolbar-btn'])}
        disabled={disabled}
      >
        <span className='coz-hidden'>{ t('Toolbar.more') }</span>
      </button>
      <Menu className={styles['coz-menu']}>
        <Item>
          <DeleteButton
            onDelete={() => deleteAlbum(album)}
            disabled={disabled}
            label={t('Toolbar.menu.album_delete')}
            type='menu-item'
          />
        </Item>
        <hr />
        <Item>
          <a className={classNames(styles['pho-action-select'], 'coz-mobile')} onClick={selectItems}>
            {t('Toolbar.menu.select_items')}
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
  selectItems: () => dispatch(showSelectionBar()),
  deleteAlbum: album => confirm(<DestroyConfirm t={ownProps.t} albumName={album.name} />)
    .then(() => dispatch(deleteAlbum(album)))
    .then(() => ownProps.router.replace('albums'))
    .then(() => Alerter.success('Albums.remove_album.success', {name: album.name}))
    .catch(() => Alerter.error('Albums.remove_album.error.generic'))
})

export default withRouter(translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumToolbar)))
