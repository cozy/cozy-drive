import React from 'react'
import classNames from 'classnames'

import { ButtonLink, Menu, MenuItem, Icon } from 'cozy-ui/transpiled/react'
import AlbumAddIcon from 'cozy-ui/transpiled/react/Icons/AlbumAdd'

import { MoreButton } from 'components/Button'

import styles from 'photos/styles/toolbar.styl'

const AlbumsToolbar = ({ t, router }) => (
  <div
    data-test-id="pho-toolbar-albums"
    className={styles['pho-toolbar']}
    role="toolbar"
  >
    <div className={'u-hide--mob'}>
      <ButtonLink
        data-test-id="album-add"
        theme="secondary"
        href="#/albums/new"
        icon={AlbumAddIcon}
        label={t('Toolbar.album_new')}
      />
    </div>
    <Menu
      className={classNames(styles['pho-toolbar-menu'], 'u-hide--desk')}
      component={<MoreButton />}
      position="right"
    >
      <MenuItem
        onSelect={() => router.push('/albums/new')}
        icon={<Icon icon={AlbumAddIcon} />}
      >
        {t('Toolbar.album_new')}
      </MenuItem>
    </Menu>
  </div>
)

export default AlbumsToolbar
