/* global cozy */
import styles from '../../../styles/albumsList'
import classNames from 'classnames'

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'

import { ImageLoader } from 'components/Image'

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

const AlbumItemDesc = translate()(
  ({ t, photoCount, shared = {}, thumbnail }) => (
    <h4 className={styles['pho-album-description']}>
      {/* (shared.byMe || shared.withMe) && (
        <SharedBadge
          byMe={shared.byMe}
          className={styles['pho-album-shared']}
          small={thumbnail}
        />
      ) */}
      {t('Albums.album_item_description', { smart_count: photoCount })}
      {(shared.byMe || shared.withMe) &&
        ` - ${t(
          `Albums.album_item_shared_${
            shared.sharingType === 'one-way' ? 'ro' : 'rw'
          }`
        )}`}
    </h4>
  )
)

export default class AlbumItem extends Component {
  render() {
    const { t, album, shared = {}, onClick, thumbnail } = this.props
    const disabled = shared.readOnly
    const photos = album.photos.data
    const coverPhoto = photos[0] || null
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
        photoCount={album.photos.count}
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
