import React from 'react'
import classNames from 'classnames'

import { ButtonLink, Menu, MenuItem, Icon } from 'cozy-ui/transpiled/react'
import AlbumAddIcon from 'cozy-ui/transpiled/react/Icons/AlbumAdd'

import { MoreButton } from 'components/Button'

import styles from 'photos/styles/toolbar.styl'

import { useNavigate } from 'react-router-dom'

const AlbumsToolbar = ({ t }) => {
  const { navigate } = useNavigate()
  return (
    <div
      data-testid="pho-toolbar-albums"
      className={styles['pho-toolbar']}
      role="toolbar"
    >
      <div className={'u-hide--mob'}>
        <ButtonLink
          data-testid="album-add"
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
          onSelect={() => navigate.push('/albums/new')}
          icon={<Icon icon={AlbumAddIcon} />}
        >
          {t('Toolbar.album_new')}
        </MenuItem>
      </Menu>
    </div>
  )
}

export default AlbumsToolbar
