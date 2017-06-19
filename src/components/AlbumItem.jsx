/* global cozy */
import styles from '../styles/albumsList'

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'

import { fetchAlbumCover } from '../ducks/albums'
import ImageLoader from './ImageLoader'

const isAlbumEmpty = album => !(album && album.photoCount)

const SharedIcon = () => (
  <div className={styles['pho-album-shared']}>
    <div className={styles['pho-album-shared-icon']} />
  </div>
)

export class AlbumItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      coverPhoto: null
    }
  }

  componentDidMount () {
    const { album } = this.props
    if (isAlbumEmpty(album) || !album.coverId) {
      return this.setState({ isLoading: false })
    }
    fetchAlbumCover(album)
      .then(photo => {
        this.setState({ coverPhoto: photo, isLoading: false })
      })
      .catch(error => {
        this.setState({ isLoading: false })
        console.log(error)
      })
  }

  render () {
    if (this.state.isLoading) {
      return null
    }
    const { t, album, shared, onClick } = this.props
    const { coverPhoto } = this.state

    const image = !coverPhoto
      ? <div
        className={styles['pho-album-photo-item']}
      />
      : <ImageLoader
        className={styles['pho-album-photo-item']}
        alt={`${album.name} album cover`}
        photo={coverPhoto}
        src={`${cozy.client._url}${coverPhoto.links.small}`}
      />
    const desc = <h4 className={styles['pho-album-description']}>
      {t('Albums.album_item_description',
        {smart_count: album.photoCount})
      }
      {shared && ` - ${t('Albums.album_item_shared_ro')}`}
    </h4>
    const title = <h2 className={styles['pho-album-title']}>{album.name}</h2>

    if (onClick) {
      return (
        <div className={styles['pho-album']}>
          <div onClick={() => onClick(album)} className={styles['pho-album-link']}>
            {image}{title}{desc}
          </div>
          {shared && <SharedIcon />}
        </div>
      )
    }
    const parentPath = this.props.router.location.pathname
    return (
      <div className={styles['pho-album']}>
        <Link to={`${parentPath}/${album._id}`} className={styles['pho-album-link']}>
          {image}{title}{desc}
        </Link>
        {shared && <SharedIcon />}
      </div>
    )
  }
}

export default translate()(withRouter(AlbumItem))
