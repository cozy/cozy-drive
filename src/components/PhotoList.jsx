import styles from '../styles/photoList'

import React from 'react'

import Empty from './Empty'
import Photo from './Photo'

import classNames from 'classnames'

export const PhotoList = ({ key, title, photos, selected, onPhotoToggle }) => {
  return (
    <div
      className={classNames(styles['pho-section'], selected.length && styles['pho-section--has-selection'])}
      key={key}
      >
      {!!title && <h3>{title}</h3>}
      {photos.map(photo =>
        <Photo
          photo={photo}
          key={photo._id}
          selected={selected.indexOf(photo._id) !== -1}
          onToggle={onPhotoToggle}
        />
      )}
      {photos.length === 0 && <Empty emptyType='photos' />}
    </div>
  )
}

export default PhotoList
