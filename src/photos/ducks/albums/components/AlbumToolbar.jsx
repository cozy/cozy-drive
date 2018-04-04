import React, { Component } from 'react'
import { withRouter, Link } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'

import Menu, { Item } from 'components/Menu'
import { MoreButton } from 'components/Button'

import {
  ShareButton,
  // SharedByMeButton,
  // SharedWithMeButton,
  ShareModal
  // SharingDetailsModal
} from 'sharing'

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
      sharedWithMe,
      // sharedByMe,
      readOnly,
      disabled = false
    } = this.props
    const {
      downloadAlbum,
      deleteAlbum,
      // leaveAlbum,
      selectItems,
      onRename
    } = this.props
    return (
      <div className={styles['pho-toolbar']} role="toolbar">
        <div className={styles['u-hide--mob']}>
          <ShareButton
            disabled={disabled}
            label={t('Albums.share.cta')}
            onClick={this.showShareModal}
          />
          {/* !sharedByMe &&
            !sharedWithMe && (
              <ShareButton
                disabled={disabled}
                label={t('Albums.share.cta')}
                onClick={this.showShareModal}
              />
            )}
          {sharedByMe && (
            <SharedByMeButton
              disabled={disabled}
              label={t('Albums.share.sharedByMe')}
              onClick={this.showShareModal}
            />
          )}
          {sharedWithMe && (
            <SharedWithMeButton
              disabled={disabled}
              label={t('Albums.share.sharedWithMe')}
              onClick={this.showSharingDetailsModal}
            />
          ) */}
        </div>
        <Menu
          disabled={disabled}
          className={styles['pho-toolbar-menu']}
          button={<MoreButton>{t('Toolbar.more')}</MoreButton>}
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
              onClick={downloadAlbum}
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
                onClick={deleteAlbum}
              >
                {t('Toolbar.menu.album_delete')}
              </a>
            </Item>
          )}
          {/* sharedWithMe && (
            <Item>
              <a
                className={classNames(styles['pho-action-delete'])}
                onClick={leaveAlbum}
              >
                {t('Toolbar.menu.album_quit')}
              </a>
            </Item>
          ) */}
        </Menu>
        {this.state.showShareModal && (
          <ShareModal
            document={album}
            documentType="Albums"
            sharingDesc={album.name}
            onClose={this.closeShareModal}
          />
        )}
        {/* this.state.showSharingDetailsModal && (
          <SharingDetailsModal
            document={album}
            documentType="Albums"
            sharingDesc={album.name}
            onClose={this.closeSharingDetailsModal}
          />
        ) */}
      </div>
    )
  }
}

export default withRouter(translate()(AlbumToolbar))
