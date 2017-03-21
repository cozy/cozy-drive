import styles from '../styles/photoList'

import React, { Component } from 'react'
import Dimensions from 'react-dimensions'

import Empty from './Empty'
import Photo from './Photo'

import classNames from 'classnames'

export class PhotoList extends Component {
  render () {
    const { key, title, photos, selected, onPhotoToggle, containerWidth } = this.props
    return (
      <div
        className={classNames(styles['pho-section'], selected.length && styles['pho-section--has-selection'])}
        key={key}
        // Specify the width for making justified layout work.
        style={containerWidth ? `width:${containerWidth}px` : ''}
        >
        {!!title && <h3>{title}</h3>}
        {photos.map((photo, index) =>
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
}

export default Dimensions()(PhotoList)
