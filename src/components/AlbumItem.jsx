import styles from '../styles/albumsList'

import React, { Component } from 'react'
// import classNames from 'classnames'
import { Link, withRouter } from 'react-router'
import { translate } from '../lib/I18n'

import { getPhotoLink } from '../actions/photos'

export class AlbumItem extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true
    }

    if (props.album && props.album.photosIds.length) {
      getPhotoLink(props.album.photosIds[0])
        .then(link => this.setState({
          url: link,
          isLoading: false
        }))
    } else {
      this.setState({
        url: '',
        isLoading: false
      })
    }
  }

  render () {
    const { t, album, router } = this.props
    const { isLoading, url } = this.state
    const parentPath = router.location.pathname
    return (
      !isLoading &&
        <div className={styles['pho-album']}>
          <Link
            to={`${parentPath}/${album._id}`}
            className={styles['pho-album-link']}
          >
            <img
              className={styles['pho-album-photo-item']}
              src={url}
            />
            <h2 className={styles['pho-album-title']}>{album.name}</h2>
            <h4 className={styles['pho-album-description']}>
              {t('Albums.album_item_description',
                {smart_count: album.photosIds.length})
              }
            </h4>
          </Link>
        </div>
    )
  }
}

export default translate()(withRouter(AlbumItem))
