import React from 'react'
import { withRouter } from 'react-router'
import classNames from 'classnames'
import { ButtonLink, Menu, MenuItem, Icon } from 'cozy-ui/react'

import { MoreButton } from 'components/Button'

import styles from 'photos/styles/toolbar'

const AlbumsToolbar = ({ t, router }) => (
  <div className={styles['pho-toolbar']} role="toolbar">
    <div className={styles['u-hide--mob']}>
      <ButtonLink
        theme="secondary"
        href="#/albums/new"
        icon="album-add"
        label={t('Toolbar.album_new')}
      />
    </div>
    <Menu
      className={classNames(styles['pho-toolbar-menu'], styles['u-hide--desk'])}
      component={<MoreButton />}
      position="right"
    >
      <MenuItem
        onSelect={() => router.push('/albums/new')}
        icon={<Icon icon="album-add" />}
      >
        {t('Toolbar.album_new')}
      </MenuItem>
    </Menu>
  </div>
)

export default withRouter(AlbumsToolbar)
