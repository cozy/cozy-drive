import React, { Component } from 'react'

import { ShareButton, SharedRecipients, SharedDocument } from 'cozy-sharing'
import RecipientsAvatars from 'cozy-sharing/dist/components/Recipient/RecipientsAvatars'
import { Menu, MenuItem, Icon, withBreakpoints } from 'cozy-ui/transpiled/react'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import AlbumAddIcon from 'cozy-ui/transpiled/react/Icons/AlbumAdd'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import CheckboxIcon from 'cozy-ui/transpiled/react/Icons/CheckSquare'

import { MoreButton } from 'components/Button'

import styles from 'photos/styles/toolbar.styl'

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
      selectItems,
      onRename,
      breakpoints: { isMobile },
      shareAlbum
    } = this.props
    return (
      <div
        data-testid="pho-toolbar-album"
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
          data-testid="more-button"
          disabled={disabled}
          className={styles['pho-toolbar-menu']}
          component={<MoreButton />}
          position="right"
        >
          {!sharedWithMe && (
            <MenuItem
              className={'u-hide--desk'}
              icon={<Icon icon={ShareIcon} />}
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
            data-testid="menu-download-album"
            onSelect={downloadAlbum}
            icon={<Icon icon={DownloadIcon} />}
          >
            {t('Toolbar.menu.download_album')}
          </MenuItem>
          <MenuItem
            data-testid="menu-rename-album"
            icon={<Icon icon={RenameIcon} />}
            onSelect={onRename}
          >
            {t('Toolbar.menu.rename_album')}
          </MenuItem>
          {!readOnly && (
            <MenuItem
              data-testid="menu-add-photos-to-album"
              icon={<Icon icon={AlbumAddIcon} />}
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
              data-testid="menu-delete-album"
              className={styles['pho-action-delete']}
              icon={<Icon icon={TrashIcon} />}
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
