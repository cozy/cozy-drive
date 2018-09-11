import React, { Component } from 'react'
import { Menu, MenuItem, Icon, withBreakpoints } from 'cozy-ui/react'
import { MoreButton } from 'components/Button'
import { ShareButton } from 'sharing'

import styles from 'photos/styles/toolbar'

import CheckboxIcon from 'photos/assets/icons/icon-checkbox.svg'

class AlbumToolbar extends Component {
  render() {
    const {
      t,
      router,
      album,
      sharedWithMe,
      // sharedByMe,
      readOnly,
      disabled = false,
      downloadAlbum,
      deleteAlbum,
      // leaveAlbum,
      selectItems,
      onRename,
      breakpoints: { isMobile },
      shareAlbum
    } = this.props
    return (
      <div className={styles['pho-toolbar']} role="toolbar">
        {!isMobile && (
          <ShareButton
            disabled={disabled}
            label={t('Albums.share.cta')}
            onClick={() => shareAlbum(album)}
          />
        )}
        <Menu
          disabled={disabled}
          className={styles['pho-toolbar-menu']}
          component={<MoreButton />}
          position="right"
        >
          {!sharedWithMe && (
            <MenuItem
              className={styles['u-hide--desk']}
              icon={<Icon icon="share" />}
              onSelect={() => shareAlbum(album)}
            >
              {t('Albums.share.cta')}
            </MenuItem>
          )}
          <MenuItem onSelect={downloadAlbum} icon={<Icon icon="download" />}>
            {t('Toolbar.menu.download_album')}
          </MenuItem>
          <MenuItem icon={<Icon icon="rename" />} onSelect={onRename}>
            {t('Toolbar.menu.rename_album')}
          </MenuItem>
          {!readOnly && (
            <MenuItem
              icon={<Icon icon="album-add" />}
              onSelect={() => router.push(`${router.location.pathname}/edit`)}
            >
              {t('Toolbar.menu.add_photos')}
            </MenuItem>
          )}
          <hr className={styles['u-hide--desk']} />
          <MenuItem
            className={styles['u-hide--desk']}
            icon={<Icon icon={CheckboxIcon} />}
            onSelect={selectItems}
          >
            {t('Toolbar.menu.select_items')}
          </MenuItem>
          <hr />
          {!sharedWithMe && (
            <MenuItem
              className={styles['pho-action-delete']}
              icon={<Icon icon="delete" />}
              onSelect={deleteAlbum}
            >
              {t('Toolbar.menu.album_delete')}
            </MenuItem>
          )}
        </Menu>
      </div>
    )
  }
}

export default withBreakpoints()(AlbumToolbar)
