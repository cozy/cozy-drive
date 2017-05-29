import styles from '../../../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from '../../../lib/I18n'

import DeleteButton from '../../../components/DeleteButton'
import ShareButton from '../../../components/ShareButton'
import Alerter from '../../../components/Alerter'
import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'

import { showSelectionBar } from '../../../actions'
import { mustShowSelectionBar } from '../../../reducers'
import { deleteAlbum, getAlbumShareLink } from '..'
import DestroyConfirm from '../../../components/DestroyConfirm'
import confirm from '../../../lib/confirm'
import ShareModal from '../../../containers/ShareModal'

import classNames from 'classnames'

export const AlbumToolbar = ({ t, album, disabled = false, uploadPhotos, deleteAlbum, selectItems, shareAlbum, onRename }) => (
  <div className={styles['pho-toolbar']} role='toolbar'>
    <div className='coz-desktop'>
      <ShareButton
        label={t('Albums.share.cta')}
        onClick={() => shareAlbum(album)} />
    </div>
    <MenuButton>
      <button
        role='button'
        className={classNames('coz-btn', 'coz-btn--more', styles['coz-btn--more'], styles['pho-toolbar-btn'])}
        disabled={disabled}
      >
        <span className='coz-hidden'>{ t('Toolbar.more') }</span>
      </button>
      <Menu className={styles['coz-menu']}>
        <Item>
          <a className={classNames(styles['pho-action-share'], 'coz-mobile')} onClick={onRename}>
            {t('Albums.share.cta')}
          </a>
        </Item>
        <Item>
          <a className={classNames(styles['pho-action-rename'])} onClick={onRename}>
            {t('Toolbar.menu.rename_album')}
          </a>
        </Item>
        <hr className='coz-mobile' />
        <Item>
          <a className={classNames(styles['pho-action-select'], 'coz-mobile')} onClick={selectItems}>
            {t('Toolbar.menu.select_items')}
          </a>
        </Item>
        <hr />
        <Item>
          <a className={classNames(styles['pho-action-delete'])} onClick={() => deleteAlbum(album)}>
            {t('Toolbar.menu.album_delete')}
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
  deleteAlbum: album => confirm(
    <DestroyConfirm t={ownProps.t} albumName={album.name} />,
    () => dispatch(deleteAlbum(album))
      .then(() => ownProps.router.replace('albums'))
      .then(() => Alerter.success('Albums.remove_album.success', {name: album.name}))
      .catch(() => Alerter.error('Albums.remove_album.error.generic'))
  ),
  shareAlbum: album => getAlbumShareLink(album._id)
    .then(shareLink => confirm(<ShareModal t={ownProps.t} shareLink={shareLink}
      toggleShareLinkCreation={checked => console.info('We should create or destroy the share link.', checked)} />))
    .catch((ex) => {
      Alerter.error('Albums.share.error.generic')
      throw ex
    })
})

export default withRouter(translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumToolbar)))
