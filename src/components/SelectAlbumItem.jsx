import styles from '../styles/albumsList'

import React, { Component } from 'react'
import { translate } from '../lib/I18n'

import { getPhotoLink } from '../actions/photos'

const isAlbumEmpty = album => !(album && album.photosIds && album.photosIds.length)

const fetchMainPhoto = album =>
  isAlbumEmpty(album)
    ? Promise.resolve(null)
    : getPhotoLink(album.photosIds[0])

export class AlbumItem extends Component {
  constructor (props) {
    super(props)

    // Detect right now if there is a main photo to load, otherwise the
    // Promise.resolve(null) in fetchMainPhoto will not be considered as it will
    // trigger a setState directly in constructor.
    const albumIsEmpty = isAlbumEmpty(props.album)

    this.state = {
      // Set loading state in function of album emptyness.
      isLoading: !albumIsEmpty,
      isImageLoading: !albumIsEmpty
    }

    this.handleImageLoaded = this.handleImageLoaded.bind(this)
  }

  componentWillMount () {
    fetchMainPhoto(this.props.album)
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
    const { t, album } = this.props
    const { isLoading, url, isImageLoading } = this.state
    return (
      !isLoading &&
        <div className={styles['pho-album']}>
          <div
            onClick={() => this.props.onSelectAlbum(album)}
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
          </div>
        </div>
    )
  }
}

export default translate()(AlbumItem)
