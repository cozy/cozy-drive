import styles from '../styles/albumsList'

import React, { Component } from 'react'
// import classNames from 'classnames'
import { Link, withRouter } from 'react-router'
import { translate } from '../lib/I18n'

import { getPhotoLink } from '../actions/photos'

const isAlbumEmpty = album => {
  return !(album && album.photosIds && album.photosIds.length)
}

const fetchMainPhoto = album => {
  return isAlbumEmpty(album)
    ? Promise.resolve(null)
      : getPhotoLink(album.photosIds[0])
}

export class AlbumItem extends Component {
  constructor (props) {
    super(props)

    const { album } = props
    // Detect right now if there is a main photo to load, otherwise the
    // Promise.resolve(null) in fetchMainPhoto will not be considered as it will
    // trigger a setState directly in constructor.
    const albumIsEmpty = isAlbumEmpty(album)

    this.state = {
      // Set loading state in function of album emtpyness.
      isLoading: !albumIsEmpty,
      isImageLoading: !albumIsEmpty
    }

    this.handleImageLoaded = this.handleImageLoaded.bind(this)

    fetchMainPhoto(album)
      .then(link => {
        this.setState({
          url: link,
          isLoading: false
        })
      }).catch(linkError => {
        this.props.onServerError(linkError)
        this.setState({
          url: null,
          isLoading: false
        })
      })
  }

  handleImageLoaded () {
    this.setState({ isImageLoading: false })
  }

  render () {
    const { t, album, router } = this.props
    const { isLoading, url, isImageLoading } = this.state
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
              onLoad={this.handleImageLoaded}
              style={isImageLoading ? 'display:none' : ''}
              alt={`${album.name} album cover`}
              src={url || ''}
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
