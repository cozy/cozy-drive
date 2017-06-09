import styles from '../../../styles/toolbar'

import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from '../../../lib/I18n'

import NewAlbum from '../../../components/NewAlbum'

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
        {this.state.showAddAlbum && <NewAlbum />}
      </div>
    )
  }
}

export default translate()(AlbumsToolbar)
