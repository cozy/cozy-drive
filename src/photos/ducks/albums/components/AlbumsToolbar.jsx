import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import Menu, { Item } from 'common/components/Menu'
import { MoreButton } from 'common/components/Button'

import styles from '../../../styles/toolbar'

const AlbumsToolbar = ({ t }) => (
  <div className={styles['pho-toolbar']} role="toolbar">
    <div className={styles['u-hide--mob']}>
      <Link
        role="button"
        className={classNames(styles['pho-btn-new'])}
        to="/albums/new"
      >
        {t('Toolbar.album_new')}
      </Link>
    </div>
    <Menu
      className={classNames(styles['pho-toolbar-menu'], styles['u-hide--desk'])}
      button={<MoreButton />}
    >
      <Item>
        <div>
          <Link to="/albums/new" className={styles['pho-action-newalbum']}>
            {t('Toolbar.album_new')}
          </Link>
        </div>
      </Item>
    </Menu>
  </div>
)

export default translate()(AlbumsToolbar)
