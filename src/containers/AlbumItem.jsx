/* global cozy */
import styles from '../styles/albumsList'
import classNames from 'classnames'

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'
import { cozyConnect } from '../lib/redux-cozy-client'

import { fetchAlbumPhotos } from '../ducks/albums'
import ImageLoader from '../components/ImageLoader'

const SharedIcon = ({ byMe }) => (
  <div className={styles['pho-album-shared']}>
    <div className={classNames(styles['pho-album-shared-icon'], styles[byMe ? '--by-me' : '--with-me'])} />
  </div>
)

export class AlbumItem extends Component {
  render () {
    const { t, album, photos, sharedByMe, sharedWithMe, onClick } = this.props
    if (photos.fetchStatus !== 'loaded') {
      return null
    }
    const coverPhoto = photos.data[0] || null

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
        {smart_count: photos.count})
      }
      {(sharedByMe || sharedWithMe) && ` - ${t('Albums.album_item_shared_ro')}`}
    </h4>
    const title = <h2 className={styles['pho-album-title']}>{album.name}</h2>

    if (onClick) {
      return (
        <div className={styles['pho-album']}>
          <div onClick={() => onClick(album)} className={styles['pho-album-link']}>
            {image}{title}{desc}
          </div>
          {(sharedByMe || sharedWithMe) && <SharedIcon byMe={false} />}
        </div>
      )
    }
    const parentPath = this.props.router.location.pathname
    return (
      <div className={styles['pho-album']}>
        <Link to={`${parentPath}/${album._id}`} className={styles['pho-album-link']}>
          {image}{title}{desc}
        </Link>
        {(sharedByMe || sharedWithMe) && <SharedIcon byMe={sharedByMe} />}
      </div>
    )
  }
}

const mapDocumentsToProps = (ownProps) => ({
  photos: fetchAlbumPhotos(ownProps.album)
})

export default withRouter(cozyConnect(mapDocumentsToProps)(AlbumItem))
