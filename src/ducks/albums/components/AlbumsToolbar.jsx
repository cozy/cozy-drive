import styles from '../../../styles/toolbar'

import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import Menu, { Item } from '../../../components/Menu'

const AlbumsToolbar = ({ t }) => (
  <div className={styles['pho-toolbar']} role='toolbar'>
    <div className='coz-desktop'>
      <Link
        role='button'
        className={classNames('coz-btn', 'coz-btn--secondary', styles['pho-btn-new'])}
        to='/albums/new'
      >
        {t('Toolbar.album_new')}
      </Link>
    </div>
    <Menu
      title={t('Toolbar.more')}
      className={classNames(styles['pho-toolbar-menu'], 'coz-mobile')}
      buttonClassName={styles['pho-toolbar-more-btn']}
    >
      <Item>
        <div>
          <Link to='/albums/new' className={styles['pho-btn-new']}>
            {t('Toolbar.album_new')}
          </Link>
        </div>
      </Item>
    </Menu>
  </div>
)

export default translate()(AlbumsToolbar)
