import styles from '../../../styles/albumsList.styl'
import classNames from 'classnames'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import FileImageLoader from 'cozy-ui/transpiled/react/FileImageLoader'

import { SharedBadge, SharedDocument } from 'cozy-sharing'

const AlbumItemLink = ({ album, image, title, desc }) => {
  return (
    <Link to={album._id} className={styles['pho-album-link']}>
      {image}
      {title}
      {desc}
    </Link>
  )
}

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

const AlbumItemDesc = translate()(({ t, photoCount, album }) => (
  <h4 className={styles['pho-album-description']}>
    <SharedBadge
      docId={album.id}
      className={styles['pho-album-shared']}
      xsmall
    />
    <SharedDocument docId={album.id}>
      {({ isSharedWithMe, isSharedByMe, hasWriteAccess }) => {
        return (
          <span>
            {t('Albums.album_item_description', { smart_count: photoCount })}
            {(isSharedWithMe || isSharedByMe) &&
              ` - ${t(
                `Albums.album_item_shared_${hasWriteAccess ? 'rw' : 'ro'}`
              )}`}
          </span>
        )
      }}
    </SharedDocument>
  </h4>
))

export default class AlbumItem extends Component {
  render() {
    const { t, album, shared = {}, onClick, thumbnail } = this.props
    const disabled = shared.readOnly
    const photos = album.photos.data
    const coverPhoto = photos[0] || null
    const image = !coverPhoto ? (
      <div className={styles['pho-album-photo-item']} />
    ) : (
      <FileImageLoader
        file={coverPhoto}
        linkType="small"
        render={src => (
          <img
            src={src}
            className={styles['pho-album-photo-item']}
            alt={`${album.name} album cover`}
          />
        )}
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
      <div
        data-testid="pho-album"
        data-test-name={album.name}
        className={styles['pho-album']}
      >
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
          <AlbumItemLink
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
