/* global cozy */
import styles from '../styles/albumsList'
import classNames from 'classnames'

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { cozyConnect, getSharingDetails } from 'cozy-client'
import { SharedBadge } from 'sharing'

import { fetchAlbumPhotos } from '../ducks/albums'
import ImageLoader from '../components/ImageLoader'

const AlbumItemLink = ({ router, album, image, title, desc }) => {
  const parentPath = router.location.pathname
  return (
    <Link
      to={`${parentPath}/${album._id}`}
      className={styles['pho-album-link']}
    >
      {image}
      {title}
      {desc}
    </Link>
  )
}
const LinkedAlbumItem = withRouter(AlbumItemLink)

const ClickableAlbumItem = ({
  album,
  image,
  title,
  desc,
  onClick,
  disabled
}) => {
  return disabled ? (
    <div
      className={classNames(
        styles['pho-album-link'],
        styles['pho-album-link--disabled']
      )}
    >
      {image}
      <div>
        {title}
        {desc}
      </div>
    </div>
  ) : (
    <div onClick={() => onClick(album)} className={styles['pho-album-link']}>
      {image}
      <div>
        {title}
        {desc}
      </div>
    </div>
  )
}

const AlbumItemDesc = ({ t, photoCount, shared, thumbnail }) => (
  <h4 className={styles['pho-album-description']}>
    {(shared.byMe || shared.withMe) && (
      <SharedBadge
        byMe={shared.byMe}
        className={styles['pho-album-shared']}
        small={thumbnail}
      />
    )}
    {t('Albums.album_item_description', { smart_count: photoCount })}
    {(shared.byMe || shared.withMe) &&
      ` - ${t(
        `Albums.album_item_shared_${
          shared.sharingType === 'master-slave' ? 'ro' : 'rw'
        }`
      )}`}
  </h4>
)

export class AlbumItem extends Component {
  render() {
    const { t, album, shared, photos, onClick, thumbnail } = this.props
    const disabled = shared.readOnly
    if (photos.fetchStatus !== 'loaded') {
      return null
    }

    const coverPhoto = photos.data[0] || null
    const image = !coverPhoto ? (
      <div className={styles['pho-album-photo-item']} />
    ) : (
      <ImageLoader
        className={styles['pho-album-photo-item']}
        alt={`${album.name} album cover`}
        photo={coverPhoto}
        src={`${cozy.client._url}${coverPhoto.links.small}`}
      />
    )

    const desc = (
      <AlbumItemDesc
        t={t}
        album={album}
        shared={shared}
        thumbnail={thumbnail}
        photoCount={photos.count}
      />
    )

    const title = <h2 className={styles['pho-album-title']}>{album.name}</h2>

    return (
      <div className={styles['pho-album']}>
        {onClick ? (
          <ClickableAlbumItem
            album={album}
            image={image}
            title={title}
            desc={desc}
            onClick={onClick}
            disabled={disabled}
          />
        ) : (
          <LinkedAlbumItem
            album={album}
            image={image}
            title={title}
            desc={desc}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  shared: getSharingDetails(state, ownProps.album._type, ownProps.album._id)
})
const mapDocumentsToProps = ownProps => ({
  photos: fetchAlbumPhotos(ownProps.album.id)
})

export default cozyConnect(mapDocumentsToProps)(
  connect(mapStateToProps)(AlbumItem)
)
