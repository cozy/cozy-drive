import styles from '../../../styles/toolbar'

import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import NewAlbum from '../../../components/NewAlbum'
import Menu, { Item } from '../../../components/Menu'

class AlbumsToolbar extends Component {
  state = {
    showAddAlbum: false
  }

  showAddAlbum = () => {
    this.setState({ showAddAlbum: true })
  }

  closeAddAlbum = () => {
    this.setState({ showAddAlbum: false })
  }

  render () {
    const { t } = this.props
    return (
      <div className={styles['pho-toolbar']} role='toolbar'>
        <div className='coz-desktop'>
          <button
            role='button'
            className={classNames('coz-btn', 'coz-btn--secondary', styles['pho-btn-new'])}
            onClick={this.showAddAlbum}
          >
            {t('Toolbar.album_new')}
          </button>
        </div>
        <Menu
          title={t('Toolbar.more')}
          className={classNames(styles['pho-toolbar-menu'], 'coz-mobile')}
          buttonClassName={styles['pho-toolbar-more-btn']}
        >
          <Item>
            <div>
              <a className={styles['pho-btn-new']} onClick={this.showAddAlbum}>
                {t('Toolbar.album_new')}
              </a>
            </div>
          </Item>
        </Menu>
        {this.state.showAddAlbum && <NewAlbum closeAddAlbum={this.closeAddAlbum} />}
      </div>
    )
  }
}

export default translate()(AlbumsToolbar)
