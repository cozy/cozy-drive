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

const AlbumItemLink = ({ router, album, image, title, desc }) => {
  const parentPath = router.location.pathname
  return (
    <Link to={`${parentPath}/${album._id}`} className={styles['pho-album-link']}>
      {image}
      {title}
      {desc}
    </Link>
  )
}
const LinkedAlbumItem = withRouter(AlbumItemLink)

const ClickableAlbumItem = ({ album, image, title, desc, onClick, disabled }) => {
  return disabled
  ? <div className={classNames(styles['pho-album-link'], styles['pho-album-link--disabled'])}>
    {image}
    <div>
      {title}
      {desc}
    </div>
  </div>
  : <div onClick={() => onClick(album)} className={styles['pho-album-link']}>
    {image}
    <div>
      {title}
      {desc}
    </div>
  </div>
}

export class AlbumItem extends Component {
  render () {
    const { t, album, photos, sharedByMe, sharedWithMe, onClick, disabled } = this.props
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
      {(sharedByMe || sharedWithMe) && <SharedIcon byMe={sharedByMe} />}
      {t('Albums.album_item_description',
        {smart_count: photos.count})
      }
      {(sharedByMe || sharedWithMe) && ` - ${t('Albums.album_item_shared_ro')}`}
    </h4>

    const title = <h2 className={styles['pho-album-title']}>{album.name}</h2>

    return (
      <div className={styles['pho-album']}>
        {
          onClick
          ? <ClickableAlbumItem album={album} image={image} title={title} desc={desc} onClick={onClick} disabled={disabled} />
          : <LinkedAlbumItem album={album} image={image} title={title} desc={desc} />
        }
      </div>
    )
  }
}

const mapDocumentsToProps = (ownProps) => ({
  photos: fetchAlbumPhotos(ownProps.album)
})

export default cozyConnect(mapDocumentsToProps)(AlbumItem)
