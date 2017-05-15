import styles from '../styles/albumsList'

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'
import { translate } from '../lib/I18n'

import { getPhotoLink } from '../actions/photos'

const isAlbumEmpty = album => !(album && album.photoCount)

const fetchMainPhoto = album =>
  isAlbumEmpty(album)
    ? Promise.resolve(null)
    : getPhotoLink(album.coverId)

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
    if (this.state.isLoading) {
      return null
    }
    const { t, album, onClick } = this.props
    const { url, isImageLoading } = this.state

    const image = <img
      className={styles['pho-album-photo-item']}
      onLoad={this.handleImageLoaded}
      style={isImageLoading ? 'display:none' : ''}
      alt={`${album.name} album cover`}
      src={url || ''}
    />
    const desc = <h4 className={styles['pho-album-description']}>
      {t('Albums.album_item_description',
        {smart_count: album.photoCount})
      }
    </h4>
    const title = <h2 className={styles['pho-album-title']}>{album.name}</h2>

    if (onClick) {
      return (
        <div className={styles['pho-album']}>
          <div onClick={() => onClick(album)} className={styles['pho-album-link']}>
            {image}{title}{desc}
          </div>
        </div>
      )
    }
    const parentPath = this.props.router.location.pathname
    return (
      <div className={styles['pho-album']}>
        <Link to={`${parentPath}/${album._id}`} className={styles['pho-album-link']}>
          {image}{title}{desc}
        </Link>
      </div>
    )
  }
}

export default translate()(withRouter(AlbumItem))
