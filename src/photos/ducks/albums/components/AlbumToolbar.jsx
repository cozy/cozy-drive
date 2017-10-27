import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'
import { leave } from 'cozy-client'
import { translate } from 'cozy-ui/react/I18n'

import ShareButton, {
  SharedByMeButton,
  SharedWithMeButton
} from '../../../components/ShareButton'
import Alerter from '../../../components/Alerter'
import Menu, { Item } from 'components/Menu'
import { MoreButton } from 'components/Button'

import {
  isSelectionBarVisible,
  showSelectionBar
} from '../../../ducks/selection'

import { deleteAlbum, downloadAlbum } from '..'
import DestroyConfirm from '../../../components/DestroyConfirm'
import QuitConfirm from '../../../components/QuitConfirm'
import confirm from '../../../lib/confirm'
import { ShareModal, SharingDetailsModal } from 'sharing'

import classNames from 'classnames'

import styles from '../../../styles/toolbar'

class AlbumToolbar extends Component {
  state = {
    showShareModal: false,
    showSharingDetailsModal: false
  }

  showShareModal = () => {
    this.setState({ showShareModal: true })
  }

  closeShareModal = () => {
    this.setState({ showShareModal: false })
  }

  showSharingDetailsModal = () => {
    this.setState({ showSharingDetailsModal: true })
  }

  closeSharingDetailsModal = () => {
    this.setState({ showSharingDetailsModal: false })
  }

  render() {
    const {
      t,
      location,
      album,
      photos,
      sharedWithMe,
      sharedByMe,
      readOnly,
      disabled = false
    } = this.props
    const { deleteAlbum, leaveAlbum, selectItems, onRename } = this.props
    return (
      <div className={styles['pho-toolbar']} role="toolbar">
        <div className={styles['u-hide--mob']}>
          {!sharedByMe &&
            !sharedWithMe && (
              <ShareButton
                label={t('Albums.share.cta')}
                onClick={this.showShareModal}
              />
            )}
          {sharedByMe && (
            <SharedByMeButton
              label={t('Albums.share.sharedByMe')}
              onClick={this.showShareModal}
            />
          )}
          {sharedWithMe && (
            <SharedWithMeButton
              label={t('Albums.share.sharedWithMe')}
              onClick={this.showSharingDetailsModal}
            />
          )}
        </div>
        <Menu
          disabled={disabled}
          className={styles['pho-toolbar-menu']}
          button={<MoreButton />}
        >
          {!sharedWithMe && (
            <Item>
              <a
                className={classNames(
                  styles['pho-action-share'],
                  styles['u-hide--desk']
                )}
                onClick={this.showShareModal}
              >
                {t('Albums.share.cta')}
              </a>
            </Item>
          )}
          <Item>
            <a
              className={classNames(styles['pho-action-download'])}
              onClick={() => downloadAlbum(album, photos)}
            >
              {t('Toolbar.menu.download_album')}
            </a>
          </Item>
          <Item>
            <a
              className={classNames(styles['pho-action-rename'])}
              onClick={onRename}
            >
              {t('Toolbar.menu.rename_album')}
            </a>
          </Item>
          {!readOnly && (
            <Item>
              <Link
                className={classNames(styles['pho-action-addphotos'])}
                to={`${location.pathname}/edit`}
              >
                {t('Toolbar.menu.add_photos')}
              </Link>
            </Item>
          )}
          <hr className={styles['u-hide--desk']} />
          <Item>
            <a
              className={classNames(
                styles['pho-action-select'],
                styles['u-hide--desk']
              )}
              onClick={selectItems}
            >
              {t('Toolbar.menu.select_items')}
            </a>
          </Item>
          <hr />
          {!sharedWithMe && (
            <Item>
              <a
                className={classNames(styles['pho-action-delete'])}
                onClick={() => deleteAlbum(album)}
              >
                {t('Toolbar.menu.album_delete')}
              </a>
            </Item>
          )}
          {sharedWithMe && (
            <Item>
              <a
                className={classNames(styles['pho-action-delete'])}
                onClick={() => leaveAlbum(album)}
              >
                {t('Toolbar.menu.album_quit')}
              </a>
            </Item>
          )}
        </Menu>
        {this.state.showShareModal && (
          <ShareModal
            document={album}
            documentType="Albums"
            sharingDesc={album.name}
            onClose={this.closeShareModal}
          />
        )}
        {this.state.showSharingDetailsModal && (
          <SharingDetailsModal
            document={album}
            documentType="Albums"
            sharingDesc={album.name}
            onClose={this.closeSharingDetailsModal}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  disabled: isSelectionBarVisible(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  selectItems: () => dispatch(showSelectionBar()),
  deleteAlbum: album =>
    confirm(<DestroyConfirm t={ownProps.t} albumName={album.name} />, () =>
      dispatch(deleteAlbum(album))
        .then(() => {
          ownProps.router.replace('albums')
          Alerter.success('Albums.remove_album.success', { name: album.name })
        })
        .catch(() => Alerter.error('Albums.remove_album.error.generic'))
    ),
  leaveAlbum: album =>
    confirm(<QuitConfirm t={ownProps.t} albumName={album.name} />, () =>
      dispatch(leave(album))
        .then(() => dispatch(deleteAlbum(album)))
        .then(() => {
          ownProps.router.replace('albums')
          Alerter.success('Albums.quit_album.success', { name: album.name })
        })
        .catch(() => Alerter.error('Albums.quit_album.error.generic'))
    )
})

export default withRouter(
  translate()(connect(mapStateToProps, mapDispatchToProps)(AlbumToolbar))
)
