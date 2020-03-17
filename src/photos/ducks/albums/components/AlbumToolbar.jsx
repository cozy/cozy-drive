import React, { Component } from 'react'
import { Menu, MenuItem, Icon, withBreakpoints } from 'cozy-ui/transpiled/react'
import { MoreButton } from 'components/Button'
import { ShareButton, SharedRecipients, SharedDocument } from 'cozy-sharing'
import { RecipientsAvatars } from 'cozy-sharing/dist/components/Recipient'

import styles from 'photos/styles/toolbar.styl'

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
      <div
        data-test-id="pho-toolbar-album"
        className={styles['pho-toolbar']}
        role="toolbar"
      >
        {!isMobile && (
          <>
            <SharedRecipients
              docId={album.id}
              onClick={() => shareAlbum(album)}
            />
            <ShareButton
              disabled={disabled}
              label={t('Albums.share.cta')}
              onClick={() => shareAlbum(album)}
              docId={album.id}
            />
          </>
        )}
        <Menu
          data-test-id="more-button"
          disabled={disabled}
          className={styles['pho-toolbar-menu']}
          component={<MoreButton />}
          position="right"
        >
          {!sharedWithMe && (
            <MenuItem
              className={'u-hide--desk'}
              icon={<Icon icon="share" />}
              onSelect={() => shareAlbum(album)}
            >
              <SharedDocument docId={album.id}>
                {({ isSharedWithMe, recipients, link }) => (
                  <>
                    {t(
                      isSharedWithMe
                        ? 'Albums.share.sharedWithMe'
                        : 'Albums.share.cta'
                    )}
                    <RecipientsAvatars
                      className={styles['fil-toolbar-menu-recipients']}
                      recipients={recipients}
                      link={link}
                      size="small"
                    />
                  </>
                )}
              </SharedDocument>
            </MenuItem>
          )}
          <MenuItem
            data-test-id="menu-download-album"
            onSelect={downloadAlbum}
            icon={<Icon icon="download" />}
          >
            {t('Toolbar.menu.download_album')}
          </MenuItem>
          <MenuItem
            data-test-id="menu-rename-album"
            icon={<Icon icon="rename" />}
            onSelect={onRename}
          >
            {t('Toolbar.menu.rename_album')}
          </MenuItem>
          {!readOnly && (
            <MenuItem
              data-test-id="menu-add-photos-to-album"
              icon={<Icon icon="album-add" />}
              onSelect={() => router.push(`${router.location.pathname}/edit`)}
            >
              {t('Toolbar.menu.add_photos')}
            </MenuItem>
          )}
          <hr className={'u-hide--desk'} />
          <MenuItem
            className={'u-hide--desk'}
            icon={<Icon icon={CheckboxIcon} />}
            onSelect={selectItems}
          >
            {t('Toolbar.menu.select_items')}
          </MenuItem>
          <hr />
          {!sharedWithMe && (
            <MenuItem
              data-test-id="menu-delete-album"
              className={styles['pho-action-delete']}
              icon={<Icon icon="trash" />}
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
