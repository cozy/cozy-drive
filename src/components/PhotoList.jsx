import styles from '../styles/photoList'

import React, { Component } from 'react'
import Dimensions from 'react-dimensions'

import justifiedLayout from 'justified-layout'

import Empty from './Empty'
import Photo from './Photo'

import classNames from 'classnames'

const photoDimensionsFallback = {width: 1, height: 1}

// Returns pseudo responsive row height based on container width. Trying to get
// something between 190 and 240.
const adaptRowHeight = containerWidth => 180 + ((containerWidth || 1800) / 30)

export class PhotoList extends Component {
  render () {
    const { key, title, photos, selected, onPhotoToggle, containerWidth } = this.props
    // @see https://flickr.github.io/justified-layout/
    const layout = justifiedLayout(
      photos.map(photo => photo.metadata || photoDimensionsFallback),
      {
        containerWidth: containerWidth,
        targetRowHeight: adaptRowHeight(containerWidth),
        // Must be relevant with styles
        boxSpacing: {
          horizontal: 16,
          vertical: 16
        },
        containerPadding: {
          left: 32,
          right: 32
        }
      }
    )
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
            box={layout.boxes[index]}
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
